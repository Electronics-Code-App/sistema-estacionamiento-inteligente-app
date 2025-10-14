import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SensorViewer: React.FC = () => {
  const [mensaje, setMensaje] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/api/sensor-data`)
        .then(res => setMensaje(res.data.dato))
        .catch(err => console.error('Error al obtener datos del sensor:', err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h3>Dato del Sensor:</h3>
        <div className="alert alert-primary mt-3">
          {mensaje || 'Esperando datos...'}
        </div>
      </div>
    </div>
  );
};

export default SensorViewer;
