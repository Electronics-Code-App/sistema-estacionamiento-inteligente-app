import { useEffect, useState } from 'react';
import axios from 'axios';

const SensorViewer = () => {
  const [dato, setDato] = useState('');

  useEffect(() => {
    const intervalo = setInterval(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/api/sensor-data`)
        .then(res => {
          if (res.data && res.data.dato !== undefined) {
            setDato(res.data.dato);
          }
        })
        .catch(err => {
          console.error('Error al obtener dato del sensor:', err);
        });
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="container mt-5">
      <h4>Dato actual del sensor:</h4>
      <div className="alert alert-info">{dato}</div>
    </div>
  );
};

export default SensorViewer;
