import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import { size } from 'lodash';
import { Directions } from 'react-native-gesture-handler';

export default function ListOfRestaurants(props) {
  const { restaurants } = props;


  return (
    <View>
      {size(restaurants) > 0 ? (
        <FlatList
            data= {restaurants}
            renderItem={() => <Text>HOLA</Text>}
            keyExtractor= {(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loadingRestaurants}>
          <ActivityIndicator
            size="large"
          />
          <Text>Cargando Restaurantes.. </Text>
        </View>
      )}
    </View>
  );
}

function DeployRestaurantList(props) {
    const {restaurants} = props;
    
    const goToRestaurant = () => {
        console.log("OK");
    }

    return (
        <TouchableOpacity>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    loadingRestaurants: {
        marginVertical: 10, 
        alignItems: 'center',  
    },
    viewRestaurant: {
        flexDirection: 'row',
        margin: 10,
    }, 
    viewRestaurantImage: {
        marginRight: 15,
    }
});