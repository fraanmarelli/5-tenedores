import React, {useState} from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { size, isEmpty } from 'lodash';
import { validateEmail } from '../../utils/validations';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import Loading from '../Loading';

export default function RegisterForm(props) {
    //props para pasar a Register.js (papa) el valor 
    const { toastRef } = props;
    
    //creamos un State para mostrar contrasena o no mostrarla
    const [showPassword, setShowPassword] = useState(true);
    const [showRepeatPassword, setShowRepeatPassword] = useState(true);
    
    //vamos a guardar en un State todos los datos ingresados por el usuario para luego mandarlo a firebase
    //para eso creamos un nuevo state con un objeto vacio
    const [formData, setFormData] = useState(defaultFormValue());

    //creamos variable para meterle el useNavigation
    const navigation = useNavigation();

    //creamos un State para cambiar si es loading al crear usuario o no
    const [loading, setloading] = useState(false);
    
    //creamos funcion para que cuando presionemos Registrarme se guarden los datos en el State.
    const onSubmit = () => {
        if (
        isEmpty(formData.email) ||
        isEmpty(formData.password) ||
        isEmpty(formData.repeatPassword)               
        ){
            toastRef.current.show("TODO es obligatorio");
        } else if(!validateEmail(formData.email)){
            toastRef.current.show("El EMAIL no es correcto")
        } else if(formData.password !== formData.repeatPassword) {
            toastRef.current.show("Las dos PASSWORDS deben coincidir");
        } else if(size(formData.password )< 6){
            toastRef.current.show("La PASSWORD debe tener al menos 6 caracteres")
        } else {
            setloading(true);
            firebase
            .auth()
            .createUserWithEmailAndPassword(formData.email, formData.password)
            .then( () => {
                setloading(false);
                navigation.navigate("Mi Cuenta")
            })
            .catch( () => {
                setloading(false);
                toastRef.current.show("El mail ya está en uso, por favor intente con otro");
            })
            
        }
    }
    //funcion que se encargara de actualizar nuestro State. La misma recibira el evento y el tipo de imput
    //que se esta modificando (email, pass, etc)
    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder = "Correo Electronico"
                containerStyle = {styles.containerForm}
                onChange = {(e) => onChange(e, "email")}
                rightIcon =
                    {<Icon 
                        type="material-community"
                        name="at"
                        iconStyle = {styles.iconRight}
                        />}
            />
            <Input
                placeholder = "Contraseña"
                containerStyle = {styles.containerForm}
                password = {true}
                secureTextEntry = {showPassword ? true : false}
                onChange = {(e) => onChange(e, "password")}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress= { () =>
                            setShowPassword(!showPassword)
                        }
                    />
                }
            />
            <Input
                placeholder = "Repetir Contraseña"
                containerStyle = {styles.containerForm}
                password = {true}
                secureTextEntry = {showRepeatPassword ? true : false}
                onChange = {(e) => onChange(e, "repeatPassword")}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress = { () =>
                            setShowRepeatPassword(!showRepeatPassword)
                        }
                    />
                }
            />
            <Button 
                title = "Unirse"
                containerStyle = {styles.btnContainerRegister}
                buttonStyle = {styles.btnRegister
                }
                //dato de color: el onSubtmit no lleva los () al final.. CURIOSO
                onPress = {onSubmit}
            />
            <Loading
                isVisible = {loading}
                text = "Creando Usuario.."
            />
        </View>
    );
}

//creamos funcion que cree todo los datos del objeto del state formData
function defaultFormValue() {
    return {
        email: '',
        password: '',
        repeatPassword: ''
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    containerForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "100%",
    },
    btnRegister: {
        backgroundColor: "#00a680",

    },
    iconRight: {
        color: "#c1c1c1",

    }
});