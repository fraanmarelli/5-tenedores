import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { ListItem } from 'react-native-elements';
import { map } from 'lodash';
import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function AccountOptions(props) {
    const {userInfo, toastRef, setReloadUser} = props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);
   
    const selectedComponent = (key) => {
      switch (key) {
        case "displayName":
          setRenderComponent(
            <ChangeDisplayNameForm
                displayName={userInfo.displayName}
                setShowModal={setShowModal}
                toastRef={toastRef}
                setReloadUser={setReloadUser}
            />
          );
          setShowModal(true);
          break;
        case "email":
          setRenderComponent(
              <ChangeEmailForm
                email={userInfo.email}
                setShowModal={setShowModal}
                toastRef={toastRef}
                setReloadUser={setReloadUser}
              />
          );
          setShowModal(true);
          break;
        case "password":
          setRenderComponent(
            <ChangePasswordForm
                password={userInfo.password}
                setShowModal={setShowModal}
                toastRef={toastRef}
            />
          );
          setShowModal(true);
          break;
        default:
          setRenderComponent(null);
          setShowModal(false);
          break;
      }
    };

    const menuOptions = generateOptions(selectedComponent);
    // console.log(menuOptions);
 
    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem
                    key={index}
                    title={menu.title}
                    leftIcon= {{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft,
                    }}
                    rightIcon= {{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight,
                    }}
                    containerStyle= {styles.menuItem}
                    onPress = { menu.onPress }
                />
            ))}

            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                   {renderComponent}
                </Modal>
            )}

        </View>
    )
}

function generateOptions(selectedComponent) {
    return [
        {
            title: "Cambiar nombre y apellido",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("displayName")
        },
        {
            title: "Cambiar email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("email")
        },
        {
            title: "Cambiar password",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("password")
        },
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3"
    },
});