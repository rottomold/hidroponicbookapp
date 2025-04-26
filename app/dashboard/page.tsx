'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { parse } from 'json2csv'; // Importar la librería json2csv

// Definir la interfaz para los registros
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

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Actualizar el tipo del estado 'registros' usando la interfaz
  const [registros, setRegistros] = useState<Registro[]>([]);

  // Obtener registros de la base de datos al cargar el componente
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

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Función para navegar a la página de nuevo registro
  const handleNuevoRegistro = () => {
    router.push('/dashboard/nuevo');
  };

  // Función para exportar los registros a CSV
  const handleExportCSV = () => {
    try {
      if (registros.length === 0) {
        alert('No hay registros para exportar');
        return;
      }

      const csv = parse(registros); // Convertir los registros a CSV usando json2csv
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'registros_hidroponicos.csv'; // Nombre del archivo CSV
      link.click(); // Inicia la descarga
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      alert('Hubo un error al exportar los datos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-2">Control Cultivo Hidropónico</h1>
      <p className="mb-8 text-gray-600">Registro y monitoreo de datos.</p>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={handleNuevoRegistro}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          + Nuevo Registro
        </button>

        {/* Aquí se ajusta la ruta de navegación al historial */}
        <button
          onClick={() => router.push('/dashboard/historial')}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Ver Historial
        </button>

        <button
          onClick={() => router.push('/dashboard/grafico-ph')}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Gráfico pH
        </button>

        <button
          onClick={() => router.push('/dashboard/grafico-ec')}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Gráfico EC
        </button>

        {/* Botón de exportación a CSV */}
        <button
          onClick={handleExportCSV}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Exportar a CSV
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
