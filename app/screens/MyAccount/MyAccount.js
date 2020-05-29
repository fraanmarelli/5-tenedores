import React, {useState, useEffect} from 'react';
import * as firebase from 'firebase';
import Loading from '../../components/Loading';
import UserGuest from './UserGuest';
import UserLogged from './UserLogged';


export default function MyAccount() {
    //vamos a crear aqui nuestro primer State. El valor de useState sera null porque no sabemos si el user esta loggeado o no.
    const [login, setLogin] = useState(null);
    // ahora enviamos solicitud a firebase para ver si el usuario visitante de la app esta loggeado o no. Un useEffeect nos lo dirá!
    useEffect( () => {
        firebase.auth().onAuthStateChanged ( (user)  => {
            !user ? setLogin(false) : setLogin(true);
        });
    }, []);

    if (login === null) return <Loading isVisible={true} text="Cargando"/>;
 
    return login ? <UserLogged /> : <UserGuest />
}