import React, { useEffect, useState } from 'react';
import {View, StyleSheet} from "react-native";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import addUser from "../firebase/addUser";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../firebase/firebaseConfig';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { StackActions } from '@react-navigation/native';


const AuthScreen = ({navigation}) => {
    const [loader, setLoader] = useState(false);
    const checkUserExist = () => {
        return new Promise((resolve, reject) => {

            AsyncStorage.getItem("UID").then((uid) => {
                console.log(uid);
                if(!uid){
                    return reject(true);
                }
                firebaseConfig.ref("/users/"+ uid)
                .once("value")
                .then(snapshot => {
                    //console.log("user data", snapshot.val());
                    if(snapshot.val()){
                        return resolve(snapshot.val().name);
                    }else{
                        return reject (false);
                    }
                });
                
            }).catch((error) => {
                console.log(error);
            });
        })
    }

    useEffect(() =>{
      setLoader(true);
        checkUserExist()
            .then((res) => {
                //navigation.navigate("ChatScreen", {name: res});
                navigation.dispatch(
                  StackActions.replace("ChatScreen", {name: res})
                );
                setLoader(false);
                //console.log("login present");
            }).catch((err) => {
                setLoader(false);
                if(err === false){
                    alert("Account not found. Sign in.")
                }
                navigation.navigate("AuthScreen");
            })
        
        GoogleSignin.configure({
          webClientId: '923021032427-oervqggaqlpbnkaqbvf3vci4q25nr7v7.apps.googleusercontent.com',
        });
      }, []);
    
    
      const signIn = async () => {
        try {
          // Check if your device supports Google Play
          await GoogleSignin.hasPlayServices();
    
          const { idToken } = await GoogleSignin.signIn();
          setLoader(true);
          // Create a Google credential with the token
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
          const userInfo = auth().signInWithCredential(googleCredential);
          userInfo.then(async (userInfo) => {
            console.log(userInfo);
            profileInfo = userInfo["additionalUserInfo"]["profile"];
            console.log(profileInfo["name"]);
            console.log(userInfo["user"]["uid"]);
            console.log(userInfo["additionalUserInfo"]["isNewUser"]);
            if(userInfo["additionalUserInfo"]["isNewUser"] === true){
              addUser(profileInfo["name"], profileInfo["email"], profileInfo["picture"], userInfo["user"]["uid"]);
            }
            await AsyncStorage.setItem("UID", userInfo["user"]["uid"]);
            setLoader(false);
            //navigation.navigate("ChatScreen", {name: profileInfo["name"]});
            navigation.dispatch(
              StackActions.replace("ChatScreen", {name: profileInfo["name"]})
            );

          }).catch((error) => {
            console.log(error);
            setLoader(false);
          });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
          setLoader(false);
        }
      };

    return(
        <View style={styles.container}>
            <GoogleSigninButton
            style={{ width: 200, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
            />
            <Spinner 
              visible={loader}
            />
        </View>
    )
}

export default AuthScreen;

const styles = StyleSheet.create({
    container:{
      flex:1,
      alignItems: "center",
      justifyContent: "center"
    },
  })