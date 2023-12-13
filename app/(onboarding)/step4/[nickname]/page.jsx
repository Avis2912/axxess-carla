"use client"

import { useRouter } from 'next/navigation';
import classes from './step4.module.css';

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

    const [aboutMe, setAboutMe] = useState('');
    const [aboutGoal, setAboutGoal] = useState('');
    const [aboutTraits, setAboutTraits] = useState('');

    const [showPassword, setShowPassword] = useState(false);


    const addAboutMe = async (userEmail, aboutMe, aboutGoal, aboutTraits) => {

      const userDocRef = doc(db, "users", userEmail);
      
      // Check if the user's folder exists
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, { /* Add any initial data you need here */ });
      }

      const hey = {
        me: aboutMe,
        goal: aboutGoal,
        traits: aboutTraits
    };
  
      // Add the message to the user's chat
      await updateDoc(userDocRef, {
        ABOUTME: hey
    });

  };


    const isButtonDisabled = aboutMe.length < 10 || aboutGoal.length < 10 || aboutTraits.length < 10;  // Disable button if input length is less than 80

    const handleSubmit = () => {
        if (!isButtonDisabled) {
            addAboutMe(`${params.nickname}@gmail.com`, aboutMe, aboutGoal, aboutTraits)
            router.push(`/step5/${params.nickname}`);
        }
    };

    return <div className={classes.container}>

        
    {/* <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img> */}

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    
    <div className={classes.holder}>

    <img src="https://i.postimg.cc/280D7746/undraw-Mobile-user-re-xta4-removebg-preview.png" alt="NAHH" 
    style={{height: '200px', width: '320px', zIndex: 10, 
    marginBottom: '0px',}}/>

    <div className={classes.text} >
    Learning More <br></br>
    
    </div>

    <div className={classes.text2} >
    Tell Carla a Little About Yourself<br></br>
    </div>

    <input 
    className={`${classes.input50}`}
    placeholder="Hey Carla, I am... "
    onChange={(e) => setAboutMe(e.target.value)}
    />

    <input 
    className={`${classes.input50}`}
    placeholder="I'm using Carla to become... "
    onChange={(e) => setAboutGoal(e.target.value)}
    />

    <input 
    className={`${classes.input50}`}
    placeholder="Friends would describe me as..."
    onChange={(e) => setAboutTraits(e.target.value)}
    />

    <button className={classes.button} onClick={handleSubmit} disabled={isButtonDisabled}>
    That's All
    </button>

        
    </div>

    </div>
}