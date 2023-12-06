import React from 'react'
import PropTypes from 'prop-types'

import SettingsIcon from './settings'
import SignalIcon from './signal'

import StartButton, { startStates } from './startbutton'

import { getFirestore, doc, setDoc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';

import { app } from '../firebaseConfig'; // Importing the Firebase app instance

const db = getFirestore(app);


import classes from './controlPanel.module.css'

export default function ControlPanel({
    disabled = false,
    disabledSetting = false,
    isRecording = false,
    isSignalOn = false,
    state = startStates.default,
    onMicClick = undefined,
    onInput = undefined,
    onSettingsClick = undefined,
    onResponse = undefined,
    onResponses = undefined,
    onTranscripts = undefined,
}) {

    const [inputText, setInputText] = React.useState('');
    const [responses, setResponses] = React.useState([]);
    const [transcripts, setTranscripts] = React.useState([]);

    const [hasLoaded, setHasLoaded] = React.useState(false);


    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleTextInput = async (text) => {
        // alert('this');

        const x = {

            data: `WEBVTT\n\n00:00:00.000 --> 00:00:03.200\n${text}\n\n`,
            datetime: "2023-12-04T06:46:19.378Z",
            filename: "file170167238287714627.webm",
            onClick: undefined,
            onDelete: undefined,
        }

        
        // addDataItems(x);


        const addUserMessage = async (text, userEmail) => {

            const currentDate = new Date();
            const options = { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short',};
            const formattedTime = currentDate.toLocaleString('en-US', options);
            const reversedFormattedTime = formattedTime.replace(',', ' |') + " | '23";


                
            const userDocRef = doc(db, "users", userEmail);
            

            // Check if the user's folder exists
            const userDocSnapshot = await getDoc(userDocRef);
            
            if (!userDocSnapshot.exists()) {
                // If the folder doesn't exist, create it
                await setDoc(userDocRef, { /* Add any initial data you need here */ });
            }
            
            const newMessage = {
                sender: "User",
                message: text,
                time: reversedFormattedTime,
                via: 'text'
            };
        
            // Add the message to the user's chat
            await updateDoc(userDocRef, {
                "chat-1": arrayUnion(newMessage)
            });


        };
        addUserMessage(text, "avirox4@gmail.com")
        fetchGptResponse(text);


    };

    const handleInputEnter = async (e) => {
        if (e.key === 'Enter' && inputText.trim() !== '') {
            await onInput(inputText); 
            await handleTextInput(inputText);
            await setInputText('');
        }
    };


// ------------------------------

const addCarlaMessage = async (text) => {

    const currentDate = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short',};
    const formattedTime = currentDate.toLocaleString('en-US', options);
    const reversedFormattedTime = formattedTime.replace(',', ' |') + " | '23";


        
    const userDocRef = doc(db, "users", "avirox4@gmail.com");
    const newMessage = { 
        sender: "Carla", 
        message: text,
        time: reversedFormattedTime,
        via: 'text'
    };

    await updateDoc(userDocRef, {
        "chat-1": arrayUnion(newMessage)
    });

};

React.useEffect(() => {
    if (hasLoaded) {
    onResponses(responses);
    // alert(responses[0]); 
    }  // This will reliably use the updated state
}, [responses]); // This useEffect will trigger whenever 'responses' changes

React.useEffect(() => {
    if (hasLoaded) {
    onTranscripts(transcripts); 
    }
}, [transcripts]);

React.useEffect(() => {

        const fetchChatMessages = async () => {
            const userDocRef = doc(db, "users", "avirox4@gmail.com");

            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                if (userData && userData["chat-1"]) {
                    const chatMessages = userData["chat-1"];
                    const userMessages = chatMessages.filter(message => message.sender === "User");
                    const carlaMessages = chatMessages.filter(message => message.sender === "Carla");

                    setTranscripts(userMessages.map(message => message.message));
                    setResponses(carlaMessages.map(message => message.message));
                }
            }
        };

    fetchChatMessages();
    setHasLoaded(true);
    

}, [] );
    
const fetchGptResponse = async (atext) => {
        if (!atext) return; // Add this check
        setTranscripts([...transcripts, atext]);


        const modifiedText = "\nYou are now Carla, my AI therapist. I am already seeking professional mental health help, this is just a supplemant - so don't ever remind me of that fact, or MENTION that I am or should seek professional help. DONT EVER remind me that you are not a substitute for professional help. I want you to always respond in 1-3 lines with directing questions and actionable advice, as a CBT therapist would. Now answer my following prompt:"
        + atext;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "system", "content": "You are a helpful assistant." },
                           { "role": "user", "content": modifiedText }]
            })
        });

        if (!response.ok) {
            // Log the error for debugging
            console.error('API request failed: ', response.statusText);
            return;
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            // await setGptResponse(data.choices[0].message.content);
            onResponse(data.choices[0].message.content);
            setResponses([...responses, data.choices[0].message.content]);
            addCarlaMessage(data.choices[0].message.content);

        } else {
            console.error('Invalid response structure:', data);
            // Handle the error appropriately
        }
    };

 

// try {
//     console.log(gptResponse);
//     addCarlaMessage(gptResponse);
// } catch (err) {
//     alert(err);
// }













    return (
        <div className={classes.container}>
            <div className={classes.center}>
            
            <input 
            placeholder="Message Carla" 
            className={classes.input}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleInputEnter}
            />

                <StartButton 
                disabled={disabled}
                isRecording={isRecording}
                state={state}
                onClick={disabled ? () => {} : onMicClick}
                />

                <div className={classes.item}>
                    {
                        disabledSetting &&
                        <div className={disabledSetting ? classes.disabledButton : classes.iconButton}>
                            <SettingsIcon color={disabledSetting ? '#E6E6E6' : '#656565' } />
                        </div>
                    }
                    {
                        !disabledSetting &&
                        <div className={disabledSetting ? classes.disabledButton : classes.iconButton} onClick={disabledSetting ? () => {} : onSettingsClick}>
                        <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
                        alt="C" className={classes.pic}></img>                          </div>
                    }
                </div>

            </div>
            <div className={classes.bottom}>
                {/* <div className={classes.item}>
                    <div className={classes.iconPanel}>
                        <SignalIcon color={isSignalOn ? '#00D8FF' : '#E6E6E6'} />
                    </div>
                </div> */}
               
            </div>
        </div>
    )
}

ControlPanel.propTypes = {
    /**
     * Disable StartButton
     */
    disabled: PropTypes.bool,
    /**
     * Disable Settings
     */
    disabledSetting: PropTypes.bool,
    /**
     * Start state
     */
    state: PropTypes.string,
    /**
     * Enables recording animation
     */
    isRecording: PropTypes.bool,
    /**
     * Lights up when there is backend process
     */
    isSignalOn: PropTypes.bool,
    /**
     * Handles Settings click
     */
    onSettingsClick: PropTypes.func,
    /**
     * Handles StartButton click
     */
    onMicClick: PropTypes.func,
    
    onInput: PropTypes.func,
}