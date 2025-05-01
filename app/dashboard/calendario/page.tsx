'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import esLocale from '@fullcalendar/core/locales/es';
import { DateClickArg } from '@fullcalendar/interaction';


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
  const [eventosDelDia, setEventosDelDia] = useState<EventoCalendario[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
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
        title: `${cultivo.nombre} - ${cultivo.descripcion} plantas`,
        start: cultivo.fecha_siembra,
        color: '#4ade80',
      }));

      setEventos(eventosFormateados);
    };

    fetchCultivos();
  }, [supabase]);

  const handleGoBack = () => {
    router.back();
  };

  const handleDateClick = (arg: DateClickArg) => {
    const fecha = arg.dateStr;
    const filtrados = eventos.filter((evento) => evento.start === fecha);
    setEventosDelDia(filtrados);
    setFechaSeleccionada(fecha);
    setMostrarModal(true);
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
        dateClick={handleDateClick}
        titleFormat={{ month: 'long', year: 'numeric' }}
      />

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Eventos del {fechaSeleccionada}</h2>
            {eventosDelDia.length > 0 ? (
              <ul className="space-y-2">
                {eventosDelDia.map((evento) => (
                  <li key={evento.id} className="border p-2 rounded text-zinc-800">
                    {evento.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-700">No hay cultivos este día.</p>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .fc-event-title, 
        .fc-event-time, 
        .fc-event .fc-event-main {
          color: black !important;
        }
      `}</style>
    </div>
  );
}
