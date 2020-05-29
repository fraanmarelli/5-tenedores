import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Input, Button, Icon, Image, Avatar } from "react-native-elements";
import { map, size, filter } from 'lodash';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import uuid from 'random-uuid-v4';
import Modal from '../Modal';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { firebaseApp } from '../../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);



const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  
  const { toastRef, navigation, setIsLoading } = props;
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMaps, setIsVisibleMaps] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = () => {
    if (!restaurantName || !restaurantAddress || !restaurantDescription) {
      toastRef.current.show("Por favor complete todos los campos");
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show("Por favor suba al menos una foto del restaurant");
    } else if (!locationRestaurant) {
      toastRef.current.show("Por favor ubique el restaurant en el mapa");
    } else {
      setIsLoading(true);
      addImageStorage().then((response) => {
        setIsLoading(false);
        db.collection("restaurants")
          .add({
            name: restaurantName,
            address: restaurantAddress,
            description: restaurantDescription,
            location: locationRestaurant,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createdAt: new Date(),
            createdBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            navigation.navigate("Restaurantes");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show("Error al cargar el restaurant");
          })
      });
    }
  };
  const addImageStorage = async () => {
    const imageBlob = [];

    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("restaurants").child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`restaurants/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoURL) => {
              imageBlob.push(photoURL);
            });
        });
      })
    );
    return imageBlob;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant imagenRestaurant={imagesSelected[0]}/>
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMaps = {setIsVisibleMaps}
        locationRestaurant = {locationRestaurant}
      />
      <UploadImage toastRef={toastRef} imagesSelected={imagesSelected} setImagesSelected={setImagesSelected}/>
      <Button
        title="Crear Restaurant"
        buttonStyle={styles.btnAddRestaurant}
        onPress={addRestaurant}
      />
      <GoogleMaps isVisibleMaps={isVisibleMaps} setIsVisibleMaps={setIsVisibleMaps} toastRef={toastRef} setLocationRestaurant={setLocationRestaurant}/>
    </ScrollView>
  );
}

function ImageRestaurant(props) {
  const {imagenRestaurant} = props;

  return (
    <View style={styles.viewPhoto}>
      <Image 
        source= {imagenRestaurant ? {uri: imagenRestaurant} : require("../../../assets/img/no-photo.png")}
        style= {{ width: widthScreen, height: 200 }}
      />
    </View>
  )
}

function FormAdd(props) {
  const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
    setIsVisibleMaps,
    locationRestaurant
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        containerStyle={styles.input}
        placeholder="Nombre del Restaurant"
        onChange={(e) => setRestaurantName(e.nativeEvent.text)}
      />
      <Input
        containerStyle={styles.input}
        placeholder="Direccion"
        onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
        rightIcon={{
          type: 'material-community',
          name: 'google-maps',
          color: locationRestaurant ? '#00a680': '#c2c2c2',
          onPress: () => setIsVisibleMaps(true),
        }}
      />
      <Input
        inputContainerStyle={styles.textArea}
        placeholder="Descripción del Restaurant"
        multiline={true}
        onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  );
}


function GoogleMaps(props) {
  const {isVisibleMaps, setIsVisibleMaps, toastRef, setLocationRestaurant } = props;

  const [location, setLocation] = useState(null)

  useEffect(() => {
    (async() => {
      const resultPermissions= await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermissions = resultPermissions.permissions.location.status;
      if (statusPermissions !== "granted") {
        toastRef.current.show("Necesitas aceptar los permisos de localización para crear un restaurante", 3000);
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Localización guardada correctamente");
    setIsVisibleMaps(false);
  }

  return (
    <Modal isVisible={isVisibleMaps} setIsVisible={setIsVisibleMaps}>
      <View>
        {location && (
          <MapView
            style={styles.mapView}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              dragable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button title="Guardar Ubicación" 
            containerStyle={styles.viewMapBtnContainerSaveLocation}
            buttonStyle= {styles.viewMapBtnSaveLocation}
            onPress= {confirmLocation}
          />
          <Button
            title="Cancelar"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMaps(false)}
          />
        </View>
      </View>
    </Modal>
  );
}


function UploadImage(props) {
  const { toastRef, imagesSelected, setImagesSelected } = props;

  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions.status === "denied") {
      toastRef.current.show(
        "Permiso necesario, por favor activelo manualmente desde la configuracion",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show("Has salido de la galeria sin elegir foto", 2000);
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar Imagen",
      "Estas seguro que deseas eliminar la imagen?",
      [
        {
          text: 'cancel',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            setImagesSelected(filter(
            imagesSelected,
            (imageUrl) => imageUrl !== image
          ));
          },
        },
      ],
      {cancelable: false}
    );
  };

  return (
    <View style={styles.viewImage}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {map(imagesSelected, (imagenRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.avatarMiniature}
          source={{ uri: imagenRestaurant }}
          onPress={() => removeImage(imagenRestaurant)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginHorizontal: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImage: {
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: "row",
  },
  containerIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  avatarMiniature: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: 'center',
    height: 200,
    marginBottom: 20,
  },
  mapView: {
    width: '100%',
    height: 550,
  },
  viewMapBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 10,
  },
  viewMapBtnCancel: {
    backgroundColor: '#a60d0d',
  },
  viewMapBtnContainerSaveLocation: {
    paddingRight: 5,
  },
  viewMapBtnSaveLocation: {
    backgroundColor: '#00a680',
  },
});
