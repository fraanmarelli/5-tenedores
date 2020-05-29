import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import {size} from 'lodash';
import {reauthenticate} from '../../utils/api';

export default function ChangePasswordForm(props) {
    const {toastRef, password, setShowModal} = props;

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text});
    }

    const onSubmit = async () => {
        setError({});
        
        if (!formData.password) {
            setError({password: "La contraseña no puede estar vacía",});
        }else if (!formData.newPassword) {
            setError({newPassword:  "La nueva contraseña no puede estar vacía",});
        }else if(!formData.repeatNewPassword){
            setError({repeatNewPassword:  "Por favor reescriba la nueva contraseña",});
        } else if (formData.newPassword !== formData.repeatNewPassword){
            setError({
                newPassword: "Las contraseñas no son iguales",
                repeatNewPassword: "Las contraseñas no son iguales",
            });
        } else if(size(formData.newPassword) < 6 ){
            setError({
                newPassword: "La nueva contraseña debe tener al menos 6 carecteres",
            });    
        } else {
            setIsLoading(true);
            await reauthenticate(formData.password)
            .then(async () => {
                await firebase
                .auth()
                .currentUser.updatePassword(formData.newPassword)
                .then( () => {
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                })
                .catch(() => {
                    setIsLoading(false);
                    setError({ password: "Error al actualizar la contraseña" });
                })
            })
            .catch( () => {
                setIsLoading(false);
                setError({
                    password: "La contraseña no es correcta",
                })
            })
        }
    };

    return (
        <View style={styles.view}> 
            <Input
                containerStyle={styles.input}
                placeholder="Contraseña Actual"
                password={true}
                secureTextEntry={showPassword ? false : true}
                 rightIcon= {
                    <Icon
                        type= "material-community"
                        name= {showPassword ? "eye-outline" : "eye-off-outline"}
                        color= "#c2c2c2"
                        onPress= {() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) => onChange(e, "password")}
                errorMessage={error.password}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Nueva Contraseña"
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon= {
                    <Icon
                        type= "material-community"
                        name= {showPassword ? "eye-outline" : "eye-off-outline"}
                        color= "#c2c2c2"
                        onPress= {() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={error.newPassword}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Repita Nueva Contraseña"
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon= {
                    <Icon
                        type= "material-community"
                        name= {showPassword ? "eye-outline" : "eye-off-outline"}
                        color= "#c2c2c2"
                        onPress= {() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={error.repeatNewPassword}
            />
            <Button
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                title="Aplicar Cambios"
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

function defaultValue() {
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: "",
    }
};

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: '95%',
    },
    btn: {
        backgroundColor: '#00a680',
    },
});