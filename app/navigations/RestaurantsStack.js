import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurant from '../screens/Restaurants/AddRestaurant';

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "Restaurantes"
                component = {Restaurants}
            />
            <Stack.Screen
                name = "Add-Restaurant"
                component = {AddRestaurant}
                options = {{title: "Añadir un nuevo Restaurant"}}
            />
        </Stack.Navigator>
    )
}