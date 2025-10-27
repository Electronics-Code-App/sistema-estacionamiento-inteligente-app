import { useState } from "react";
import { FaCarAlt, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import "./Registro.css";

export default function Registro() {
  const [ingresos, setIngresos] = useState(0);
  const [salidas, setSalidas] = useState(0);

  return (
    <div className="registro-container">
      <h3 className="registro-title">
        <FaCarAlt className="me-2" />
        Control de Ingreso y Salida
      </h3>

      <div className="registro-buttons">
        <button
          className="btn-ingreso"
          onClick={() => setIngresos(ingresos + 1)}
        >
          <FaSignInAlt size={20} className="me-2" /> Ingreso
        </button>

        <button
          className="btn-salida"
          onClick={() => setSalidas(salidas + 1)}
        >
          <FaSignOutAlt size={20} className="me-2" /> Salida
        </button>
      </div>

      <div className="registro-stats">
        <div className="registro-card ingreso-card">
          <h5>Ingresos</h5>
          <p>{ingresos}</p>
        </div>

        <div className="registro-card salida-card">
          <h5>Salidas</h5>
          <p>{salidas}</p>
        </div>
      </div>
    </div>
  );
}
