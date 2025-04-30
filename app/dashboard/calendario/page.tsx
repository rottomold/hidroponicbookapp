'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';
interface EventoCultivo {
    title: string;
    start: string;
    end?: string;
    color?: string;
  }
  
  export default function CalendarioCultivo() {
    const [eventos, setEventos] = useState<EventoCultivo[]>([]);
    const router = useRouter();
  
    useEffect(() => {
      const eventosEjemplo: EventoCultivo[] = [
        {
          title: 'Siembra Lechuga',
          start: '2025-05-01',
          end: '2025-05-02',
          color: '#4ade80',
        },
        {
          title: 'Germinación',
          start: '2025-05-02',
          end: '2025-05-07',
          color: '#fde68a',
        },
        {
          title: 'Crecimiento',
          start: '2025-05-08',
          end: '2025-05-20',
          color: '#60a5fa',
        },
        {
          title: 'Floración',
          start: '2025-05-21',
          end: '2025-05-28',
          color: '#c084fc',
        },
        {
          title: 'Cosecha',
          start: '2025-05-29',
          end: '2025-05-30',
          color: '#f87171',
        },
      ];
  
      setEventos(eventosEjemplo);
    }, []);
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-zinc-800 text-center">Calendario de Cultivo</h1>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-zinc-800 text-white py-2 px-4 rounded hover:bg-zinc-900 mb-4">
          Volver al Dashboard
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventos}
          height="auto"
        />
      </div>
    </div>
  );
}
