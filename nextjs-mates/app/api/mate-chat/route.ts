import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ reply: 'No se enviaron mensajes válidos.' }, { status: 400 });
    }

    // Mensaje de sistema que define el rol del asistente
    const systemMessage = {
      role: 'system',
      content: `Sos un experto exclusivamente en mates. Respondé únicamente preguntas relacionadas con el mate: su historia, preparación, tipos de yerba, beneficios, costumbres, o cultura. 
      No respondas preguntas que no estén relacionadas con el mate. Si el tema no es sobre el mate, indicá amablemente que solo podés responder consultas sobre el mate.`,
    };

    // Solicitud al modelo de lenguaje a través de OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Extrae la respuesta generada o fallback
    const reply = data.choices?.[0]?.message?.content?.trim() || 'No entendí la pregunta. ¿Podés repetirla?';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error al consultar Gemini:', error);
    return NextResponse.json({ reply: 'Hubo un problema con el asistente.' }, { status: 500 });
  }

}