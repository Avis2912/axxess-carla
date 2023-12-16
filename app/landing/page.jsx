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
  
    return <div>
      <div className={classes.container}>
      <div style={{height: '55px', width: '100vw', position: 'absolute', backgroundColor: 'white',
      display: 'flex', alignItems: 'center', padding: '20px', justifyContent: 'space-between',
      backgroundColor: '#FFE6D4', borderStyle: 'dotted', borderBottomWidth: '0.0px', borderColor: 'brown',
      borderRightWidth: '0px', borderTopWidth: '0px', borderLeftWidth: '0px'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}><img src="https://i.postimg.cc/T1LRJn9W/decentral-21-removebg-preview.png" 
        style={{color: 'rgb(119, 85, 59)', height: '24px', width: '24px', paddingTop: '0px'}}></img>
        <p style={{color: 'rgb(119, 85, 59)', fontSize: '20px', fontFamily: 'serif', marginLeft: '4px',}}
        onClick={()=>{router.push('/')}}>Carla</p></div>
        <p style={{color: 'rgb(119, 85, 59)', fontSize: '20px', fontFamily: 'serif', }}
        onClick={()=>{router.push('/mission')}}>Mission</p>
      </div>

        
    <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={`h-48 ${classes.carla} h-96`} />

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

    <button className={classes.button} onClick={signup}
    style={{'@media (max-width: 600px)': {
      backgroundColor: 'red'
    }}}>
    💬 Message Carla 
    </button>
        
    </div>
    <div style={{
  height: '500px', 
  width: '100%', 
  backgroundColor: 'transparent',
  position: 'absolute', 
  marginTop: '530px',
  display: 'flex', 
  flexDirection: 'row', 
  flexWrap: 'wrap',
  justifyContent: 'center', 
  alignItems: 'center'
}}>
  <div style={{
    height: '250px', 
    width: '350px', 
    backgroundColor: 'white',
    borderRadius: '14px',
    margin: '15px',
    '@media (max-width: 600px)': {
      margin: '15px auto'
    }
  }}>
  </div>

  <div style={{
    height: '250px', 
    width: '350px', 
    backgroundColor: 'white',
    borderRadius: '14px',
    margin: '15px',
    '@media (max-width: 600px)': {
      margin: '15px auto'
    }
  }}>
  </div>

    </div>


    </div>
    </div>
}