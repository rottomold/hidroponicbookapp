'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Line } from 'react-chartjs-2'; // Usaremos Chart.js para crear la gráfica
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function GraficoEcPage() {
  const router = useRouter(); // Instancia del router
  const supabase = createClientComponentClient();
  const [ecData, setEcData] = useState<number[]>([]); // Estado para los datos de EC
  const [labels, setLabels] = useState<string[]>([]); // Estado para las etiquetas de fecha y hora

  // Obtener los registros de la base de datos
  useEffect(() => {
    async function fetchEcData() {
      const { data, error } = await supabase.from('registros').select('ec, created_at');
      if (error) {
        console.error('Error al obtener los datos de EC:', error);
      } else {
        const ecValues = data?.map((registro) => parseFloat(registro.ec)) || []; // Obtenemos los valores de EC
        const timestamps = data?.map((registro) => new Date(registro.created_at).toLocaleString()) || []; // Obtenemos las fechas
        setEcData(ecValues);
        setLabels(timestamps);
      }
    }

    fetchEcData();
  }, [supabase]);

  // Configuración del gráfico
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'EC (Conductividad Eléctrica)',
        data: ecData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Configuración de las opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gráfico de EC',
      },
    },
    scales: {
      x: {
        type: 'category' as const, // Aseguramos que el tipo sea "category"
        title: {
          display: true,
          text: 'Fecha y Hora',
        },
        ticks: {
          // Roteamos las etiquetas de las fechas a 90 grados para que se vean verticales
          maxRotation: 90,
          minRotation: 90,
        },
      },
      y: {
        type: 'linear' as const, // Aseguramos que el tipo sea "linear"
        title: {
          display: true,
          text: 'Valor EC (dS/m)', // Se indica que la unidad es dS/m
        },
      },
    },
  };

  // Función para volver a la página anterior
  const handleGoBack = () => {
    router.back(); // Esta función regresa a la página anterior
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-2">Gráfico de EC</h1>
      <p className="mb-8 text-gray-600">Visualización de los valores de Conductividad Eléctrica (EC) del sistema de cultivo hidropónico.</p>

      <div className="w-full max-w-6xl">
        <Line data={data} options={options} />
      </div>

      {/* Botón de volver debajo del gráfico */}
      <div className="mt-8">
        <button
          onClick={handleGoBack}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
