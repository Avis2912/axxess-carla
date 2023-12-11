"use client"

import { useRouter } from 'next/navigation';
import classes from './step1.module.css';

// import { Icon } from '@iconify/react';
import chatBubble from '@iconify-icons/ion/chatbubble';

import { auth } from '/firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useEffect, useState } from 'react';



export default function signin({ params }) {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      setEmail(`${params.nickname}`);
    }, []);

    const signup = async () => {
      const fakeEmail = `${email}@gmail.com`; 
        try {
          await createUserWithEmailAndPassword(auth, fakeEmail, password);
        } catch (err) {
          alert(err);  
        //   alert('Invalid entry. Password must be 6+ characters long.' );
          return;
        }
        router.push('/');
      };
    

    return <div className={classes.container}>

        
    {/* <div className={classes.carla_container} />
    <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
    alt="C" className={classes.carla} ></img> */}

    {/* <Icon icon={chatBubble} width={24} height={24} /> */}

    <div className={classes.holder}>

    <div className={classes.text} >
    You're Always <br></br>
    Anonymous
    </div>

    <div className={classes.text2} >
    We'll Never Ask For Your Email<br></br>
    </div>

    <input placeholder='Your Nickname' 
    value={params.nickname}
    className={classes.nickname}
    onChange={(e) => setEmail(e.target.value)} />

    <input placeholder='Enter Password' 
    className={classes.nickname}
    onChange={(e) => setPassword(e.target.value)} />
    
    <button className={classes.button} onClick={signup}>
    Next
    </button>
        
    </div>

    </div>
}