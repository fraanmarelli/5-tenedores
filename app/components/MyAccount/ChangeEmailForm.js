import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import {validateEmail} from '../../utils/validations'; 
import {reauthenticate} from '../../utils/api';

export default function ChangeEmailForm (props) {
    const {toastRef, email, setShowModal, setReloadUser} = props;
    const [formData, setFormData] = useState(defaultFormData());
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text});
    }
    
    const onSubmit = () => {
      setError({});
      if (!formData.email || email === formData.email) {
        setError({
          email: "El email no ha cambiado",
        });
      } else if (!validateEmail(formData.email)) {
        setError({
          email: "El email ingresado es incorrecto",
        });
      } else if (!formData.password) {
        setError({
          password: "La contraseña esta vacia",
        });
      } else {
        setIsLoading(true);
        reauthenticate(formData.password)
          .then(() => {
            firebase
              .auth()
              .currentUser.updateEmail(formData.email)
              .then(() => {
                setIsLoading(false);
                setReloadUser(true);
                toastRef.current.show("El email se ha modificado con éxito");
                setShowModal(false);
              })
              .catch(() => {
                setError({
                  email: "Error al actualizar el email",
                });
                setIsLoading(false);
              });
          })
          .catch(() => {
            setIsLoading(true);
            setError({
              password: "La contraseña ingresada es incorrecta",
            });
          });
      }
    };
    
    return (
        <View style={styles.view}>
            <Input 
                defaultValue={email || ""}
                placeholder= "Nuevo email"
                containerStyle={styles.input}
                rightIcon= {{
                    type: 'material-community',
                    name: 'at',
                    color: '#c2c2c2',
                }}
                onChange={(e) => onChange(e, "email")}
                errorMessage= {error.email}
            />
            <Input
                placeholder= "Constraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={ showPassword ? false : true}
                rightIcon= {
                    <Icon
                        type = 'material-community'
                        name = { showPassword ? 'eye-off-outline' : 'eye-outline' }
                        color = '#c2c2c2'
                        onPress = {() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) => onChange(e, "password")}
                errorMessage={error.password} 
            />
            <Button 
                title="Guardar Cambios"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress= {onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

function defaultFormData() {
    return {
        email: "",
        password: "",
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