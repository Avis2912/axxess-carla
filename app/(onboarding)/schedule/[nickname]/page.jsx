"use client"

import { useRouter } from 'next/navigation';
import classes from './schedule.module.css';

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
      // addStruggles(`${params.nickname}@gmail.com`, selectedOptions)
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

    {/* https://i.postimg.cc/85jwRX6q/undraw-Thoughts-re-3ysu-removebg-preview.png */}
    {/* <img src="https://i.postimg.cc/Sxs9K97T/undraw-Book-reading-re-fu2c-removebg-preview.png" alt="NAHH" 
    style={{height: '200px', width: '300px', zIndex: 1000, 
    marginTop: '0px',}}/> */}

    <div className={classes.text} >
    Today <br></br>
    
    </div>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 11AM Nurse Rachel Visit
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 5PM Nurse Rachel Visit
    </button>

    <div className={classes.text} >
    19th <br></br>
    
    </div>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 1PM Nurse Rachel Visit
    </button>

    <div className={classes.text} >
    20th <br></br>
    
    </div>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 3PM Nurse Mary Visit
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 11AM Nurse Mary Visit
    </button>

    <div className={classes.text} >
    21st <br></br>
    </div>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 4PM Nurse Rachel Visit
    </button>

    <div className={classes.text} >
    22nd <br></br>
    </div>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 12PM Nurse Mary Visit
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 3PM Nurse Mary Visit
    </button>

    <div className={classes.text} >
    23rd <br></br>
    </div>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 11AM Nurse Mary Visit
    </button>

    <button 
    className={`${classes.button50} ${selectedOptions.includes('') ? classes.active : ''}`}
    > 3PM Nurse Rachel Visit
    </button>



    
    {/* <button className={classes.button} onClick={handleSubmit}>
    Add New Meds
    </button> */}
        
    </div>

    </div>
}