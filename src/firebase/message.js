import firebaseConfig from "./firebaseConfig";
import storage from '@react-native-firebase/storage';


export const sendMsg = async(name, message, image, pathToFile) => {
    if (message === "" && image === ""){
        return null;
    }
    try{
        const messageRef = firebaseConfig.ref("/message/").push();
        const imageName = pathToFile == "" ? "" : messageRef.key+image; 
        if(pathToFile != ""){
            const reference = storage().ref(imageName);
            reference.putFile(pathToFile).then((res) => {
                console.log("uploaded");
                return messageRef.set({
                    name: name, 
                    message: message,
                    image: imageName,
                    timestamp: Date.now()
                });
            }).catch((err) =>{
                console.log("An error occured!");
            });
        }else{
            return messageRef.set({
                name: name, 
                message: message,
                image: imageName,
                timestamp: Date.now()
            });
        }
        //{name: name, message: message}
    } catch(error){
        return error;
    }
}

export const sendMsg2 = async(name, image, data, link) => {
    try{
        const messageRef = firebaseConfig.ref("/message/").push();
        const imageName = data == "" ? "" : messageRef.key+image; 
        if(data != ""){
            const reference = storage().ref(imageName);
            reference.putString(data, 'base64').then((res) => {
                console.log("uploaded");
                return messageRef.set({
                    name: name,
                    message: "",
                    image: imageName,
                    timestamp: Date.now()
                });
            }).catch((err) =>{
                console.log("An error occured!");
            });
        }
        else{
            return;
        }
        //{name: name, message: message}
    } catch(error){
        return error;
    }
}

export const recieveMsg = ({set}) => {
    try{
        firebaseConfig.ref("/message/").orderByKey()
            .once("value", snapshot => {
                //let arr = [];
                /*snapshot.forEach(child => {
                    arr.unshift(child.val());
                });
                set(arr);*/
                set(snapshot.val() ? Object.values(snapshot.val()).sort((a,b) => b.timestamp - a.timestamp): []);
                //set(prevMsg => snapshot.val() === null ? {} : snapshot.val());

                //set(prevMsgs => snapshot.val() === null? {} : snapshot.val());
                //console.log(msg);
                //console.log(snapshot.val());
                //set(prevMsgs => snapshot.val() === null? {}:snapshot.val())
                //return snapshot.val();
            });
        firebaseConfig.ref("/message/").orderByChild("timestamp")
            .startAt(Date.now()).on('child_added', function(snapshot){
                set(prevMsgs => [snapshot.val(), ...prevMsgs]);
            });
    } catch(error){
        return error;
    }
}
