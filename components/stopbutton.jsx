import React from 'react'
import PropTypes from 'prop-types'

import MicrophoneIcon from './microphone'
import MicrophoneOffIcon from './microphoneOff'

import PlayIcon from './play'
import ArrowIcon from './arrow'
import PauseIcon from './pause2'

import { Icon } from '@iconify/react';
import chatBubble from '@iconify-icons/ion/chatbubble';


import AnimatedBars from './animatedBars'

import classes from './stopbutton.module.css'

const colorTypes = {
    default: '#666666',
    disabled: '#66666666',
    activated: '#00D8FF'
}

const colorDisabled = '#6661'
const colorDefault = '#6661'
const colorActive = '#00D8FF11'

export const startStates = {
    default: 'default',
    active: 'active',
}

function StopButton({ 
    disabled = false,
    isRecording = false,
    state = startStates.default, 
    onClick = undefined,
    showPopup = false,
    isListening = false,

}) {

    let classContainer = state === startStates.default ? [classes.container, classes.default].join(' ') : [classes.container, classes.activate].join(' ')
    if(disabled) {
        classContainer = [classes.container, classes.disabled].join(' ')
    }

    let classIcon = state === startStates.default ? classes.defaultColor : classes.activateColor

    return (
        <>
        <div className={classes.holder} style={{left: showPopup && '100vw', }}>
        <button  onClick={disabled ? () => {} : onClick} className={classContainer}                
         style={{ opacity: showPopup && '0', }} >
            <div className={classes.center}>
                <div className={classes.icon} >
                    {
                        // disabled ? <MicrophoneOffIcon className={classes.disabledColor} /> : <MicrophoneIcon className={classIcon} />
                    }

            <Icon icon={chatBubble} width={24} height={24} />

                </div>
                
               
                {/* {
                    (!disabled && state === startStates.active ) &&
                    <div className={classes.bars}>
                        <AnimatedBars start={isRecording} />
                    </div>
                } */}
            </div>
        </button>

        <img src="https://i.ibb.co/GQL1GbL/Screenshot-2023-12-05-at-4-01-21-PM-removebg-preview.png" 
        alt="C" className={classes.carla} style={{ opacity: showPopup && '0'}}></img>   

      </div>

         <div className={classes.tap} style={{opacity: showPopup && '0'}}>
         {isListening ? 'Speak Normally' : 'Tap Anywhere'}
         </div>
         </>
    )
}

StopButton.propTypes = {
    /**
     * Disabled property
     */
    disabled: PropTypes.bool,
    /**
     * Show animation if TRUE
     */
    isRecording: PropTypes.bool,
    /**
     * The button state
     */
    state: PropTypes.oneOf([ startStates.default, startStates.active ]),
    /**
     * Click handler
     */
    onClick: PropTypes.func,
}

export default StopButton