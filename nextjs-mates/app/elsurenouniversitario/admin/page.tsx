'use client';

import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { satisfy, quicksand } from '@/app/ui/fonts';
import VentasGrafico from '@/app/ui/admin/ventasGrafico';
import TopMates from '@/app/ui/admin/topMates';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { sendNotification } from '@/app/lib/actions';
import { graficoSkeleton } from '@/app/ui/skeletons';
import { TopMatesSkeleton } from '@/app/ui/skeletons';

const mesesOptions = [1, 3, 6, 12];

export default function Page() {
    const [meses, setMeses] = useState<number>(6);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendNotification = async () => {
        if (!title || !body) return;
        setSending(true);
        try {
            // Envía la notificación solo si hay título y cuerpo
            await sendNotification(title, body);
            console.log('Notificación enviada');
            setTitle('');
            setBody('');
        } catch (error) {
            console.error('Error al enviar notificación:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={`${quicksand.className} flex flex-col gap-4 p-4`}>
            <h1 className={`${satisfy.className} text-4xl text-carbon`}>Panel de Administración</h1>

            <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md md:col-span-2">
                    <h2 className="text-2xl">
                        Ventas de los últimos {meses} mes{meses > 1 ? 'es' : ''}
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <label className="text-lg">Seleccionar últimos meses:</label>

                        <Listbox value={meses} onChange={setMeses}>
                            <div className="relative">
                                <Listbox.Button className="relative w-25 cursor-pointer rounded-md bg-greenMateButton py-2 pl-4 pr-10 text-left border border-greenMateButton text-white text-lg hover:opacity-80">
                                    {meses} mes{meses > 1 ? 'es' : ''}
                                    <ChevronUpDownIcon
                                        className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-white"
                                        aria-hidden="true"
                                    />
                                </Listbox.Button>

                                <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-48 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {mesesOptions.map((num) => (
                                        <Listbox.Option
                                            key={num}
                                            value={num}
                                            className={({ active }) =>
                                                `cursor-pointer select-none px-4 py-2 text-lg ${active ? 'bg-greenMateButton text-white' : 'bg-white text-gray-700'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <span className="flex items-center justify-between">
                                                    {num} mes{num > 1 ? 'es' : ''}
                                                    {selected && <CheckIcon className="h-5 w-5 text-greenMateButton" />}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>

                    <VentasGrafico meses={meses} graficoSkeleton={graficoSkeleton()} />
                </div>

                <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl">Top Ventas</h2>
                    <TopMates skeleton={<TopMatesSkeleton />} />


                    <h2 className="text-2xl mt-6">Enviar notificación</h2>

                    <input
                        type="text"
                        placeholder="Título de la notificación"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Cuerpo de la notificación"
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />

                    <button
                        className="px-4 py-2 bg-greenMateButton text-white rounded-md hover:bg-green-700"
                        onClick={handleSendNotification}
                        disabled={sending}
                    >
                        {sending ? 'Enviando...' : 'Enviar notificación'}
                    </button>
                </div>
            </div>
        </div>
    );
}
