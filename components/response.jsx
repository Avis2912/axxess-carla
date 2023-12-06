import React from 'react'
import PropTypes from 'prop-types'

import DeleteIcon from './delete'

import { getFirestore, doc, setDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';

import { app } from '../firebaseConfig'; // Importing the Firebase app instance

const db = getFirestore(app);


import classes from './response.module.css'

const formatNumber = (n) => n < 10 ? '0' + n : n

const formatDateTime = (s) => {
    const date = new Date(s)

    const syear = date.getFullYear()
    let smonth = date.getMonth() + 1
    let sdate = date.getDate()

    let shour = date.getHours()
    let smins = date.getMinutes()
    let ssecs = date.getSeconds()

    smonth = formatNumber(smonth)
    sdate = formatNumber(sdate)

    shour = formatNumber(shour)
    smins = formatNumber(smins)
    ssecs = formatNumber(ssecs)

    return [[syear, smonth, sdate].join('-'), [shour, smins, ssecs].join(':')].join(' ')
}

export default function Response({
    // filename = '',
    // datetime = '',
    // data = '',
    // onClick = undefined,
    // onDelete = undefined,
    response = undefined,
}) {

    let items = [12];
    // let index = -1;
    // let flag = false;

    // const tokens = data.split("\n");

    // for (let i = 0; i < tokens.length; i++) {
    //     const s = tokens[i].trim();
    //     if(s.indexOf(':') > 0 && s.indexOf('-->') > 0) {
    //         index++;
    //         items.push({ timestamp: s, text: '' });
    //         flag = true;
    //     } else if(flag) {
    //         items[index].text = s;
    //         flag = false;
    //     }
    // }

    // let atext = "";
    // for (let i = 0; i < items.length; i++) {
    //     atext += items[i].text;
    // }
    

    // const addCarlaMessage = async (text) => {
        
    //     const userDocRef = doc(db, "users", "avirox4@gmail.com");
    //     const newMessage = { 
    //         sender: "Carla", 
    //         message: text,
    //         time: new Date().toISOString()  ,
    //         via: 'text'
    //     };
    
    //     await updateDoc(userDocRef, {
    //         "chat-1": arrayUnion(newMessage)
    //     });
    // };
    

    // const [gptResponse, setGptResponse] = React.useState('');

    // React.useEffect(() => {
    //     const fetchGptResponse = async () => {
    //         if (!atext) return; // Add this check

    //         const modifiedText = atext + "\nRespond in two lines.";

    //         const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer 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`
    //             },
    //             body: JSON.stringify({
    //                 model: "gpt-3.5-turbo",
    //                 messages: [{ "role": "system", "content": "You are a helpful assistant." },
    //                            { "role": "user", "content": modifiedText }]
    //             })
    //         });
    
    //         if (!response.ok) {
    //             // Log the error for debugging
    //             console.error('API request failed: ', response.statusText);
    //             return;
    //         }
    
    //         const data = await response.json();
    //         if (data.choices && data.choices.length > 0) {
    //             await setGptResponse(data.choices[0].message.content);
    //         } else {
    //             console.error('Invalid response structure:', data);
    //             // Handle the error appropriately
    //         }
    //     };
    
    //     // if (atext) {
    //     //     fetchGptResponse();
    //     // }

    // }, []);
    

    // try {
    //     // console.log(gptResponse);
    //     // addCarlaMessage(gptResponse);
    // } catch (err) {
    //     // alert(err);
    // }
    
    // const handleDelete = (e) => {
    //     e.stopPropagation()
    //     e.preventDefault()
    //     // onDelete(filename)
    // }

    // // Multiply: &#215;

    return (
        <div className={classes.container} onClick={() => {alert('i')}}>
            <div className={classes.top}>
                {/* <div className={classes.datetime}>{ formatDateTime(datetime) }</div>
                <div onClick={handleDelete} className={classes.iconButton}>
                    <DeleteIcon color="black" />
                </div> */}
            </div>
            <div className={classes.list}>
            {
                items.map((item, index) => {
                    return (
                        <>
                       
                        <div key={index + 8} className={classes.item}>
                        <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
                        alt="C" className={classes.pic} onClick={() => console.log('YUP')}></img>  
                            {/* <div className={classes.timestamp}>{ item.timestamp }</div> */}
                            <div className={classes.text}>{response}</div>
                        </div>
                        </>
                    )
                })
            }
            </div>
        </div>
    )
}

Response.propTypes = {
    /**
     * Filename of audo data
     */
    filename: PropTypes.string,
    /**
     * DateTime when audio data is recorded
     */
    datetime: PropTypes.string,
    /**
     * Transcription items
     */
    data: PropTypes.string,
    /**
     * Click event handler
     */
    onClick: PropTypes.func,
    /**
     * Delete event handler
     */
    onDelete: PropTypes.func,
}