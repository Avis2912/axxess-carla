"use client"

import { useRouter } from 'next/navigation';
import classes from './step7.module.css';

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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

  const handleSubmit = () => {
    router.push(`/`);
  }

  const agree = () => {
    setSelectedOption('Agree');
    setIsButtonDisabled(false);
  }

    return <div className={classes.container}>

        
    {/* <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img> */}

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    
    <div className={classes.holder}>

    <img src="https://i.postimg.cc/tCc8ZPnS/undraw-Romantic-getaway-re-3f45-removebg-preview.png" alt="NAHH" 
    style={{height: '200px', width: '255px', zIndex: 1000, 
    marginBottom: '30px',}}/>

    <div className={classes.text} >
    Carla Is Not <br></br>
    A Substitute
    
    </div>

    <div className={classes.text2} >
    If at any point I experience the<br/>
    need to speak to a real person,<br/>
    I'll get professional help ASAP.
    </div>

    <button 
    className={`${classes.button50} ${selectedOption === 'Agree' ? classes.active : ''}`}
    onClick={() => agree()}
    > I Agree
    </button>
    
    <button className={classes.button} onClick={handleSubmit} disabled={isButtonDisabled}>
    💬 Message Carla!
    </button>
        
    </div>

    </div>
}