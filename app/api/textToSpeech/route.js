// app/api/textToSpeech/route.ts
import openaiService from '/services/openaiService';

export async function POST(request) {
  try {
    const { text } = await request.json();
    const audioFilePath = await openaiService.textToSpeech(text);
    console.log("Sending response:", JSON.stringify({ audioFilePath }));
    return new Response(JSON.stringify({ audioFilePath }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
