import firebaseConfig from "./firebaseConfig";

const addUser = async(name, email, image, uid) => {
    try {
        return await firebaseConfig.ref("/users/"+uid)
            .set({
                name: name,
                uniqname: email,
                email: email,
                image: image,
            });
    } catch (error) {
        console.log(error);
    }
}
export default addUser;