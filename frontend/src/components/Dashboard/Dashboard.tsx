import { useEffect, useState } from "react";
import { FaChartPie } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from "axios";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface DiaRegistro {
  day: string;
  ingresos: number;
  salidas: number;
}

export default function Dashboard() {
  const [chartData, setChartData] = useState<DiaRegistro[]>([]);
  const [capacidad] = useState(3);
  const [vehiculosDentro, setVehiculosDentro] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingresosRes, salidasRes] = await Promise.all([
          axios.get(`${API_URL}/api/registro/ingresos`),
          axios.get(`${API_URL}/api/registro/salidas`),
        ]);

        const ingresos = ingresosRes.data;
        const salidas = salidasRes.data;

        setVehiculosDentro(ingresos.length - salidas.length);

        const formatDate = (d: string) =>
          new Date(d).toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "2-digit",
          });

        const grouped: Record<string, DiaRegistro> = {};

        ingresos.forEach((i: any) => {
          const day = formatDate(i.fechaHoraIngreso);
          if (!grouped[day]) grouped[day] = { day, ingresos: 0, salidas: 0 };
          grouped[day].ingresos++;
        });

        salidas.forEach((s: any) => {
          const day = formatDate(s.fechaHoraSalida);
          if (!grouped[day]) grouped[day] = { day, ingresos: 0, salidas: 0 };
          grouped[day].salidas++;
        });

        const sortedData = Object.values(grouped).sort(
          (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
        );

        setChartData(sortedData.slice(-7));
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
      }
    };

    fetchData();
  }, []);

  const pastelData = [
    { name: "Ocupados", value: vehiculosDentro },
    { name: "Disponibles", value: capacidad - vehiculosDentro },
  ];

  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">
        <FaChartPie className="me-2" />
        Dashboard General
      </h3>

      <div className="dashboard-grid">
        {/* ====== GRAFICO DE BARRAS ====== */}
        <div className="dashboard-chart">
          <h5>Ingresos vs Salidas (Últimos 7 días)</h5>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" fill="#2496d3" name="Ingresos" />
                <Bar dataKey="salidas" fill="#9a45c6" name="Salidas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">
              No hay datos disponibles en los últimos 7 días
            </p>
          )}
        </div>

        {/* ====== GRAFICO PASTEL ====== */}
        <div className="dashboard-card pastel-card">
          <h5>Capacidad del Estacionamiento</h5>
          <p className="pastel-subtitle">
            Ocupación actual:{" "}
            <strong>
              {((vehiculosDentro / capacidad) * 100).toFixed(0)}%
            </strong>
          </p>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pastelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pastelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Ocupados" ? "#662781" : "#40b2f5"}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
