import React from 'react'
import PropTypes from 'prop-types'

import MicrophoneIcon from './microphone'
import MicrophoneOffIcon from './microphoneOff'

import PlayIcon from './play'
import ArrowIcon from './arrow'
import PauseIcon from './pause2'

import AnimatedBars from './animatedBars'

import classes from './startbutton2.module.css'

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

function StartButton({ 
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

    let classContainer2 = state === startStates.default ? [classes.container2, classes.default].join(' ') : [classes.container2, classes.activate].join(' ')
    if(disabled) {
        classContainer2 = [classes.container2, classes.disabled].join(' ')
    }

    let classIcon = state === startStates.default ? classes.defaultColor : classes.activateColor
    
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);

    // Function to toggle panel state
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // Determine the class to apply based on the panel state
    const panelClass = isPanelOpen ? 'panelOpen' : 'panelClose';


    return (
        <div  onClick={disabled ? () => {} : onClick} className={isRecording ? classContainer2 : classContainer}                
         style={{ backgroundColor: showPopup && 'transparent', opacity: !showPopup && 1}} >
            <div className={classes.center}>
                <div className={classes.icon} >
                    {
                        // isListening && <MicrophoneOffIcon className={classes.disabledColor} />
                    }
                </div>
                {
                    (!disabled && state === startStates.active ) &&
                    <div className={classes.bars}>
                        <AnimatedBars start={isRecording} />
                    </div>
                }
            </div>
        </div>
    )
}

StartButton.propTypes = {
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

export default StartButton