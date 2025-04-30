'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function NuevoCultivoPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaSiembra, setFechaSiembra] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear cultivo
    const { data: cultivo, error: cultivoError } = await supabase
      .from('cultivos')
      .insert([
        {
          nombre,
          descripcion,
          fecha_siembra: fechaSiembra,
        },
      ])
      .select()
      .single();

    if (cultivoError) {
      alert('Error al crear cultivo: ' + cultivoError.message);
      return;
    }

    // Crear evento de "Siembra" automáticamente
    const { error: eventoError } = await supabase.from('eventos_cultivo').insert([
      {
        etapa: 'Siembra',
        fecha_inicio: fechaSiembra,
        cultivo_id: cultivo.id,
        color: '#4ade80', // verde
      },
    ]);

    if (eventoError) {
      alert('Cultivo creado, pero error al crear evento: ' + eventoError.message);
    } else {
      alert('Cultivo y evento de siembra creados correctamente');
    }

    router.push('/dashboard'); // Redirige al dashboard
  };

    // Volver al dashboard principal
    const handleBackToDashboard = () => {
      router.push('/dashboard');
    };
  

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900">Nuevo Cultivo</h2>
      <button
        onClick={handleBackToDashboard}
        className="w-xs bg-zinc-800 hover:bg-zinc-900 text-white py-2 rounded mb-4">
        Volver al Dashboard
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-800">Nombre del cultivo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">Fecha de siembra</label>
          <input
            type="date"
            value={fechaSiembra}
            onChange={(e) => setFechaSiembra(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">Descripción (opcional)</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded"
        >
          Guardar Cultivo
        </button>
      </form>
    </div>
  );
}
