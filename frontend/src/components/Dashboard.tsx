import { useEffect, useState } from 'react';
import axios from 'axios';

import arduinoLogoActivo from '../assets/arduino-logo-activo.png';
import arduinoLogoDesactivo from '../assets/arduino-logo-desactivo.png';
import servomotorLogo from '../assets/servo-motor-logo.png';
import ultrasonidoLogo from '../assets/ultrasonido-logo.png';
import circuitoImg from '../assets/circuito.png';

type DashboardData = {
  arduinoConectado: boolean;
  posicionServo: number;
  distancia: number;
  vehiculoDetectado: boolean;
  solicitudSalida: boolean;
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [ingresos, setIngresos] = useState(0);
  const [salidas, setSalidas] = useState(0);
  const apiBase = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/dashboard-status`);
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

  const componenteCardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#F4F5F6',
    borderRadius: '6px',
    minWidth: '220px',
    flex: 1,
    maxHeight: '100px',
  };

  const imageStyle = {
    height: '60px',
    width: '60px',
    marginRight: '1rem',
    objectFit: 'contain' as const,
  };

  const fondoFormulario = '#2496D3';

  const handleIngreso = () => setIngresos((prev) => prev + 1);
  const handleSalida = () => setSalidas((prev) => prev + 1);

  return (
    <div className="container mt-3">
      <h2 className="mb-4 text-center">Sistema de Estacionamiento Básico</h2>

      {/* === PRIMERA FILA === */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {/* BOM */}
        <div
          style={{
            gridColumn: 'span 3',
            backgroundColor: '#6f42c1',
            color: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h6 className="card-title text-center mb-3" style={{ fontWeight: '700', fontSize: '1.2rem' }}>
            BOM
          </h6>
          <ul
            style={{
              listStyle: 'none',
              paddingLeft: 0,
              fontSize: '0.9rem',
              lineHeight: '1.6',
              marginBottom: 0,
            }}
          >
            {[
              'Arduino Uno',
              'Sensor ultrasónico HC-SR04',
              'Servomotor SG90',
              'Protoboard',
              'Resistencias',
              'Cables jumper',
            ].map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.3rem 0',
                  borderBottom: idx !== 5 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="white"
                  className="bi bi-check-circle-fill me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08.022l3.992-4.99a.75.75 0 1 0-1.14-.976L7.477 9.417 5.383 7.323a.75.75 0 0 0-1.06 1.06l2.647 2.647z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Componentes */}
        <div
          style={{
            gridColumn: 'span 6',
            backgroundColor: '#662781',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <h5 className="text-white w-100 text-center mb-1">Componentes</h5>

          {/* Servo */}
          <div style={componenteCardStyle}>
            <img src={servomotorLogo} alt="Servo" style={imageStyle} />
            <div>
              <h6 style={{ marginBottom: '0.4rem' }}>Servo</h6>
              <p style={{ margin: 0 }}>Ángulo: {data?.posicionServo}°</p>
              <span
                className={`badge bg-${
                  data?.posicionServo !== undefined && data.posicionServo < 45 ? 'success' : 'danger'
                }`}
              >
                {estadoServo(data?.posicionServo)}
              </span>
            </div>
          </div>

          {/* Ultrasonido */}
          <div style={componenteCardStyle}>
            <img src={ultrasonidoLogo} alt="Ultrasonido" style={imageStyle} />
            <div>
              <h6 style={{ marginBottom: '0.4rem' }}>Ultrasónico</h6>
              <p style={{ margin: 0 }}>Distancia: {data?.distancia} cm</p>
              <span className={`badge bg-${data && data.distancia < 15 ? 'danger' : 'success'}`}>
                {estadoUltrasonido(data?.distancia)}
              </span>
            </div>
          </div>

          {/* Arduino */}
          <div style={componenteCardStyle}>
            <img
              src={data?.arduinoConectado ? arduinoLogoActivo : arduinoLogoDesactivo}
              alt="Arduino"
              style={imageStyle}
            />
            <div>
              <h6 style={{ marginBottom: '0.4rem' }}>Arduino</h6>
              <span className={`badge bg-${data?.arduinoConectado ? 'success' : 'danger'}`}>
                {data?.arduinoConectado ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>

        {/* Diseño Circuito */}
        <div
          style={{
            gridColumn: 'span 3',
          }}
        >
          <a
            href="https://www.tinkercad.com/things/kwR2zGe0yov-estacionamiento-inteligente?sharecode=MhOq3CV3NacPbdOVzoAErWmqFPQFw0NGMW_xglxIiXg"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
                className="card h-100"
                style={{
                    backgroundColor: '#F4F5F6',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    borderColor: '#F4F5F6',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    padding: '1rem',
                }}
                >
                <h5 className="card-title text-center mb-3" style={{ flexShrink: 0 }}>
                    Diseño Circuito
                </h5>

                <div
                    style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    height: '160px',
                    }}
                >
                    <img
                    src={circuitoImg}
                    alt="Circuito en Tinkercad"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                </div>

                <div style={{ textAlign: 'center' }}>Ver diagrama</div>
                </div>

          </a>
        </div>
      </div>

      {/* === SEGUNDA FILA === */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '9fr 3fr',
          gap: '1rem',
        }}
      >
        {/* Control Ingreso y Salida */}
        <div
          style={{
            backgroundColor: fondoFormulario,
            padding: '1rem',
            borderRadius: '8px',
            color: 'white',
          }}
        >
          <h5 className="mb-3 text-center">Control de Ingreso y Salida</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {/* Ingreso */}
            <div
              className="card"
              style={{
                borderColor: fondoFormulario,
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            >
              <div className="card-body">
                <h5>Ingreso</h5>
                <p>
                  {data?.distancia !== undefined && data.distancia < 15
                    ? 'Solicitud de ingreso detectada'
                    : 'Esperando...'}
                </p>
                <button
                  disabled={!(data?.distancia !== undefined && data.distancia < 15)}
                  className="btn btn-primary"
                  onClick={handleIngreso}
                >
                  Llenar formulario
                </button>
              </div>
            </div>

            {/* Salida */}
            <div
              className="card"
              style={{
                borderColor: fondoFormulario,
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            >
              <div className="card-body">
                <h5>Salida</h5>
                <p>{data?.solicitudSalida ? 'Solicitud de salida detectada' : 'Esperando...'}</p>
                <button
                  disabled={!data?.solicitudSalida}
                  className="btn btn-primary"
                  onClick={handleSalida}
                >
                  Llenar formulario
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conteo Vehicular */}
        <div
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <h5 className="mb-3 text-center">Conteo Vehicular</h5>
          <div style={{ fontSize: '1.1rem' }}>
            <div>
              <strong>Ingresos:</strong>
            </div>
            <div style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700' }}>{ingresos}</div>
            <div>
              <strong>Salidas:</strong>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{salidas}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
