// pages/api/send_sms.js

import twilio from 'twilio';
import { NextResponse } from 'next/server';

// Your Twilio account SID and auth token
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(twilioAccountSid, twilioAuthToken);

export async function POST(req) {
    // Assuming 'req' is of type NextRequest
    let data = await req.text(); // Read the data as text first
    try {
        data = JSON.parse(data); // Try to manually parse the text as JSON
    } catch (error) {
        console.error('Error parsing request body:', error);
        // Handle the error appropriately
        return new NextResponse(JSON.stringify({ success: false, message: 'Error parsing request body', error: error.message }), { status: 400 });
    }

    console.log('Received request body:', data); // Log the parsed request body

    if (req.method === 'POST') {
        const { body, from, to } = data; // Use 'data' instead of 'req.body'

        try {
            const call = await client.calls.create({
                twiml: `<Response><Say>Hello Hello ${body} Hello Hello.</Say></Response>`,
                to: to, // Use the 'to' variable from the parsed data
                from: from, // Use the 'from' variable from the parsed data
            });

            return new NextResponse(JSON.stringify({ success: true, message: 'Call initiated', callSid: call.sid }), { status: 200 });
        } catch (error) {
            console.error('Error creating Twilio call:', error);
            return new NextResponse(JSON.stringify({ success: false, message: 'Failed to initiate call', error: error.message }), { status: 500 });
        }
    } else {
        // Handle any non-POST requests
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405, headers: { 'Allow': 'POST' } });
    }
}
