"use client"

import { useRouter } from 'next/navigation';
import classes from './landing.module.css';

// import { Icon } from '@iconify/react';
import chatBubble from '@iconify-icons/ion/chatbubble';

import { auth } from '/firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useEffect, useState } from 'react';

import { signOut } from 'firebase/auth';

export default function signin() {

    useEffect(() => {
      console.log(auth?.currentUser?.email);
    }, []);

    const router = useRouter(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const signup = async () => {
      // Regular expression to check for spaces and special characters except full stop
      const isValidNickname = /^[a-zA-Z0-9.]*$/.test(email);

      if (isValidNickname) {
          router.push(`/step1/${email}`);
          // await signOut(auth);
          // alert('signedout')
      } else {
          alert('Invalid nickname. Please avoid spaces and special characters except for full stops.');
          return;
      }

  };
  
    return <div className={classes.container}>

        
    <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img>

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    <div className={classes.holder}>

    <div className={classes.text} >
    Meet Carla <br></br>
    </div>

    <div className={classes.text2} >
    Your AI Therapy Companion<br></br>
    Trained on 1,000 Real Sessions
    </div>

    <input placeholder='Enter Nickname' 
    className={classes.nickname}
    onChange={(e) => setEmail(e.target.value)} />

    <button className={classes.button} onClick={signup}>
    💬 Message Carla 
    </button>
        
    </div>

    </div>
}