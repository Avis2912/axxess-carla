"use client"

import { useRouter } from 'next/navigation';
import classes from './step2.module.css';

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

    const addGender = async (userEmail, option) => {

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
          "GENDER": style
      });


  };

     

    const handleOptionClick = (option) => {
      setSelectedOption(option);
      addGender(`${params.nickname}@gmail.com`, option)
      router.push(`/step3/${params.nickname}`);
  };

  const handleSubmit = () => {
    addGender(`${params.nickname}@gmail.com`, 'Skipped')
    router.push(`/step3/${params.nickname}`);
  }



    return <div className={classes.container}>

        
    {/* <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img> */}

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    
    <div className={classes.holder}>

    <img src="https://i.postimg.cc/zf1YDCTK/undraw-Buddies-2ae5-removebg-preview.png" alt="NAHH" 
    style={{height: '200px', width: '230px', zIndex: 1000, 
    marginTop: '0px',}}/>

    <div className={classes.text} >
    I Am A <br></br>
    
    </div>

    <div className={classes.text2} >
    You Can Skip This<br></br>
    </div>

    <button 
    className={`${classes.button50} ${selectedOption === 'Male' ? classes.active : ''}`}
    onClick={() => handleOptionClick('Male')}
    > Male
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === 'Female' ? classes.active : ''}`}
    onClick={() => handleOptionClick('Female')}
    > Female
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === 'Other' ? classes.active : ''}`}
    onClick={() => handleOptionClick('Other')}
    > Other
    </button>
    
    <button className={classes.button} onClick={handleSubmit}>
    Skip
    </button>
        
    </div>

    </div>
}