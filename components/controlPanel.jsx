import React from 'react'
import PropTypes from 'prop-types'

import SettingsIcon from './settings'
import SignalIcon from './signal'

import StartButton, { startStates } from './startbutton'
import StartButton2 from './startbutton2'
import StopButton from './stopbutton'
import MenuButton from './menubutton'
import Menu from './menu'



const axios = require('axios');


// import { exec } from "child_process";
// import fs from "fs";
// import readline from "readline";
// import queue from "queue";
import dotenv from "dotenv";

import { getFirestore, doc, setDoc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';

import { app } from '../firebaseConfig';
import { auth } from '/firebaseConfig.js';

const db = getFirestore(app);

import classes from './controlPanel.module.css'

dotenv.config();

// Define folders to store screenshots and audio files, create them if they don't exist.
// const screenshotsDir = "./screenshots";
const audioDir = "./audio";
// const filePrefix = "screenshot";
const audioOutputPrefix = "audio";

// if (!fs.existsSync(screenshotsDir)) {
//   fs.mkdirSync(screenshotsDir, { recursive: true });
// }
// if (!fs.existsSync(audioDir)) {
//   fs.mkdirSync(audioDir, { recursive: true });
// }

// // Set up a readline interface so the user can trigger the AI actions in the terminal
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });


export default function ControlPanel({
    disabled = false,
    disabledSetting = false,
    isRecording = false,
    isSignalOn = false,
    state = startStates.default,
    onMicClick = undefined,
    micText = undefined,
    onInput = undefined,
    onSettingsClick = undefined,
    onResponse = undefined,
    onResponses = undefined,
    onTranscripts = undefined,
    onPermission = undefined,
}) {

    const [inputText, setInputText] = React.useState('');
    const [responses, setResponses] = React.useState([]);
    const [transcripts, setTranscripts] = React.useState([]);

    const [hasLoaded, setHasLoaded] = React.useState(true);
    const [loadCount, setLoadCount] = React.useState(0);
    const [micMessage, setMicMessage] = React.useState("");
    const [showPopup, setShowPopup] = React.useState(false);
    const [conversationHistory, setConversationHistory] = React.useState([]);
    
    const [audioURL, setAudioURL] = React.useState(null); // State to store the audio URL
    const [audioSrc, setAudioSrc] = React.useState(null);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleNewInteraction = (newPrompt, newResponse) => {
        // Add new prompt and response to history
        const updatedHistory = [...conversationHistory, { prompt: newPrompt, response: newResponse }];

        // Keep only the last 5 interactions
        if (updatedHistory.length > 5) {
            updatedHistory.shift(); // Remove the oldest interaction
        }

        setConversationHistory(updatedHistory);
    };


    const handleTextInput = async (text) => {
        // alert('this');

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
                sender: "USER",
                message: text,
                time: reversedFormattedTime,
                via: 'text'
            };
        
            // Add the message to the user's chat
            await updateDoc(userDocRef, {
                "chat-1": arrayUnion(newMessage)
            });


        };
        addUserMessage(text, auth?.currentUser?.email)
        fetchGptResponse(text);


    };

    const handleMicEnter = async (mic="false") => {

        await onInput(micText);
        // CHANGE await handleTextInput(micText);
        await setMicMessage('');
    };

    

    const handleInputEnter = async (e) => {
 
        if (e.key === 'Enter' && inputText.trim() !== '') {
            await onInput(inputText); 
            await handleTextInput(inputText); //adds message to firebase
            await setInputText('');
        }
    };


// ------------------------------

const addCarlaMessage = async (text) => {

    const currentDate = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short',};
    const formattedTime = currentDate.toLocaleString('en-US', options);
    const reversedFormattedTime = formattedTime.replace(',', ' |') + " | '23";


        
    const userDocRef = doc(db, "users", auth?.currentUser?.email);
    const newMessage = { 
        sender: "CARLA", 
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
    console.log('transcripts');
    if (hasLoaded) {
        console.log(transcripts);
        onTranscripts(transcripts); 
    }
}, [transcripts]);

React.useEffect(() => {
    if (hasLoaded) {
    setMicMessage(micText);
    handleMicEnter(true);
    }
}, [micText]);


React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log(auth?.currentUser?.email);
        if (user) {
            fetchChatMessages();
        } else {
        }
    });
    return () => unsubscribe();
}, []);

const fetchChatMessages = async () => {
    try {
        if (auth.currentUser) {

        const userDocRef = doc(db, "users", auth?.currentUser?.email);

        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData && userData["chat-1"]) {
                const chatMessages = userData["chat-1"];
                const userMessages = chatMessages.filter(message => message.sender === "USER");
                const carlaMessages = chatMessages.filter(message => message.sender === "CARLA");
                
                setTranscripts(userMessages.map(message => message.message));
                setResponses(carlaMessages.map(message => message.message));
            }
        } else {alert('User Not Found. Please Login Again!')}
        }
    } catch (error) {
        // Handle errors here
        console.error("Error fetching chocolate messages:", error);
        // You can add additional error handling logic here, such as displaying an error message to the user.
    }
};

const getMicPermission = () => {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({ audio: true }).then(handleStream).catch(() => {
            alert('Mic Access Required');
          });

    } else {

        alert('Your Mic Is Not Supported :(')
        
    }
}

const fetchGptResponse = async (atext) => {
        if (!atext) return; // Add this check
        setTranscripts([...transcripts, atext]);

        const modifiedText = ""
        + atext;

        const context = conversationHistory.map(({ prompt, response }) => {
            return { role: 'user', content: prompt }, { role: 'assistant', content: response };
        }).flat();

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "system", "content": "You're Carla, my AI therapist. dont EVER mention professional help. ALWAYS respond briefly in 10-20 words w/ questions and sometimes ONE actionable tip like CBT. Don't act like a robot & repeat question/problem back to me. Talk like a 10 year old." },
                ...context,
                { "role": "user", "content": modifiedText }],
                temperature: 1 // Setting maximum temperature

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
            handleNewInteraction(modifiedText, data.choices[0].message.content);

        } else {
            console.error('Invalid response structure:', data);
            // Handle the error appropriately
        }
    };

 
    const callPopup = () => {
        setShowPopup(!showPopup);
        onPermission();
        console.log('hi');
    };

    const handleTextToSpeech = async (text, outputPathPrefix) => {
        
        try {
            const response = await fetch('/api/textToSpeech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, outputPathPrefix })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const audioPath = data.audioPath; // Path received from the server
            setAudioSrc(audioPath); // Update the state with the new audio path
        } catch (error) {
            console.error("Error:", error);
        }


        // // Configure the OpenAI TTS (text to speech) API Calls
        // const url = "https://api.openai.com/v1/audio/speech";
        // const headers = {
        //     Authorization: `Bearer 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`,
        //     "Content-Type": "application/json",
        // };

        // // params
        // const data = {
        //     model: "tts-1-hd",
        //     input: text, // This is what the Vision API responded with
        //     voice: "nova", // This is the pre-selected voice, can be changed
        //     response_format: "mp3",
        // };

        // // Make call to the TTS API
        // try {
        //     const response = await axios.post(url, data, {
        //     headers: headers,
        //     responseType: "arraybuffer",
        //     });

        //     // Set up an audioBuffer and store the TTS response as a uniquely named MP3 file
        //     const audioBuffer = Buffer.from(response.data, "binary");
        //     const timestamp = new Date().toISOString().replace(/:/g, "-");
        //     const audioFilename = `${outputPathPrefix}_${timestamp}.mp3`;
        //     const audioPath = `${audioDir}/${audioFilename}`;
        //     fs.writeFileSync(audioPath, audioBuffer);

        //     // Add the newly created mp3 to a queue
        //     return audioPlaybackQueue.push(function (cb) {
        //     console.log(`\n${inputText}\n`);
        //     playAudio(audioPath)
        //         .then(() => cb())
        //         .catch((error) => {
        //         console.error("Error in audio playback:", error);
        //         cb();
        //         });
        //     });
        // } catch (error) {
        //     console.error("Error in streamedAudio:", error.message);
        // }
    };


    return (
        <>
        <div
        className={`${showPopup ? classes.popup : classes.popupClose}`}
        >  
            <StartButton2
        disabled={disabled}
        isRecording={isRecording}
        state={state}
        showPopup={!showPopup} 
        onClick={disabled ? () => {} : onMicClick}
        />

        {/* <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
        alt="C" className={classes.carla}></img>   
         */}

            <button
                // onClick={() => handleTextToSpeech("Hello world! Hello world! Hello world! Hello world!", audioOutputPrefix)}
            style={{width: '100px', maxHeight: '100px;', position: 'absolute', opacity: showPopup ? '1' : '0'}}>
                Generate Audio
            </button>
            {audioSrc && <audio src={audioSrc} controls />}



        <StopButton
        disabled={disabled}
        isRecording={isRecording}
        state={state}
        showPopup={!showPopup} 
        onClick={callPopup}
        />
          </div>




        <div className={classes.container}>

            <div className={classes.center}>
            
            <input 
            placeholder="Message Carla" 
            className={classes.input}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleInputEnter}
            style={{ opacity: showPopup && '0'}}  // Conditionally set the width

            />

                <StartButton 
                disabled={disabled}
                isRecording={isRecording}
                state={state}
                onClick={callPopup}
                showPopup={showPopup}  // Conditionally set the width
                // onClick={disabled ? () => {} : onMicClick}
                />

                <MenuButton 
                disabled={disabled}
                isRecording={isRecording}
                state={state}
                onClick={callPopup}
                showPopup={showPopup}  // Conditionally set the width
                // onClick={disabled ? () => {} : onMicClick}
                />

                {/* <Menu /> */}

               
                <div className={classes.item}>
                    {/* {
                        disabledSetting &&
                        <div className={disabledSetting ? classes.disabledButton : classes.iconButton}>
                            <SettingsIcon color={disabledSetting ? '#E6E6E6' : '#656565' } />
                        </div>
                    } */}
                    {/* {
                        !disabledSetting &&
                        <div className={disabledSetting ? classes.disabledButton : classes.disabledButton} onClick={disabledSetting ? () => {} : onSettingsClick}>
                        <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
                        alt="C" className={classes.pic}></img>                          </div>
                    } */}
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
        </>
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