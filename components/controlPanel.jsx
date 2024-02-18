import React from 'react'
import PropTypes from 'prop-types'

import SettingsIcon from './settings'
import SignalIcon from './signal'

import StartButton, { startStates } from './startbutton'
import StartButton2 from './startbutton2'
import StopButton from './stopbutton'
import MenuButton from './menubutton'
import Menu from './menu'

import { useRouter } from 'next/navigation'


const axios = require('axios');

import dotenv from "dotenv";

import { getFirestore, doc, addDoc, docRef, setDoc, getDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';

import { app } from '../firebaseConfig';
import { auth } from '/firebaseConfig.js';

const db = getFirestore(app);

import classes from './controlPanel.module.css'
import { setDefaultEventParameters } from 'firebase/analytics'

dotenv.config();


const audioDir = "./audio";
const audioOutputPrefix = "audio";


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
    isListening = undefined,
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
    const [aboutMe, setAboutMe] = React.useState(null);
    const [struggles, setStruggles] = React.useState(null);

    const [weeklyTextCounter, setWeeklyTextCounter] = React.useState(0)
    const [weeklyTextLimit, setWeeklyTextLimit] = React.useState(100)

    const [seconds, setSeconds] = React.useState(0)
    const [weeklyAudioCounter, setWeeklyAudioCounter] = React.useState(0)
    const [weeklyAudioLimit, setWeeklyAudioLimit] = React.useState(50)

    const [dailyAudioCounter, setDailyAudioCounter] = React.useState(0)
    const [dailyAudioLimit, setDailyAudioLimit] = React.useState(30)

    const [plan, setPlan] = React.useState("Free");
    const [isText, setIsText] = React.useState(true);
    const [isAudio, setIsAudio] = React.useState(true);


    React.useEffect(() => {
        if (weeklyTextCounter % 10 === 0 && weeklyTextCounter !== 0) {updateCounter()}
        if (weeklyTextCounter > weeklyTextLimit) {
            updateCounter()
            setIsText(false);
        }
    }, [weeklyTextCounter])

    React.useEffect(() => {
        if (weeklyAudioCounter !== 0) {updateCounter()}
        if (weeklyAudioCounter > weeklyAudioLimit) {
            updateCounter()
            setIsAudio(false);
            setShowPopup(false);
        }
    }, [weeklyAudioCounter])

    React.useEffect(() => {
        if (showPopup) {
            const intervalId = setInterval(() => {
                setSeconds((prevCounter) => {
                    const updatedSeconds = prevCounter + 1;
                    // console.log(updatedSeconds); 
                    if (updatedSeconds % 60 === 0 && updatedSeconds !== 0) {
                        setWeeklyAudioCounter((prevCounter) => prevCounter + 0.5);
                    }
                    return updatedSeconds;
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [showPopup]);
    

    const updateCounter = async () => {
        const userDocRef = doc(db, "users", auth?.currentUser?.email);
    
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
    
        const updatedLimits = {
            ...userData.LIMITS,
            "WEEKLY_TEXT_COUNT": weeklyTextCounter, 
            "WEEKLY_AUDIO_COUNT": weeklyAudioCounter,
        };
    
        // Update the user document with the new "LIMITS" data
        await updateDoc(userDocRef, {
            LIMITS: updatedLimits,
        });
    };
    

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const contextLength = 3;

    const handleNewInteraction = (newPrompt, newResponse) => {

        if (!newResponse) {return};

        // Add new prompt and response to history
        const updatedHistory = [...conversationHistory, { prompt: newPrompt, response: newResponse }];

        // Keep only the last 5 interactions
        if (updatedHistory.length > contextLength) {
            updatedHistory.shift(); // Remove the oldest interaction
        }

        setConversationHistory(updatedHistory);
    };


    const handleTextInput = async (text) => {

        const addUserMessage = async (text, userEmail) => {

            if (text == "") {return};
            // console.log(weeklyTextCounter + 1);
            setWeeklyTextCounter(weeklyTextCounter + 1);

            const currentDate = new Date();
            const options = { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short',};
            const formattedTime = currentDate.toLocaleString('en-US', options);
            const reversedFormattedTime = formattedTime.replace(',', ' |') + " | '23";
       
            const userDocRef = doc(db, "users", userEmail);
            const userDocSnapshot = await getDoc(userDocRef);
            
            if (!userDocSnapshot.exists()) {
                await setDoc(userDocRef, { /* Add any initial data you need here */ });
            }
            
            const newMessage = {
                sender: "USER",
                message: text,
                time: reversedFormattedTime,
                via: 'text'
            };
        
            await updateDoc(userDocRef, {
                "chat-1": arrayUnion(newMessage)
            });


        };
        addUserMessage(text, auth?.currentUser?.email)
        fetchGptResponse(text);


    };

    const handleMicEnter = async (mic="false") => {

        await onInput(micText);
        await handleTextInput(micText);
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

    if (showPopup) {handleTextToSpeech(text)}

    const currentDate = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short',};
    const formattedTime = currentDate.toLocaleString('en-US', options);
    const reversedFormattedTime = formattedTime.replace(',', ' |') + " | '23";
  
    const userDocRef = doc(db, "users", auth?.currentUser?.email);
    const newMessage = { 
        sender: "CARLA", 
        message: text,
        time: reversedFormattedTime,
        via: showPopup ? 'audio' : 'text'
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
                const userInfo = userData["ABOUTME"];
                const userStruggles = userData["STRUGGLES"];

                setPlan(userData["PLAN"]);
                const limits = userData["LIMITS"];
                setWeeklyTextLimit(limits["WEEKLY_TEXT_LIMIT"]);
                setWeeklyTextCounter(limits["WEEKLY_TEXT_COUNT"]);
                setWeeklyAudioLimit(limits["WEEKLY_AUDIO_LIMIT"]);
                setWeeklyAudioCounter(limits["WEEKLY_AUDIO_COUNT"]);
                setDailyAudioLimit(limits["DAILY_AUDIO_LIMIT"]);
                setDailyAudioCounter(limits["DAILY_AUDIO_COUNT"]);

                setTranscripts(userMessages.map(message => message.message));
                setResponses(carlaMessages.map(message => message.message));
                setAboutMe(userInfo["me"]);
            }
        } else {router.push('/landing')}
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

const use_arxiv = async (scientific_subject="blueberry") => {
    const hi = await axios.get(`http://export.arxiv.org/api/query?search_query=${scientific_subject}&start=0&max_results=10`);
    console.log(hi.data);
    const response = hi.data;
    return response
}

const sendMessageToFirestore = async (body) => {
    try {
        // Reference to the 'messages' collection
        const messagesRef = collection(db, "messages");
        // Add a new document with a generated ID
        await addDoc(messagesRef, {
            to: "+15128010784",
            from: "+18339562138",
            body: body,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

async function callMe() {
    const response = await fetch('/api/call', { // Make sure to use the correct path where your API is accessible
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            body: "this is an sos message for my lovly Avi ", // The message body
            from: "+18339562138", // The sender's phone number
            to: "+15128010784",   // The recipient's phone number
        }),
    });

    const data = await response.json(); // Assuming API responds with JSON
    return data; // Contains the API response, including success status and message
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
                messages: [{ "role": "system", "content": `You're Carla, my personal homecare assistant by Axxess. DONT mention professional help. Respond in brief w/ occasional questions. Don't repeat problem back to me.` },
                ...context,
                { "role": "user", "content": modifiedText }],
                temperature: 0.3,
                functions: [
                    {
                    name: "use_arxiv",
                    description: "get research papers",
                    parameters: {
                        type: "object", 
                        properties: {
                            scientific_subject: {
                                type: "string", 
                                description: "The scientific topic to be queried for."
                            }
                        },
                        required: ["scientific_subject"] 
                    }
                    },
                    {
                        name: "use_SOS",
                        description: "for when user says they've fallen over or asks for external help or says SOS",
                        parameters: {
                            type: "object", 
                            properties: {
                                user_struggle: {
                                    type: "string", 
                                    description: "The user's struggle."
                                }
                            },
                        }
                    },
                    {
                        name: "user_falls",
                        description: "for when user says they've fallen over",
                        parameters: {
                            type: "object", 
                            properties: {
                            },
                        }
                    },
                    {
                        name: "ask_external_help",
                        description: "for when user asks for external help",
                        parameters: {
                            type: "object", 
                            properties: {
                            },
                        }
                    },
                ],
                function_call: "auto",
            })
        });

        if (!response.ok) {
            console.error('API request failed: ', response.statusText);
            return;
        }

        const data = await response.json();


        const completionResponse = data.choices[0].message;

        let func = ""
        if(!completionResponse.content) { //means wants to use function
            const functionCallName = completionResponse.function_call.name;
            console.log("functionCallName: ", functionCallName);

            if(functionCallName === "use_arxiv") {
                const completionArguments = JSON.parse(completionResponse.function_call.arguments);
                console.log("completionArguments: ", completionArguments);
                func = await use_arxiv(completionArguments.scientific_subject)
                console.log(func);
            }

            if(functionCallName === "use_SOS") {
                console.log('SOS');
                alert('RAN SOS');
            }

            if(functionCallName === "user_falls") {
                console.log('SOS2');
                alert('RAN SOS2');
            }
            if(functionCallName === "ask_external_help") {
                console.log('SOS3');
                alert('RAN SOS3');
            }

            if(functionCallName === "ask_external_help" || "user_falls" || "use_SOS") {
                await sendMessageToFirestore("Nancy just sent an SOS signal. Reach out to her ASAP & make sure she's safe.");
                callMe();
            }

        }

        if (!completionResponse.content) { 
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo-1106",
                messages: [{ "role": "system", "content": `You're Carla, my personal AI assistant. Do the things I say perfectly:
                ${completionResponse.function_call.name == "use_arxiv" && "Respond with the appropriate papers"}
                ${completionResponse.function_call.name == "user_falls" || "external_help" || "use_SOS" && "Respond by saying you have texted my nurse and family, & to hang tight."}
                ${completionResponse.function_call.name == "false_alarm" && "Respond by saying you have texted my contacts confirming you are actually okay"}
                 ` },
                ...context,
                { "role": "function",
                  "name": completionResponse.function_call.name,
                  "content": func }],
                temperature: 0.3,
            })
        });

        const data = await response.json();
        console.log(data);

        //same stuff for func calling (not ideal but works)

        if (data.choices && data.choices.length > 0) {
            if (!data.choices[0].message.content) {return};
            onResponse(data.choices[0].message.content);
            setResponses([...responses, data.choices[0].message.content]);
            addCarlaMessage(data.choices[0].message.content);
            handleNewInteraction(modifiedText, data.choices[0].message.content);

        } else {
            console.error('Invalid response structure:', data);
        }
            
        };

        if (data.choices && data.choices.length > 0) {
            if (!data.choices[0].message.content) {return};
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
    };

    async function playAudioFromBuffer(buffer) {
        try {
            const blob = new Blob([buffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }
    
    async function handleTextToSpeech(text) {
        try {
            const response = await fetch('/api/textToSpeech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.audioFilePath && data.audioFilePath.data) {
                const audioUrl = bufferToBlob(data.audioFilePath.data);
                playAudio(audioUrl);
            } else {
                throw new Error('Invalid audio data received');
            }
        } catch (error) {
            console.error('Error in text to speech:', error);
        }
    }
    
    function bufferToBlob(buffer, type = 'audio/mpeg') {
        const blob = new Blob([new Uint8Array(buffer)], { type });
        return URL.createObjectURL(blob);
    }
    
    function playAudio(audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.error('Error playing audio:', e));
        audio.onerror = (e) => {
            console.error('Error in audio playback:', e);
        };
    };


    return (
        <>
        <div
        className={`${showPopup ? classes.popup : classes.popupClose}`}
        style={{borderColor: isListening && '#FFE6D4', borderRadius: isListening && '12px'
    }}
        >  
            <StartButton2
        disabled={disabled}
        isRecording={isRecording}
        state={state}
        showPopup={!showPopup} 
        onClick={disabled ? () => {} : onMicClick}
        isListening={isListening}
        />

        {/* <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
        alt="C" className={classes.carla}></img>   
         */}


        <StopButton
        disabled={disabled}
        isRecording={isRecording}
        state={state}
        showPopup={!showPopup} 
        onClick={callPopup}
        isListening={isListening}
        />
          </div>



        <div className={classes.container}>

            <div className={classes.center}>
            
            <input 
            placeholder="Message Carla" 
            className={classes.input}
            value={isText ? inputText : 'Weekly Limit Hit'}
            onChange={handleInputChange}
            onKeyDown={isText ? handleInputEnter : ()=>{}}
            style={{ opacity: showPopup && '0', backgroundColor: !isText && '#E5B999'}}  // Conditionally set the width
            />

                <StartButton 
                disabled={disabled}
                isRecording={isRecording}
                state={state}
                onClick={isAudio ? callPopup : () => {alert('Weekly Call Limit Hit')}}
                showPopup={showPopup}  // Conditionally set the width
                // onClick={disabled ? () => {} : onMicClick}
                />

                <MenuButton 
                disabled={disabled}
                isRecording={isRecording}
                state={state}
                // onClick={callPopup}
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