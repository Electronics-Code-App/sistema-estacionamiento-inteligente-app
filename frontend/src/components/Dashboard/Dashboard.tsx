import { FaChartPie, FaCarAlt } from "react-icons/fa";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">
        <FaChartPie className="me-2" />
        Dashboard General
      </h3>

      <div className="dashboard-card vehiculos-card">
        <FaCarAlt className="dashboard-icon" />
        <h5>Conteo Vehicular</h5>
        <p className="dashboard-number">12 vehículos</p>
        <span className="dashboard-sub">Dentro del estacionamiento</span>
      </div>
    </div>
  );
}
