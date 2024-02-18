"use client"

import { useRouter } from 'next/navigation';
import classes from './meds.module.css';
import chatBubble from '@iconify-icons/ion/chatbubble';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '/firebaseConfig'; // Importing the Firebase app instance
import { useEffect, useState } from 'react';
import Navbar from '../../../../components/topbar';

export default function signin({ params }) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [medsData, setMedsData] = useState({});

  // Function to fetch medication data from Firestore
  const getMedsData = async () => {
    const userDocRef = doc(getFirestore(app), "meds", "status");
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const data = userDocSnapshot.data();
      setMedsData(data);
    }
  };

  useEffect(() => {
    // Fetch medication data when the component mounts
    getMedsData();

    // Set up interval to check for updates every 2 seconds
    const interval = setInterval(() => {
      getMedsData();
    }, 4000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update selectedOptions based on medsData
    const updatedOptions = Object.keys(medsData).filter(med => medsData[med]);
    setSelectedOptions(updatedOptions);
  }, [medsData]);

  const handleOptionClick = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      const updatedOptions = selectedOptions.filter(opt => opt !== option);
      setSelectedOptions(updatedOptions);
    }
  };

  const handleSubmit = () => {
    router.push(`/step4/${params.nickname}`);
  }

  return (
    <div>
    <Navbar currentPath={"meds/hey"} />
    <div className={classes.container}>
      
      <div className={classes.holder}>
        <div className={classes.text}>
          Meds <br></br>
        </div>
        <div className={classes.text2}>
          Today's Medication<br></br>
        </div>
        <button
          className={`${classes.button50} ${selectedOptions.includes('Lisinoprile') ? classes.active : ''}`}
          onClick={() => handleOptionClick('Lisinoprile')}
        >
          Lisinoprile
        </button>
        <button
          className={`${classes.button50} ${selectedOptions.includes('Simvastatin') ? classes.active : ''}`}
          onClick={() => handleOptionClick('Simvastatin')}
        >
          Simvastatin
        </button>
        <button
          className={`${classes.button50} ${selectedOptions.includes('Levothyroxine') ? classes.active : ''}`}
          onClick={() => handleOptionClick('Levothyroxine')}
        >
          Levothyroxine
        </button>
        <button
          className={`${classes.button50} ${selectedOptions.includes('Amlodipine') ? classes.active : ''}`}
          onClick={() => handleOptionClick('Amlodipine')}
        >
          Amlodipine
        </button>
        <button
          className={`${classes.button50} ${selectedOptions.includes('Omeprazole') ? classes.active : ''}`}
          onClick={() => handleOptionClick('Omeprazole')}
        >
          Omeprazole
        </button>
        <button className={classes.button} onClick={handleSubmit}>
          Add New Meds
        </button>
      </div>
    </div>
    </div>
  );
}

