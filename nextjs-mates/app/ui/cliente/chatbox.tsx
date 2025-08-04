'use client';

import { useEffect, useRef, useState } from 'react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

export default function ChatBox() {
    // Mensaje inicial del asistente
    const initialMessage = { role: 'assistant', content: '¡Hola! ¿Querés saber algo sobre el mate?' };
    // Estado mensajes, input, y loading
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([initialMessage]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // Auto scroll al final cuando cambian los mensajes y el usuario ya escribió
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const userHasInteracted = messages.some(m => m.role === 'user');
        if (userHasInteracted) {
            scrollToBottom();
        }
    }, [messages]);

    // Enviar mensaje al API, actualizar estado mensajes e input
    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/mate-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();
            setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages([
                ...newMessages,
                { role: 'assistant', content: 'Error al obtener respuesta del asistente.' },
            ]);
        } finally {
            setLoading(false);
        }
    };
    // Limpiar mensajes y volver al mensaje inicial
    const handleClear = () => {
        setMessages([initialMessage]);
    };

    return (
        <div className="w-full max-w-xl mx-auto p-4 rounded-xl shadow-md shadow-greenMate bg-white overflow-x-hidden">
            <div className="max-h-[500px] overflow-y-auto overflow-x-hidden space-y-3 mb-4">
                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';

                    return (
                        <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className="relative max-w-[75%] break-words">
                                <div
                                    className={`px-4 py-2 rounded-lg text-white text-sm bg-greenMate ${isUser ? 'rounded-br-none text-right' : 'rounded-bl-none text-left'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                <div
                                    className={`absolute top-2 ${isUser
                                        ? 'right-[-8px] border-t-8 border-b-8 border-t-transparent border-b-transparent border-l-8 border-l-greenMate'
                                        : 'left-[-8px] border-t-8 border-b-8 border-t-transparent border-b-transparent border-r-8 border-r-greenMate'
                                        }`}
                                ></div>
                            </div>
                        </div>
                    );
                })}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-greenMate text-white text-sm px-4 py-2 rounded-lg">
                            Pensando sobre mates...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Preguntá algo sobre mates..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-greenMate hover:opacity-80 text-white px-4 py-2 rounded-lg transition"
                    disabled={loading}
                >
                    <PaperPlaneIcon />
                </button>
            </div>

            <div className="mt-2 text-center">
                <button
                    onClick={handleClear}
                    className="text-base text-greenMate hover:opacity-80 transition"
                >
                    Limpiar chat
                </button>
            </div>
        </div>
    );
}
