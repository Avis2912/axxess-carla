import { cleanInput } from '/lib/utils';
// Use fetch for sending requests
import fetch from 'node-fetch';

export async function POST(req) {
    const form = await req.formData();
    const blob = form.get('file');
    const name = cleanInput(form.get('name'));
    const datetime = cleanInput(form.get('datetime'));
    const raw_options = cleanInput(form.get('options'));

    if (!blob || !name || !datetime) {
        return new Response('Bad Request', { status: 400 });
    }

    const options = JSON.parse(raw_options);

    // Convert the blob to base64
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    try {
        // Sending POST request to the Cloud Run API
        const apiResponse = await fetch('https://whisper-docker-3eayvxgjqa-uc.a.run.app/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': 'Bearer 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' },
            body: JSON.stringify({ audio: base64Audio })
        });

        console.log(apiResponse);


        if (!apiResponse.ok) {
            throw new Error('Failed to transcribe audio');
        }

        const responseData = await apiResponse.text();
        console.log(responseData);

        return new Response(JSON.stringify({
            datetime,
            filename: `${name}.webm`,
            data: responseData
        }), {
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
