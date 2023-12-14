"use client"

import { useRouter } from 'next/navigation';
import classes from './step3.module.css';

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
  const [selectedOptions, setSelectedOptions] = useState([]);


    const addStruggles = async (userEmail, struggles) => {

      const userDocRef = doc(db, "users", userEmail);
            const userDocSnapshot = await getDoc(userDocRef);
      
      if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, { /* Add any initial data you need here */ });
      }

      await updateDoc(userDocRef, {
          "STRUGGLES": struggles
      });


  };

    const handleSubmit = () => {
      addStruggles(`${params.nickname}@gmail.com`, selectedOptions)
      router.push(`/step4/${params.nickname}`);
    }


     

    const handleOptionClick = (option) => {
      console.log(selectedOptions);
      if (!selectedOptions.includes(option)) {setSelectedOptions([...selectedOptions, option])}
      if (selectedOptions.includes(option)) {
        const updatedOptions = selectedOptions.filter(opt => opt !== option);
        setSelectedOptions(updatedOptions);
    }};


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
    Open Book <br></br>
    
    </div>

    <div className={classes.text2} >
    What Do You Struggle With?<br></br>
    </div>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('Anxiety') ? classes.active : ''}`}
    onClick={() => handleOptionClick('Anxiety')}
    > Anxiety
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('Motivation') ? classes.active : ''}`}
    onClick={() => handleOptionClick('Motivation')}
    > Motivation
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('Relationships') ? classes.active : ''}`}
    onClick={() => handleOptionClick('Relationships')}
    > Relationships
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('Depression') ? classes.active : ''}`}
    onClick={() => handleOptionClick('Depression')}
    > Depression
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('ADHD') ? classes.active : ''}`}
    onClick={() => handleOptionClick('ADHD')}
    > Loneliness
    </button>

    
    <button className={classes.button} onClick={handleSubmit}>
    Move Forward
    </button>
        
    </div>

    </div>
}