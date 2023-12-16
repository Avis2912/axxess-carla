"use client"

import { useRouter } from 'next/navigation';
import classes from './plans.module.css';

// import { Icon } from '@iconify/react';
import chatBubble from '@iconify-icons/ion/chatbubble';

import { getFirestore, doc, setDoc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '/firebaseConfig'; // Importing the Firebase app instance
const db = getFirestore(app);

import { auth } from '/firebaseConfig.js';

import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faComment, faBrain } from '@fortawesome/free-solid-svg-icons';

import { signOut } from 'firebase/auth';

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
      if (option == "Free") {return}
      if (option == "1") { router.push(`https://restful.lemonsqueezy.com/checkout/buy/2afad675-3bda-45e8-acc6-27f91a438853`) }
      if (option == "2") { router.push(`https://restful.lemonsqueezy.com/checkout/buy/3eb64e81-f1e4-4e0b-baef-57df824c0692`) }
  };

  const handleSubmit = () => {
    addGender(`${params.nickname}@gmail.com`, 'Skipped')
    router.push(`/step3/${params.nickname}`);
  }

  const logOut = async () => {
    await signOut(auth);
    router.push('/');
  }

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
    Carla Plans <br></br>
    
    </div>

    {/* <div className={classes.text2} >
    Only Because Carla Is<br></br>
    Expensive To Run!
    </div> */}

    <button 
    className={`${classes.button50} ${selectedOption === 'Free' ? classes.active : ''}`}
    onClick={() => handleOptionClick('Free')}
    > <h1 className={classes.priceText}>
      Free</h1>

    <h3 className={classes.subtext} style={{ bottom: '55px' }}>
      <FontAwesomeIcon icon={faComment} style={{ color: '#fae8d7', marginRight: '3px' }} /> 100 Weekly Messages
    </h3>
    <h3 className={classes.subtext} style={{ bottom: '30px' }}>
      <FontAwesomeIcon icon={faPhone} style={{ color: '#fae8d7', marginRight: '3px' }} /> 5 Weekly Minutes
    </h3>
    <h3 className={classes.subtext} style={{ bottom: '5px' }}>
      <FontAwesomeIcon icon={faBrain} style={{ color: '#fae8d7', marginRight: '3px' }} /> 15 Memory Slots
    </h3>


      <h2 style={{position: 'absolute', fontFamily: 'serif', right: '18px', top: '18px', fontSize: '14px', fontFamily: 'serif', color: 'black', fontWeight: '400'}}>
        Your<br />Plan</h2>
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === '1' ? classes.active : ''}`}
    onClick={() => handleOptionClick('1')}
    > <h1 className={classes.priceText}>
    $1/week</h1>

  <h3 className={classes.subtext} style={{ bottom: '55px' }}>
    <FontAwesomeIcon icon={faComment} style={{ color: '#fae8d7', marginRight: '3px' }} /> 500 Weekly Messages
  </h3>
  <h3 className={classes.subtext} style={{ bottom: '30px' }}>
    <FontAwesomeIcon icon={faPhone} style={{ color: '#fae8d7', marginRight: '3px' }} /> 5 Weekly Minutes
  </h3>
  <h3 className={classes.subtext} style={{ bottom: '5px' }}>
    <FontAwesomeIcon icon={faBrain} style={{ color: '#fae8d7', marginRight: '3px' }} /> 50 Memory Slots
  </h3>


    {/* <h2 style={{position: 'absolute', fontFamily: 'serif', right: '18px', top: '18px', fontSize: '14px', fontFamily: 'serif', color: 'black', fontWeight: '400'}}>
      Your<br />Plan</h2> */}
    </button>

    <button 
    className={`${classes.button50} ${selectedOption === '2' ? classes.active : ''}`}
    onClick={() => handleOptionClick('2')}
    > <h1 className={classes.priceText}>
    $2/week</h1>

  <h3 className={classes.subtext} style={{ bottom: '55px' }}>
    <FontAwesomeIcon icon={faComment} style={{ color: '#fae8d7', marginRight: '3px' }} /> 500 Weekly Messages
  </h3>
  <h3 className={classes.subtext} style={{ bottom: '30px' }}>
    <FontAwesomeIcon icon={faPhone} style={{ color: '#fae8d7', marginRight: '3px' }} /> 45 Daily Minutes
  </h3>
  <h3 className={classes.subtext} style={{ bottom: '5px' }}>
    <FontAwesomeIcon icon={faBrain} style={{ color: '#fae8d7', marginRight: '3px' }} /> 50 Memory Slots
  </h3>


    {/* <h2 style={{position: 'absolute', fontFamily: 'serif', right: '18px', top: '18px', fontSize: '14px', fontFamily: 'serif', color: 'black', fontWeight: '400'}}>
      Your<br />Plan</h2> */}
    </button>
    
    <button className={classes.button} onClick={() => router.push('/')}>
    Back To Chat
    </button>

    <button className={classes.button} onClick={async () => logOut()}>
    Sign Out
    </button>
        
    </div>

    </div>
}