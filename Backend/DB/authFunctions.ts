import { auth } from './connection';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

export const onLogin = async (username: string, pass: string) => {

    try {

        const userCredentials = await signInWithEmailAndPassword(auth, username, pass)

        return { uid: userCredentials.user.uid }

    } catch (error) {

        return {
            id: -1,
            message: "Usuario o contraseña incorrectos",
        };

    }


}

export const onSignOut = async (uid: string) => {
    try {

        await onAuthStateChanged(auth, function (user) {
            if (user && user.uid === uid) {

                signOut(auth);
            } else {
                return
            }
        })

        return
    } catch (error) {

    }
};