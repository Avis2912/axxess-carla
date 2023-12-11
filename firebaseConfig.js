import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { createUserWithEmailAndPassword} from 'firebase/auth';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { getStorage, ref, listAll, getDownloadURL, uploadBytes, updateMetadata, getMetadata } from 'firebase/storage';


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
export const auth = getAuth(app);
