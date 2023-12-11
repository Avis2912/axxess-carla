// pages/api/textToSpeech.js
import axios from 'axios';
import fs from 'fs';
import { join } from 'path';

export default async function POST(req, res) {
    console.log('YOOOOOOOOOOO');
    if (req.method === 'POST') {
        const { text, outputPathPrefix } = await req.json();

        // Configure the OpenAI TTS API Calls
        const url = "https://api.openai.com/v1/audio/speech";
        const headers = {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
        };

        const data = {
            model: "tts-1-hd",
            input: text,
            voice: "nova",
            response_format: "mp3",
        };

        try {
            const response = await axios.post(url, data, {
                headers: headers,
                responseType: "arraybuffer",
            });

            // Generate file path
            const audioDir = './public/audio'; // Store files in the public directory
            const timestamp = new Date().toISOString().replace(/:/g, "-");
            const audioFilename = `${outputPathPrefix}_${timestamp}.mp3`;
            const audioPath = join(audioDir, audioFilename);

            // Ensure directory exists
            if (!fs.existsSync(audioDir)) {
                fs.mkdirSync(audioDir, { recursive: true });
            }

            // Write the file
            fs.writeFileSync(audioPath, Buffer.from(response.data, "binary"));

            // Respond with the path to the audio file
            return new Response({ audioPath: `/audio/${audioFilename}` });
        } catch (error) {
            console.error("Error in textToSpeech API:", error.message);
            res.status(500).json({ error: "Error generating audio" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
    return 'hello';
}
