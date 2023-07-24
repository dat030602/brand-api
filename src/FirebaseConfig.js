// Import the functions you need from the SDKs you need
const initApp = require("firebase/app");
const storageFirebase = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAUWqDbt8Vjdc9y6wgJwGSEC-8ADb__ktQ",
	authDomain: "brand-website-11081.firebaseapp.com",
	projectId: "brand-website-11081",
	storageBucket: "brand-website-11081.appspot.com",
	messagingSenderId: "1006116890827",
	appId: "1:1006116890827:web:5f1291da9a260aaf6dd34e",
	measurementId: "G-VM1RGFP7MM",
};

// Initialize Firebase
initApp.initializeApp(firebaseConfig);
