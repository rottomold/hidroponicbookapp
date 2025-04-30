'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import esLocale from '@fullcalendar/core/locales/es'; // <-- 1. Importa el locale específico


interface EventoCultivo {
  id: number;
  etapa: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  color: string | null;
  cultivo: { nombre: string }[]; // <- Ajustado aquí
}


interface EventoCalendario {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
}

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchEventos = async () => {
      const { data, error } = await supabase
        .from('eventos_cultivo')
        .select('id, etapa, fecha_inicio, fecha_fin, color, cultivo:cultivos!eventos_cultivo_cultivo_id_fkey(nombre)');

      if (error) {
        console.error('Error al cargar eventos:', error?.message || error);
        return;
      }

      if (!data || data.length === 0) {
        console.warn('No se encontraron eventos.');
        return;
      }

      const eventosFormateados: EventoCalendario[] = data.map((evento: EventoCultivo) => ({
        id: evento.id.toString(),
        title: `${evento.cultivo[0]?.nombre ?? 'Cultivo desconocido'} - ${evento.etapa}`,
        start: evento.fecha_inicio,
        end: evento.fecha_fin || undefined,
        color: evento.color || '#4ade80',
      }));
      

      setEventos(eventosFormateados);
    };

    fetchEventos();
  }, [supabase]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="p-4  text-black flex flex-col items-center">
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
      locales={[esLocale]}  // <-- 2. Proporciona aquí los datos del locale importado
      firstDay={1} // <-- Añade esta línea para empezar en lunes
      height="auto"
      events={eventos}
      contentHeight="auto"

           // --- Aquí añades el formato del título ---
           titleFormat={{
            month: 'long', // 'numeric', '2-digit', 'long', 'short', 'narrow'
            year: 'numeric', // 'numeric', '2-digit'
            // day: 'numeric', // 'numeric', '2-digit' (útil en vistas de semana/día)
            // weekday: 'long' // 'long', 'short', 'narrow' (útil en vistas de semana/día)
          }}
    />
    </div>
  );
}
