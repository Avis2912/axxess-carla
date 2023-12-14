import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/navigation'

import MicrophoneIcon from './microphone'
import MicrophoneOffIcon from './microphoneOff'

import PlayIcon from './play'
import ArrowIcon from './arrow'
import PauseIcon from './pause2'

import AnimatedBars from './animatedBars'

import classes from './menubutton.module.css'

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

function MenuButton({ 
    disabled = false,
    isRecording = false,
    state = startStates.default, 
    onClick = undefined,
    showPopup = false,

}) {

    const router = useRouter();


    let classContainer = state === startStates.default ? [classes.container, classes.default].join(' ') : [classes.container, classes.activate].join(' ')
    if(disabled) {
        classContainer = [classes.container, classes.disabled].join(' ')
    }

    let classIcon = state === startStates.default ? classes.defaultColor : classes.activateColor

    return (
        <div onClick={() => router.push('/plans')} className={classContainer}                
         style={{}} >
            <div className={classes.center}>
                <div className={classes.icon} >
                &#x2665;
                    {/* {
                        disabled ? <MicrophoneOffIcon className={classes.disabledColor} /> : <MicrophoneIcon className={classIcon} />
                    } */}
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

MenuButton.propTypes = {
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

export default MenuButton