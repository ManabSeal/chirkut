import React, { useEffect, useState } from "react";
import {View, StyleSheet, Text, TextInput, FlatList, Image, Alert} from "react-native";
import Pressable from "../components/Pressable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendMsg, sendMsg2, recieveMsg} from "../firebase/message";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import SentItem from "../components/SentItem";
import RecieveItem from "../components/RecieveItem";
import Spinner from "react-native-loading-spinner-overlay";
import { StackActions } from "@react-navigation/native";
import { Icons } from "../components/Icons";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { requestReadPermission } from "../firebase/permission";
import 'react-native-image-keyboard';


const ChatScreen = ({route, navigation}) => {
    const [msgText, setMsgText] = useState("");
    const [msgs, setMsgs] = useState([]);
    const [loader, setLoader] = useState(false);
    const userName = route.params.name;
    useEffect(() => {
        setLoader(true);
        recieveMsg({set: setMsgs});
        //console.log(msgs);
        GoogleSignin.configure({
            webClientId: '923021032427-oervqggaqlpbnkaqbvf3vci4q25nr7v7.apps.googleusercontent.com',
          });
        setLoader(false);

    }, []);

    const changeMsgState = (enteredText) =>{
        setMsgText(prevText => enteredText);
    }


    const sendMessage = () => {
        sendMsg(userName, msgText, "", "");
        setMsgText(prevText => "");
    }

    const _sendImage = (event) => {
        const {uri, linkUri, mime, data} = event.nativeEvent;
        //console.log("uri uri baba", uri, linkUri, mime);
        let imageName = mime.split("/")[1];
        //console.log(imageName);
        sendMsg2(userName,imageName, data, linkUri);
    }


    const openGallery = () =>{
        requestReadPermission().then(res => {
            if(res === true){
                launchImageLibrary("photo", (response) => {
                    console.log('res', response);
                    if(response.assets){
                        console.log(response.assets[0].uri);
                        const type = response.assets[0].type;
                        let imageName = "";
                        if(type ==="image/jpeg" || type ==="image/jpg"){
                            imageName = ".jpg";
                        }else if(type === "image/png"){
                            imageName = ".png";
                        }else if(type === "image/gif"){
                            imageName = ".gif";
                        }else{
                            Alert.alert("Not Supported", "Image type is not supported(only jpg/png/gif)!",[
                                {text: "OK"}
                            ]);
                            return;
                        }
                        const pathToFile = response.assets[0].uri;
                        sendMsg(userName, "", imageName, pathToFile);
                    }
                });
            }else{
                return;
            }
        });
    }

    const logout = async() => {
        try {
            await GoogleSignin.signOut();
          } catch (error) {
            console.error(error);
          }
        await AsyncStorage.removeItem("UID");
        //navigation.navigate("AuthScreen");
        navigation.dispatch(
            StackActions.replace("AuthScreen")
        );
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Webchat</Text>
                <Pressable onPress={logout} style={styles.logoutButton} beforeCol={"white"} afterCol={"#ebe9e6"}>
                    <Text style={styles.buttonText}>
                        LogOut
                    </Text>
                </Pressable>
            </View>
            <FlatList 
                data={msgs}
                renderItem={({item}) => {
                    if(item.name === userName){
                        return <SentItem message={item.message} image={item.image} timestamp = {item.timestamp}/>
                    }
                    else{
                        return <RecieveItem message={item.message} name={item.name} image={item.image} timestamp = {item.timestamp}/>
                    }
                }
                }
                keyExtractor={(item, index) => index}
                style={styles.msgContainer}
                inverted={true}
        
            />
            <View style={styles.msgBox}>
                <View style={styles.msgInput}>
                    <TextInput placeholder="Message" style={styles.msgInputBox} placeholderTextColor="gray" onChangeText={changeMsgState} value={msgText} onImageChange={_sendImage}></TextInput>
                    <Pressable beforeCol={'#ffffff'} afterCol={'#f0ebeb'} style={styles.attachButton} onPress={openGallery}>
                        <Image source={Icons.attach} style={styles.attachIcon}/>
                    </Pressable>
                </View>
                <Pressable beforeCol={"#1ba1fa"} afterCol={"#1473b3"} style={styles.sendButton} onPress={sendMessage}>
                    <Image source={Icons.send} style={styles.sendIcon} />
                </Pressable>
            </View>
            <Spinner visible={loader}/>
        </View>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "white"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        width: "100%",
        padding: 15,
        marginBottom: 8,
        backgroundColor: "white",
        elevation: 8,
    },
    headerText: {
        fontSize: 20,
        color: "black",
        fontWeight: "600"
    },
    msgBox:{
        flexDirection: "row",
        position: "absolute",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 8,
        bottom: 0,
        width: "100%",
        height: 60,
    },
    msgInput:{
        width: "80%",
        backgroundColor: 'white',
        elevation: 15,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    msgInputBox:{
        width: "85%",
        backgroundColor: "white",
        //elevation: 10,
        borderRadius: 20,
        padding: 8,
        color: 'black'
    },
    attachIcon:{
        height: 30,
        width: 30,
    },
    attachButton:{
        borderRadius: 18,
        padding: 8
    },
    sendButton:{
        padding: 8,
        width: 50,
        alignItems: "center",
        borderRadius: 6,
        elevation: 3,
        backgroundColor: "white" 
    },
    sendIcon:{
        width: '60%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    msgContainer:{
        marginBottom: 60,
        backgroundColor: "white"
    },
    buttonText:{
        color: "gray"
    },
    logoutButton:{
        padding: 10,
        borderRadius: 12
    }
});
//<Text style={{color: "black", fontWeight: "500"}}>Send</Text>