import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFJsTAq3KmAxkWw0DxuO3rVvZRRbB5ixw",
    authDomain: "akpsi-phi-brotherhood-website.firebaseapp.com",
    projectId: "akpsi-phi-brotherhood-website",
    storageBucket: "akpsi-phi-brotherhood-website.appspot.com",
    messagingSenderId: "441108581480",
    appId: "1:441108581480:web:07175fbe7903627e9abfdd",
    measurementId: "G-6KY82440C2"
};

// Initialize Firebase
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line
const db = getFirestore(app);
createApp(App).use(store).use(router).mount('#app')
