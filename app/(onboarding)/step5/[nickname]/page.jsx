"use client"

import { useRouter } from 'next/navigation';
import classes from './step5.module.css';

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
  const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (auth.currentUser) {
              // router.push('/');
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      setEmail(`${params.nickname}`);
    }, []);

    const addPreferences = async (userEmail, option) => {

      const userDocRef = doc(db, "users", userEmail);
      
      // Check if the user's folder exists
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, { /* Add any initial data you need here */ });
      }
      
      const user_details = {
          style: option,
      };

      const style = option;
  
      // Add the message to the user's chat
      await updateDoc(userDocRef, {
          "STYLE": style
      });


  };

    if (selectedOption) {
      addPreferences(`${params.nickname}@gmail.com`, selectedOption)
      router.push(`/step6/${params.nickname}`);
    }


     

    const handleOptionClick = (option) => {
      setSelectedOption(option);
  };


    return <div className={classes.container}>

        
    {/* <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img> */}

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    
    <div className={classes.holder}>

    <img src="https://i.postimg.cc/280D7746/undraw-Mobile-user-re-xta4-removebg-preview.png" alt="NAHH" 
    style={{height: '200px', width: '320px', zIndex: 1000, 
    marginTop: '0px',}}/>

    <div className={classes.text} >
    Carla's Style <br></br>
    
    </div>

    <div className={classes.text2} >
    You Can Switch This Later<br></br>
    </div>

    <button 
    className={`${classes.button50} ${selectedOption === 'Listening' ? classes.active : ''}`}
    onClick={() => handleOptionClick('Listening')}
    > Listening
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === 'Analytical' ? classes.active : ''}`}
    onClick={() => handleOptionClick('Analytical')}
    > Analytical
    </button>

        {selectedOption && <p>Selected: {selectedOption}</p>}
    
    {/* <button className={classes.button} onClick={signup}>
    Next
    </button> */}
        
    </div>

    </div>
}