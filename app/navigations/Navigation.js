import React from 'react';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RestaurantStack from './RestaurantsStack';
import SearchStack from './SearchStack';
import TopRestaurantsStack from './TopRestaurantsStack';
import FavoritesStack from './FavoritesStack';
import MyAccountStack from './MyAccountStack';


const Tab = createBottomTabNavigator();

// crearemos aqui nuestros Stacks de navegacion ABAJO de la pantalla
export default function Navigation () {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName = "Restaurantes"
                tabBarOptions = {{
                    inactiveTintColor: "#646464",
                    activeTintColor: "#00a680",
                }}
                screenOptions = {({route}) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                })}
            >
                <Tab.Screen
                    name = "Restaurantes"
                    component = {RestaurantStack}
                />
                 <Tab.Screen
                    name = "Buscar"
                    component = {SearchStack}
                />
                <Tab.Screen
                    name = "Ranking"
                    component = {TopRestaurantsStack}
                />
                <Tab.Screen
                    name = "Favoritos"
                    component = {FavoritesStack}
                />
                <Tab.Screen
                    name = "Perfil"
                    component = {MyAccountStack}
                />               
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color) {
    let iconName;

    switch (route.name) {
        case "Restaurantes":
            iconName = "compass-outline"
            break;
        case "Buscar":
            iconName = "magnify"
            break;
        case "Ranking":
            iconName = "star-outline"
            break;
        case "Favoritos":
            iconName = "heart-outline"
            break;
        case "Perfil":
            iconName = "home-outline"
            break;
        default:
            break;
    }
    return (
        <Icon
            type = "material-community"
            name = {iconName}
            size = {22}
            color = {color}
        />
    )
}
