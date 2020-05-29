import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyA29py_3atnS9U-E7NAuyuRbe0VCuEBDnc",
    authDomain: "tenedores-31446.firebaseapp.com",
    databaseURL: "https://tenedores-31446.firebaseio.com",
    projectId: "tenedores-31446",
    storageBucket: "tenedores-31446.appspot.com",
    messagingSenderId: "174826682828",
    appId: "1:174826682828:web:78e9201c24e897db6d4569"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig); 