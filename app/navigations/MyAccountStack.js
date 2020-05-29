import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyAccount from '../screens/MyAccount/MyAccount/';
import Login from '../screens/MyAccount/Login';
import Register from '../screens/MyAccount/Register';

const Stack = createStackNavigator();

export default function MyAccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "Mi Cuenta"
                component = {MyAccount}
            />
            <Stack.Screen
                name = 'Login'
                component = {Login}
                options = {{ title: "Iniciar Sesion"}}
            />
            <Stack.Screen
                name = 'Register'
                component = {Register}
                options = {{ title: "Registro"}}
            />
        </Stack.Navigator>
    )
}