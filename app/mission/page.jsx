"use client"

import { useRouter } from 'next/navigation';
import classes from './mission.module.css';

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
    router.push(`/landing`);
  }

  const agree = () => {
    router.push(`https://www.mentalhealthfirstaid.org/mental-health-resources/`);

  }

    return <>
    
    <div className={classes.container}>

    <div style={{height: '55px', width: '100vw', position: 'absolute', backgroundColor: 'white',
      display: 'flex', alignItems: 'center', padding: '20px', justifyContent: 'space-between',
      backgroundColor: '#FFE6D4', borderStyle: 'dotted', borderBottomWidth: '0.0px', borderColor: 'brown',
      borderRightWidth: '0px', borderTopWidth: '0px', borderLeftWidth: '0px'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}><img src="https://i.postimg.cc/T1LRJn9W/decentral-21-removebg-preview.png" 
        style={{color: 'rgb(119, 85, 59)', height: '24px', width: '24px', paddingTop: '0px'}}></img>
        <p style={{color: 'rgb(119, 85, 59)', fontSize: '20px', fontFamily: 'serif', marginLeft: '4px',}}
        onClick={()=>{router.push('/landing')}}>Carla</p></div>
        <p style={{color: 'rgb(119, 85, 59)', fontSize: '20px', fontFamily: 'serif', }}
        onClick={()=>{router.push('/mission')}}>Mission</p>
      </div>

        
    {/* <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img> */}

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    
    <div className={classes.holder}>

    <img src="https://i.postimg.cc/tCc8ZPnS/undraw-Romantic-getaway-re-3f45-removebg-preview.png" alt="oops" 
    style={{height: '200px', width: '255px', zIndex: 1000, 
    marginBottom: '30px',}}/>

    <div className={classes.text} >
    Carla Exists To<br></br>
    Democratize
    
    </div>

    <div className={classes.text2} >
    Carla's primary mission is to<br/>
    provide safe, affordable mental <br/>
    health help to everyone that <br/>
    needs it. To do this, we work <br/>
    on bringing our fixed AI costs<br />
    down and building a therepeautic <br />
    & safe channel for exploring <br/>
    mental health needs privately. <br />
    Note that Carla is NOT a <br />
    substitute for real therapy.
    </div>

    <button 
    className={`${classes.button50} ${selectedOption === 'Agree' ? classes.active : ''}`}
    onClick={() => agree()}
    > Seek Real Help
    </button>
    
    <button className={classes.button} onClick={handleSubmit} >
    💬 Message Carla
    </button>
        
    </div>

    </div>
    </>
}   