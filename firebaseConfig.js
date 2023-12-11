// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjIHbJnt1l5eh1zfxXcnce4bpzVVLQsbU",
  authDomain: "restful-cbcd4.firebaseapp.com",
  projectId: "restful-cbcd4",
  storageBucket: "restful-cbcd4.appspot.com",
  messagingSenderId: "205445907884",
  appId: "1:205445907884:web:538aee7dc0b42c0c386609",
  measurementId: "G-FZRFK5VRBY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);