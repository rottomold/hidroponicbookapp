'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Registro {
  id: number;
  temperatura_agua: string;
  ph: string;
  ec: string;
  nivel_agua: string;
  altura_plantas: string;
  color_planta: string;
  estado_raices: string;
  plagas: string;
  flujo_sistema: string;
  mantenimiento: string;
  anotaciones: string;
}

export default function HistorialPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [registros, setRegistros] = useState<Registro[]>([]);

  // Obtener los registros de la base de datos
  useEffect(() => {
    async function fetchRegistros() {
      const { data, error } = await supabase.from('registros').select('*');
      if (error) {
        console.error('Error al obtener registros:', error);
      } else {
        setRegistros(data);
      }
    }

    fetchRegistros();
  }, [supabase]);

  // Volver al dashboard principal
  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Historial de Registros</h1>
      <p className="mb-8 text-gray-800">Lista de todos los registros almacenados.</p>

      <button
        onClick={handleBackToDashboard}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4"
      >
        Volver al Dashboard
      </button>

      {/* Tabla de registros */}
      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-gray-900">ID</th>
              <th className="px-4 py-2 border-b text-gray-900">Temperatura Agua</th>
              <th className="px-4 py-2 border-b text-gray-900">pH</th>
              <th className="px-4 py-2 border-b text-gray-900">EC</th>
              <th className="px-4 py-2 border-b text-gray-900">Nivel Agua</th>
              <th className="px-4 py-2 border-b text-gray-900">Altura Plantas</th>
              <th className="px-4 py-2 border-b text-gray-900">Color Planta</th>
              <th className="px-4 py-2 border-b text-gray-900">Estado Raíces</th>
              <th className="px-4 py-2 border-b text-gray-900">Plagas</th>
              <th className="px-4 py-2 border-b text-gray-900">Flujo Sistema</th>
              <th className="px-4 py-2 border-b text-gray-900">Mantenimiento</th>
              <th className="px-4 py-2 border-b text-gray-900">Anotaciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length > 0 ? (
              registros.map((registro) => (
                <tr key={registro.id}>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.id}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.temperatura_agua}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.ph}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.ec}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.nivel_agua}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.altura_plantas}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.color_planta}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.estado_raices}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.plagas}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.flujo_sistema}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.mantenimiento}</td>
                  <td className="px-4 py-2 border-b text-gray-900">{registro.anotaciones}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="px-4 py-2 text-center border-b text-gray-900">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}