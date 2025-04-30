'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

export default function NuevoCultivoPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaSiembra, setFechaSiembra] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear cultivo
    const { error: cultivoError } = await supabase
      .from('cultivos')
      .insert([
        {
          nombre,
          descripcion,
          fecha_siembra: fechaSiembra,
        },
      ]);

    if (cultivoError) {
      toast.error('Error al crear cultivo: ' + cultivoError.message);
      return;
    }

    toast.success('Cultivo creado correctamente');

    router.push('/dashboard');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center flex-col mt-10 bg-white p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900">Nuevo Cultivo</h2>
      <button
        onClick={handleBackToDashboard}
        className="mb-7 w-3xs font-bold bg-zinc-800 hover:bg-zinc-900 text-white py-2 rounded">
        Volver al Dashboard
      </button>

      <form onSubmit={handleSubmit} className="space-y-4 w-xs flex flex-col items-center">
        <div>
          <label className="block text-sm font-medium text-zinc-800">Nombre del cultivo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-xs px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-800">Cantidad</label>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="w-xs px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-800">Fecha de siembra</label>
          <input
            type="date"
            value={fechaSiembra}
            onChange={(e) => setFechaSiembra(e.target.value)}
            required
            className="w-xs px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className='flex items-center'>
          <button
            type="submit"
            className="mt-5 w-3xs bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded">
            Guardar Cultivo
          </button>
        </div>
      </form>
    </div>
  );
  
}

