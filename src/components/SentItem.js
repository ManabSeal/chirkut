import React, { useState, useEffect, memo } from "react";
import {View, StyleSheet, Text, Image, Modal} from "react-native";
import storage from '@react-native-firebase/storage';
import { Icons } from "./Icons";
import Pressable from "./Pressable";
import { requestWritePermission } from "../firebase/permission";
import downloadImage from "../firebase/downloadImage";



const SentItem = React.memo((props) => {
    let [imageURL, setImageURL] = useState("");
    let [modalVisible, setModalVisible] = useState(false);
    let [datetime, setDatetime] = useState("");
    useEffect(() => {
        const fetchImageURL = async () => {
            try {
              if (props.image !== "") {
                const url = await storage().ref(props.image).getDownloadURL();
                setImageURL(url);
              }
            } catch (error) {
              console.log("Error retrieving image:", error);
            }
          };
      
          fetchImageURL();      
        /*const image = props.image == "" ? "" : storage().ref(props.image).getDownloadURL()
            .then((url) => {
                setImageURL(prevImageURL => url);
                imageURL = url;
                console.log(url);
            }).catch(err =>{
                console.log("could not find picture");
            });*/
        //console.log(props.image);
        const date = new Date(props.timestamp);
        const timestamp = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
        setDatetime(prevDatetime => timestamp);
        datetime = timestamp;
    }, [props.image]);

    const onDownload = () => {
        requestWritePermission().then(res => {
            if(res == true){
                downloadImage(imageURL, props.image);
            }else{
                return;
            }
        })
    };
    

    return (
        <View style={styles.container}>
            <Modal 
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.openedView}>
                    <Image source={imageURL ? {uri: imageURL} : Icons.loading} style={styles.openedImage}/>
                </View>
            </Modal>
            { props.image == "" && 
            <View style={styles.msgBox}>
                <Text style={styles.msgText}>{props.message}</Text>
                <Text style={styles.time}>{datetime}</Text>
            </View>}
            {props.message == "" && 
            <View style={styles.imageContainer}>
                <Pressable afterCol={"#e8e7e6"} style={styles.downloadButton} onPress={onDownload}>
                    <Image source={Icons.download} style={styles.downloadIcon}/>
                </Pressable>
                <Pressable beforeCol={"white"} afterCol={"white"} style={styles.imageBox} onPress={() => setModalVisible(!modalVisible)}>
                    <Image source={imageURL !== "" ? {uri: imageURL} : Icons.loading} style={styles.image}/>
                    <Text style={styles.time}>{datetime}</Text>
                </Pressable>
            </View>}
        </View>
    )
});

export default memo(SentItem);

const styles = StyleSheet.create({
    container:{
        width: "100%"
    },
    msgBox:{
        backgroundColor: "white",
        elevation: 10,
        alignSelf: 'flex-end',
        margin: 8,
        marginLeft: 30,
        padding: 8,
        borderRadius: 10,
        minWidth: 150,
    },
    imageContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    imageBox:{
        backgroundColor: "white",
        elevation: 10,
        margin: 8,
        marginLeft: 4,
        padding: 8,
        borderRadius: 10,
        height: 320,
        width: 300,
        justifyContent: 'space-between'
    },
    userName:{
        alignSelf: "flex-end",
        marginHorizontal: 8,
        
    },
    msgText:{
        color: "black",
        alignSelf: 'flex-start'
    },
    image:{
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf:'flex-start'
    },
    downloadButton:{
        borderRadius: 18,
        padding: 10
    },
    downloadIcon:{
        height: 30,
        width: 30
    },
    openedView:{
        flex:1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
    },
    openedImage:{
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    time:{
        alignSelf: 'flex-end',
        color: 'gray',
        fontSize: 11,
    }
})