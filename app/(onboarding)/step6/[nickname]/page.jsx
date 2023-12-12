"use client"

import { useRouter } from 'next/navigation';
import classes from './step6.module.css';

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

    const addTime = async (userEmail, option) => {

      const userDocRef = doc(db, "users", userEmail);
      
      // Check if the user's folder exists
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, { /* Add any initial data you need here */ });
      }
      
      // Add the message to the user's chat
      await updateDoc(userDocRef, {
          "DAILY_COMMIT": `${option} Minutes`
      });


  };

     

    const handleOptionClick = (option) => {
      setSelectedOption(option);
      addTime(`${params.nickname}@gmail.com`, option)
      router.push(`/step7/${params.nickname}`);
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
    I Can Spend <br></br>
    
    </div>

    <div className={classes.text2} >
    Set A Daily Mental Health Target<br></br>
    </div>

    <button 
    className={`${classes.button50} ${selectedOption === '5' ? classes.active : ''}`}
    onClick={() => handleOptionClick('5')}
    > 5 Minutes / Day
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === '10' ? classes.active : ''}`}
    onClick={() => handleOptionClick('10')}
    > 10 Minutes / Day
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === '15' ? classes.active : ''}`}
    onClick={() => handleOptionClick('15')}
    > 15 Minutes / Day
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === '30+' ? classes.active : ''}`}
    onClick={() => handleOptionClick('30+')}
    > 30 Minutes / Day
    </button>

        {selectedOption && <p>Selected: {selectedOption}</p>}

        
    </div>

    </div>
}