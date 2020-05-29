import React, {useState} from 'react';
import { StyleSheet, View} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';     
import { validateEmail } from '../../utils/validations';
import Loading from "../Loading";

export default function LoginForm(props) {
    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState(defaultFormValue());
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const onChange = (e, type) => {
       setFormData({...formData, [type]: e.nativeEvent.text})
    }
    
    const onSubmit = () => {
        if 
        (isEmpty(formData.email) || isEmpty(formData.password)) {
            toastRef.current.show("TODOS LOS CAMPOS SON OBLIGATRIOS");
        }else if
        (!validateEmail(formData.email)) {
            toastRef.current.show("EL EMAIL INGRESADO NO ES VALIDO");
        }else {
            setLoading(true);
            firebase
            .auth()
            .signInWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                setLoading(false);
                navigation.navigate("Mi Cuenta")
            })
            .catch(() => {
                setLoading(false);
                toastRef.current.show("EMAIL O PASSWORD INCORRECTA")
            })
        }
    }
           
    return (
        <View style={styles.formContainer}>
            <Input
                placeholder = "Correo Electronico"
                style = {styles.inputForm}
                onChange = {(e) => onChange(e, "email")}
                rightIcon = {
                    <Icon
                        type = "material-community"
                        name = "at"
                        iconStyle = {styles.iconRight}
                    />
                }
            />
            <Input
                placeholder = "Contraseña"
                style = {styles.inputForm}
                password = {true}
                secureTextEntry = {showPassword ? true : false}
                onChange = {(e) => onChange(e, "password")}
                rightIcon = {
                    <Icon
                        type = "material-community"
                        name = {showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle = {styles.iconRight}
                        onPress = { () => 
                            setShowPassword(!showPassword)
                        }
                    />
                }
            />
            <Button
                title = "Iniciar Sesion"
                containerStyle = {styles.btnContainerLogin}
                buttonStyle = {styles.btnLogin}
                onPress = { () => 
                    onSubmit()
                }
            />
            <Loading isVisible={loading} text="Iniciando Sesion.."/>
        </View>
    )
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    },
});