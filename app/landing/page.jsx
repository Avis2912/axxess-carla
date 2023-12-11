import classes from './landing.module.css';

// import { Icon } from '@iconify/react';
import chatBubble from '@iconify-icons/ion/chatbubble';



export default function signin() {
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
    className={classes.nickname}>
    
    </input>

    <button className={classes.button}>
    Message Carla
    </button>
        
    </div>

    </div>
}