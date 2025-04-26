'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

type FormField =
  | 'temperatura_agua'
  | 'ph'
  | 'ec'
  | 'nivel_agua'
  | 'altura_plantas'
  | 'color_planta'
  | 'estado_raices'
  | 'plagas'
  | 'nutrientes'
  | 'flujo_sistema'
  | 'mantenimiento'
  | 'anotaciones';

const initialFormData: Record<FormField, string> = {
  temperatura_agua: '',
  ph: '',
  ec: '',
  nivel_agua: '0',  // Inicializa el valor como un string (por el manejo en el estado)
  altura_plantas: '',
  color_planta: '',
  estado_raices: '',
  plagas: '',
  nutrientes: '',
  flujo_sistema: 'Óptimo',
  mantenimiento: '',
  anotaciones: ''
};

export default function NuevoRegistro() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [horaActual, setHoraActual] = useState('');
  const [fechaActual, setFechaActual] = useState('');
  const [temperaturaAmbiente, setTemperaturaAmbiente] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<FormField, string>>(initialFormData);
  const [nutrientesAñadidos, setNutrientesAñadidos] = useState<boolean>(false);
  const [mantenimientoRealizado, setMantenimientoRealizado] = useState<boolean>(false);
  const [plagasDetectadas, setPlagasDetectadas] = useState<boolean>(false);
  const [flujoSistema, setFlujoSistema] = useState<string>('Óptimo');

  useEffect(() => {
    const ahora = new Date();
    setHoraActual(ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setFechaActual(ahora.toLocaleDateString());

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Buenos Aires&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error(`Clima: ${res.statusText}`);
        const data = await res.json();
        setTemperaturaAmbiente(data.main.temp);
      } catch (err) {
        console.error('Error clima:', err);
        toast.error('Error al obtener el clima');
      }
    }

    fetchWeather();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }

    const { error } = await supabase.from('registros').insert([
      {
        ...formData,
        nutrientes: nutrientesAñadidos ? formData.nutrientes : 'no',
        mantenimiento: mantenimientoRealizado ? formData.mantenimiento : 'no',
        plagas: plagasDetectadas ? formData.plagas : 'no',
        temperatura_agua: parseFloat(formData.temperatura_agua) || null,
        ph: parseFloat(formData.ph) || null,
        ec: parseFloat(formData.ec) || null,
        nivel_agua: parseFloat(formData.nivel_agua) || null,
        altura_plantas: parseFloat(formData.altura_plantas) || null,
        temperatura_ambiente: temperaturaAmbiente,
        flujo_sistema: flujoSistema,
      }
    ]);

    if (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar el registro');
    } else {
      toast.success('Registro guardado correctamente');
      router.push('/dashboard');
    }
  };

  const fields: { label: string; name: FormField; type: string }[] = [
    { label: 'Temperatura del agua', name: 'temperatura_agua', type: 'number' },
    { label: 'pH', name: 'ph', type: 'number' },
    { label: 'EC', name: 'ec', type: 'number' },
    { label: 'Altura promedio plantas', name: 'altura_plantas', type: 'number' },
    { label: 'Color de planta', name: 'color_planta', type: 'text' },
    { label: 'Estado de raíces', name: 'estado_raices', type: 'text' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-4 text-black">Nuevo Registro</h1>

      <button
        onClick={() => router.push('/dashboard')}
        className="mb-6 bg-zinc-700 hover:bg-zinc-900 text-white font-bold py-2 px-4 rounded w-xs"
      >
        Volver al Dashboard
      </button>

      <div className="flex gap-6 mb-6 text-lg font-semibold">
        <span>{horaActual}</span>
        <span>{fechaActual}</span>
        <span>{temperaturaAmbiente !== null ? `${temperaturaAmbiente} °C` : 'Cargando...'}</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-6">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={field.name} className="font-semibold mb-2 text-black">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        ))}

        {/* Cambio en Nivel de Agua: Ahora es un Slider */}
        <div className="flex flex-col">
          <label htmlFor="nivel_agua" className="font-semibold mb-2 text-black">
            Nivel de agua
          </label>
          <div className="mt-2 text-center font-semibold mb-5 text-black">
            {formData.nivel_agua}%
          </div>
          <input
            type="range"
            id="nivel_agua"
            name="nivel_agua"
            min="0"
            max="100"
            step="1"
            value={formData.nivel_agua}
            onChange={handleChange}
            aria-label="Nivel de agua"
            className="w-full mx-auto h-10 bg-gray-300 rounded-full appearance-none focus:outline-none ring-2 ring-zinc-900 custom-slider"
          />
        </div>


        {/* Bloque especial para "¿Se detectaron plagas?" */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-black">¿Se detectaron plagas?</label>
          <div className="flex flex-wrap gap-4 mb-2">
            <button
              type="button"
              className={`py-2 px-4 rounded ${plagasDetectadas === true ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setPlagasDetectadas(true)}
            >
              Sí
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded ${plagasDetectadas === false ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setPlagasDetectadas(false)}
            >
              No
            </button>
          </div>

          {plagasDetectadas && (
            <input
              type="text"
              name="plagas"
              id="plagas"
              value={formData.plagas}
              onChange={handleChange}
              placeholder="Describe las plagas detectadas"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}
        </div>

        {/* Sección Flujo del sistema */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-black">Flujo del sistema</label>
          <div className="flex flex-wrap gap-2">
            {['Excesivo', 'Óptimo', 'Bueno', 'Intermitente', 'Fluctuante', 'Insuficiente'].map((option) => (
              <button
                key={option}
                type="button"
                className={`py-2 px-4 rounded ${flujoSistema === option ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setFlujoSistema(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Bloques de Nutrientes y Mantenimiento */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-black">¿Se añadieron nutrientes?</label>
          <div className="flex flex-wrap gap-4 mb-2">
            <button
              type="button"
              className={`py-2 px-4 rounded ${nutrientesAñadidos === true ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setNutrientesAñadidos(true)}
            >
              Sí
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded ${nutrientesAñadidos === false ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setNutrientesAñadidos(false)}
            >
              No
            </button>
          </div>

          {nutrientesAñadidos && (
            <input
              type="text"
              name="nutrientes"
              id="nutrientes"
              value={formData.nutrientes}
              onChange={handleChange}
              placeholder="Describe los nutrientes añadidos"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-black">¿Se realizó mantenimiento?</label>
          <div className="flex flex-wrap gap-4 mb-2">
            <button
              type="button"
              className={`py-2 px-4 rounded ${mantenimientoRealizado === true ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setMantenimientoRealizado(true)}
            >
              Sí
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded ${mantenimientoRealizado === false ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setMantenimientoRealizado(false)}
            >
              No
            </button>
          </div>

          {mantenimientoRealizado && (
            <input
              type="text"
              name="mantenimiento"
              id="mantenimiento"
              value={formData.mantenimiento}
              onChange={handleChange}
              placeholder="Describe el mantenimiento realizado"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}
        </div>

        {/* Sección Anotaciones */}
        <div className="flex flex-col">
          <label htmlFor="anotaciones" className="font-semibold mb-2 text-black">
            Anotaciones
          </label>
          <textarea
            name="anotaciones"
            id="anotaciones"
            value={formData.anotaciones}
            onChange={handleChange}
            placeholder="Escribe tus anotaciones aquí"
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-6"
        >
          Guardar Registro
        </button>
      </form>
    </div>
  );
}
