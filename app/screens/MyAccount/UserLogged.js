import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as firebase from 'firebase';
import { Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import InfoUser from '../../components/MyAccount/InfoUser';
import AccountOptions from '../../components/MyAccount/AccountOptions';

export default function UserLogged() {    
    const toastRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    //useState para guardar los datos del usuario logeado
    const [userInfo, setUserInfo] = useState(null);
    const [reloadUser, setReloadUser] = useState(null);

    //useEffect para agarrar los datos del usuario logeado si es que es asi.
    useEffect( () => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
        setReloadUser(false);
    }, [setReloadUser]);

    return (
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser 
                            toastRef={toastRef}     
                            userInfo={userInfo}
                            setLoading={setLoading}
                            setLoadingText={setLoadingText}
                            /> }
            <AccountOptions userInfo={userInfo} toastRef={toastRef} setReloadUser={setReloadUser}/>
        <Button
            title="Cerrar Sesion"
            buttonStyle={styles.btnCloseSession}
            titleStyle= {styles.btnCloseSessionText}
            onPress= { () => 
                firebase.auth().signOut()
            }
        />
        <Toast ref= {toastRef} position="center" opacity={0.9} />
        <Loading text={loadingText} isVisible={loading}/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1, 
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSessionText: {
        color: "#00a680"
    },
})