'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import esLocale from '@fullcalendar/core/locales/es';

interface Cultivo {
  id: number;
  nombre: string;
  fecha_siembra: string;
  descripcion: string;
  created_at: string;
}

interface EventoCalendario {
  id: string;
  title: string;
  start: string;
  color?: string;
}

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchCultivos = async () => {
      const { data, error } = await supabase
        .from('cultivos')
        .select('id, nombre, fecha_siembra, descripcion, created_at');

      if (error) {
        console.error('Error al cargar cultivos:', error.message);
        return;
      }

      if (!data) return;

      const eventosFormateados: EventoCalendario[] = data.map((cultivo: Cultivo) => ({
        id: cultivo.id.toString(),
        title: `${cultivo.nombre} - ${cultivo.descripcion}`,
        start: cultivo.fecha_siembra,
        color: '#4ade80', // color verde fijo
      }));

      setEventos(eventosFormateados);
    };

    fetchCultivos();
  }, [supabase]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="p-4 text-black flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mb-4 text-zinc-900">Calendario de Cultivo</h1>
      <div className="mb-4">
        <button
          onClick={handleGoBack}
          className="bg-zinc-800 hover:bg-zinc-900 text-white py-2 px-4 rounded"
        >
          Volver al Dashboard
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        locales={[esLocale]}
        firstDay={1}
        height="auto"
        contentHeight="auto"
        events={eventos}
        titleFormat={{
          month: 'long',
          year: 'numeric',
        }}
      />
      <style jsx global>{`
        /* Estilo para que el texto dentro de los eventos sea negro */
        .fc-event-title, 
        .fc-event-time, 
        .fc-event .fc-event-main {
          color: black !important;
        }
      `}</style>

    </div>
  );
}
