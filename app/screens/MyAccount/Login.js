import React, { useRef } from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import  Toast from 'react-native-easy-toast';
import LoginForm from '../../components/MyAccount/LoginForm';

export default function Login() {
    const toastRef = useRef();
    return (
        <ScrollView>
            <Image
                source= {require("../../../assets/img/logo.png")}
                resizeMode= "contain"
                style = {styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef = {toastRef}/>
                <CreateAccount />
            </View>  
            <Divider style={styles.divider}/>
            <Text>Social Login</Text>
            <Toast ref={toastRef} position="center" opacity={0.9}/>  
        </ScrollView>
    )
}

function CreateAccount () {
    const navigation = useNavigation();
    return (
    <View>
        <Text style={styles.textRegister}> ¿Aún no tienes una cuenta?
            <Text
             style={styles.btnRegister}
             onPress= { () =>
                navigation.navigate("Register")
             } > Registrate. </Text>
        </Text>
    </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        marginTop: 20,
        height: 150
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10,
    },
    btnRegister: {
        fontWeight: "bold",
        color: "#00a680",
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40,
    }
});