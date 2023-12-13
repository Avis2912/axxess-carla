"use client"

import { useRouter } from 'next/navigation';
import classes from './step1.module.css';

// import { Icon } from '@iconify/react';
import chatBubble from '@iconify-icons/ion/chatbubble';

import { getFirestore, doc, setDoc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '/firebaseConfig'; // Importing the Firebase app instance
const db = getFirestore(app);

import { auth } from '/firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useEffect, useState } from 'react';



export default function signin({ params }) {
  
  const router = useRouter();
  const [user, setUser] = useState(null); // State to store the current user

    useEffect(() => {
        // This listener is called whenever the user's sign-in state changes
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (auth.currentUser) {
              // router.push('/');
            } else {
                setUser(null);
            }
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      setEmail(`${params.nickname}`);
    }, []);

    const signup = async () => {

      const isValidEmail = /^[a-zA-Z0-9.]*$/.test(email);
  
      if (isValidEmail) {
          router.push(`/step1/${email}`);
      } else {
          alert('Try another nickname!');
          return
      }
  
    
      const fakeEmail = `${email}@gmail.com`; 
        try {
          await createUserWithEmailAndPassword(auth, fakeEmail, password);
          await addUser(fakeEmail, email, password);
        } catch (err) {
          alert(err);  
        //   alert('Invalid entry. Password must be 6+ characters long.' );
          return;
        }
        router.push(`/step2/${params.nickname}`);
      };
    

      const addUser = async (userEmail, nickname, password) => {

        const currentDate = new Date();
        const options = { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short',};
        const formattedTime = currentDate.toLocaleString('en-US', options);
        const reversedFormattedTime = formattedTime.replace(',', ' |') + " | '23";

            
        const userDocRef = doc(db, "users", userEmail);
        
        // Check if the user's folder exists
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (!userDocSnapshot.exists()) {
            await setDoc(userDocRef, { /* Add any initial data you need here */ });
        }
        
        const user_details = {
            nickname: nickname,
            password: password,
            signed_up: reversedFormattedTime,
        };
    
        // Add the message to the user's chat
        await updateDoc(userDocRef, {
            "CREDENTIALS": arrayUnion(user_details)
        });


    };

    return <div className={classes.container}>

        
    {/* <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img> */}

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    
    <div className={classes.holder}>

    <img src="https://i.postimg.cc/280D7746/undraw-Mobile-user-re-xta4-removebg-preview.png" alt="NAHH" 
    style={{height: '200px', width: '320px', zIndex: 1000, 
    marginBottom: '5px',}}/>

    <div className={classes.text} >
    You're Always <br></br>
    Anonymous
    </div>

    <div className={classes.text2} >
    Carla Will Never Ask For Your<br></br>
    Email Or Other Personal Intel
    </div>

    <input placeholder='Your Nickname' 
    defaultValue={params.nickname}
    className={classes.nickname}
    onChange={(e) => setEmail(e.target.value)} />

    <input placeholder='Enter Password' 
    className={classes.nickname}
    onChange={(e) => setPassword(e.target.value)} />
    
    <button className={classes.button} onClick={signup}>
    Next
    </button>
        
    </div>

    </div>
}