import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function ChangeDisplayNameForm(props) {
    const {displayName, toastRef, setShowModal, setReloadUser} = props;

    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = () => {
       setError(null);
       if (!setNewDisplayName) {
           setError("Ningun nombre fue ingresado");
       } else if (displayName === setNewDisplayName) {
           setError("El nombre nuevo debe ser distinto del anterior"); 
       } else {
           const update = {
               displayName: newDisplayName,
           }

            firebase
           .auth()
           .currentUser.updateProfile(update)
           .then( () => {
                setReloadUser(true);
                setShowModal(false);
           })
           .catch(() => {
               setError("Error al actualizar el nombre");
           })
       }
    };

    return (
        <View style={styles.view}>
            <Input
                placeholder= "Nombre y Apellido"
                containerStyle={styles.input}
                rightIcon= {{
                    type: 'material-community',
                    name: 'account-circle-outline',
                    color: '#c2c2c2',
                }}
                defaultValue={displayName || ""}
                onChange={(e) =>  setNewDisplayName(e.nativeEvent.text)}
                errorMessage= {error}
            />
            <Button
                title= "Aplicar Cambios"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
            />
        </View>

    )
}

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