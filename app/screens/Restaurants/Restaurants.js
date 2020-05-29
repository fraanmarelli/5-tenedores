import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import { firebaseApp } from '../../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ListOfRestaurants from '../../components/Restaurants/ListOfRestaurants';

const db = firebase.firestore(firebaseApp);
const limitRestaurantList = 10;


export default function Restaurants(props) {
    const {navigation} = props;

    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);  
        })
    }, [])

    useEffect(() => {
      db.collection("restaurants")
        .get()
        .then((snap) => {
          setTotalRestaurants(snap.size);
        });

      const resultRestaurants = [];

      db.collection("restaurants")
        .orderBy("createdAt", "desc")
        .limit(limitRestaurantList)
        .get()
        .then((response) => {
            setStartRestaurants(response.docs[response.docs.length -1]);
        
            response.forEach((doc) => {
                const restaurant = doc.data();
                restaurant.id = doc.id;
                resultRestaurants.push(restaurant);
            });
            setRestaurants(resultRestaurants);
        });
    }, []);

    return(
        
        <View style={styles.viewBody}>
            <ListOfRestaurants
                restaurants={restaurants}            
            />

            {user && (
            <Icon
                type="material-community"
                name="plus"
                color="#00a680"
                containerStyle={styles.btnContainer}
                reverse
                onPress={() =>navigation.navigate("Add-Restaurant")}
            />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: '#fff',
    },
    btnContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        shadowColor: 'black',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
    },
});