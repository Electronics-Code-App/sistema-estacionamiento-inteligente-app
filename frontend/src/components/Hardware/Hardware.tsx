import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaMicrochip,
  FaCogs,
  FaRulerVertical,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaListAlt,
} from 'react-icons/fa';

import './Hardware.css';

import arduinoLogoActivo from '../../assets/arduino-logo-activo.png';
import arduinoLogoDesactivo from '../../assets/arduino-logo-desactivo.png';
import servomotorLogo from '../../assets/servo-motor-logo.png';
import ultrasonidoLogo from '../../assets/ultrasonido-logo.png';
import circuitoImg from '../../assets/circuito.png';

type DashboardData = {
  arduinoConectado: boolean;
  posicionServo: number;
  distancia: number;
  vehiculoDetectado: boolean;
  solicitudSalida: boolean;
};

const Hardware = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const apiBase = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/sensor-data/estado`);
        setData(res.data);
      } catch (err) {
        console.error('Error al cargar estado:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [apiBase]);

  const estadoServo = (angulo: number | undefined) => {
    if (angulo === undefined) return 'Desconocido';
    if (angulo < 45) return 'Pluma abajo';
    if (angulo >= 45) return 'Pluma arriba';
    return 'Desconocido';
  };

  const estadoUltrasonido = (distancia: number | undefined) => {
    if (distancia === undefined) return 'Sin dato';
    if (distancia < 15) return 'Vehículo cerca';
    return 'Área libre';
  };

  return (
    <div className="hardware-container mt-0">
      <h3 className="hardware-title">
        <FaMicrochip className="me-2" />
        Hardware del Sistema
      </h3>

      <div className="hardware-grid">
        {/* === BOM === */}
        <div className="hardware-bom">
          <h6 className="hardware-bom-title">
            <FaListAlt className="me-2" />
            Lista de Componentes (BOM)
          </h6>
          <ul className="hardware-bom-list">
            {[
              'Arduino Uno',
              'Sensor ultrasónico HC-SR04',
              'Servomotor SG90',
              'Protoboard',
              'Resistencias',
              'Cables jumper',
            ].map((item, idx) => (
              <li key={idx}>
                <FaCheckCircle className="icon-check" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* === CIRCUITO === */}
        <div className="hardware-circuito">
          <a
            href="https://www.tinkercad.com/things/kwR2zGe0yov-estacionamiento-inteligente?sharecode=MhOq3CV3NacPbdOVzoAErWmqFPQFw0NGMW_xglxIiXg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="hardware-circuito-card">
              <h5>
                <FaRulerVertical className="me-2" />
                Diseño del Circuito
              </h5>
              <div className="circuito-img-wrapper">
                <img src={circuitoImg} alt="Circuito en Tinkercad" />
              </div>
              <div className="ver-diagrama">
                Ver diagrama <FaExternalLinkAlt size={14} />
              </div>
            </div>
          </a>
        </div>

        {/* === COMPONENTES === */}
        <div className="hardware-componentes">
          <h5 className="hardware-subtitle">
            <FaCogs className="me-2" />
            Componentes
          </h5>

          <div className="hardware-cards">
            {/* Servo */}
            <div className="hardware-card">
              <img src={servomotorLogo} alt="Servo" />
              <div>
                <h6>Servo</h6>
                <p>Ángulo: {data?.posicionServo}°</p>
                <span
                  className={`badge bg-${
                    data?.posicionServo !== undefined && data.posicionServo < 45
                      ? 'success'
                      : 'danger'
                  }`}
                >
                  {estadoServo(data?.posicionServo)}
                </span>
              </div>
            </div>

            {/* Ultrasonido */}
            <div className="hardware-card">
              <img src={ultrasonidoLogo} alt="Ultrasonido" />
              <div>
                <h6>Sensor Ultrasónico</h6>
                <p>Distancia: {data?.distancia} cm</p>
                <span
                  className={`badge bg-${
                    data && data.distancia < 15 ? 'danger' : 'success'
                  }`}
                >
                  {estadoUltrasonido(data?.distancia)}
                </span>
              </div>
            </div>

            {/* Arduino */}
            <div className="hardware-card">
              <img
                src={
                  data?.arduinoConectado
                    ? arduinoLogoActivo
                    : arduinoLogoDesactivo
                }
                alt="Arduino"
              />
              <div>
                <h6>Arduino</h6>
                <span
                  className={`badge bg-${
                    data?.arduinoConectado ? 'success' : 'danger'
                  }`}
                >
                  {data?.arduinoConectado ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hardware;
