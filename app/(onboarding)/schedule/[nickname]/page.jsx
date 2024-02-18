"use client"

import { useRouter } from 'next/navigation';
import classes from './schedule.module.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '/firebaseConfig'; // Importing the Firebase app instance
import { useEffect, useState } from 'react';

export default function signin({ params }) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [visitsData, setVisitsData] = useState({});

  // Function to fetch visits data from Firestore
  const getVisitsData = async () => {
    const userDocRef = doc(getFirestore(app), "vists", "vists");
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const data = userDocSnapshot.data();
      setVisitsData(data);
    }
  };

  useEffect(() => {
    getVisitsData();

    const interval = setInterval(() => {
      getVisitsData();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    router.push(`/step4/${params.nickname}`);
  }

  const handleOptionClick = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      const updatedOptions = selectedOptions.filter(opt => opt !== option);
      setSelectedOptions(updatedOptions);
    }
  };

  // Sort dates in the desired order
  const sortedDates = ['Today', 'Tomorrow', '20th', '21st', '22nd', '23rd'];

  return (
    <div className={classes.container}>
      <div className={classes.holder}>
        {sortedDates.map(date => (
          <div key={date} style={{ width: "100%" }}>
            <div className={classes.text}>
              {date} <br></br>
            </div>
            {visitsData[date]?.map((visit, index) => (
              <button
                key={index}
                className={`${classes.button50} ${selectedOptions.includes(visit) ? classes.active : ''}`}
                onClick={() => handleOptionClick(visit)}
              >
                {visit}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
