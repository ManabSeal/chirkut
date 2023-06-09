import React from "react";
import { PermissionsAndroid } from "react-native";

export const requestWritePermission = async () => {
    try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Storage Permission Required",
                message: "App needs access to your storage to download photos.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "Ok"
            },
        );
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            console.log("granted");
            return true;
        }else{
            console.log("denied");
            alert("Permission is required to download the image.");
            return false;
        }
    }catch(err){
        console.log(err);
        alert("Error Occured");
    }    
};

export const requestReadPermission = async () => {
    try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: "Storage Permission Required",
                message: "App needs access to your storage to download photos.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "Ok"
            },
        );
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            console.log("granted");
            return true;
        }else{
            console.log("denied");
            alert("Permission is required to send image.");
            return false;
        }
    }catch(err){
        console.log(err);
        alert("Error Occured");
    }    
};