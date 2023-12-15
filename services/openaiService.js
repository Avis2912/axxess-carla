const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY // Ensure the API key is set in your environment variables
});

let messageHistory = []; // Global message history
const { PassThrough } = require('stream');

let activeStream = null;

const openaiService = {
    textToSpeech: async function (text) {
        try {
            const response = await openai.audio.speech.create({
                model: "tts-1",
                voice: "nova",
                input: text,
                stream: true
            });
        
            if (response && response.body) {
                activeStream = new PassThrough();
                response.body.pipe(activeStream);

                // Instead of sending chunks to a target window, 
                // you might accumulate them in a buffer or handle them as needed for HTTP response
                const chunks = [];
                activeStream.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                return new Promise((resolve, reject) => {
                    activeStream.on('end', () => {
                        console.log('Audio stream ended');
                        resolve(Buffer.concat(chunks));
                    });
                    activeStream.on('error', reject);
                });
            } else {
                throw new Error('No streamable audio data received');
            }
        } catch (error) {
            console.error('Error in text-to-speech streaming:', error);
            throw error;
        }
    },

    stopCurrentStream: function () {
        if (activeStream) {
            activeStream.destroy(); // Stop streaming
            activeStream = null;
            console.log('TTS stream stopped');
        }
    },
};

module.exports = openaiService;