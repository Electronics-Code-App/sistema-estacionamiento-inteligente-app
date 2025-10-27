import { useEffect, useState } from "react";
import axios from "axios";
import { FaCarAlt, FaSignInAlt, FaSignOutAlt, FaSquare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Registro.css";

interface RegistroData {
  tipo: "INGRESO" | "SALIDA";
  placa: string;
  tipoVehiculo: string;
  espacio: string;
  fecha: string;
  hora: string;
}

interface Espacio {
  id: number;
  codigo: string;
  ocupado: boolean;
}

interface TipoVehiculo {
  id: number;
  tipo: string;
}

interface RegistroIngresoDB {
  id: number;
  placa: string;
  tipoVehiculo: { id: number; tipo: string };
  espacio: { id: number; codigo: string };
  fechaHoraIngreso: string;
}

export default function Registro() {
  const [showForm, setShowForm] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<"INGRESO" | "SALIDA" | null>(null);
  const [formData, setFormData] = useState({ placa: "", tipoVehiculoId: "", espacio: "" });

  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([]);
  const [registros, setRegistros] = useState<RegistroData[]>([]);
  const [registrosIngreso, setRegistrosIngreso] = useState<RegistroIngresoDB[]>([]);
  const [vehiculosDentro, setVehiculosDentro] = useState<RegistroIngresoDB[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const loadData = async () => {
    try {
      const [espaciosRes, tiposRes, ingRes, salRes] = await Promise.all([
        axios.get(`${API_URL}/api/espacios`),
        axios.get(`${API_URL}/api/tipos`),
        axios.get(`${API_URL}/api/registro/ingresos`),
        axios.get(`${API_URL}/api/registro/salidas`),
      ]);

      setEspacios(espaciosRes.data);
      setTiposVehiculo(tiposRes.data);
      setRegistrosIngreso(ingRes.data);

      const placasSalidas = new Set(
        salRes.data.map((r: any) => r.registroIngreso?.placa || r.placa)
      );
      const dentro = ingRes.data.filter((r: any) => !placasSalidas.has(r.placa));
      setVehiculosDentro(dentro);

      const ingresos = ingRes.data.map((r: any) => ({
        tipo: "INGRESO" as const,
        placa: r.placa,
        tipoVehiculo: r.tipoVehiculo?.tipo || "Desconocido",
        espacio: r.espacio?.codigo || "-",
        fecha: r.fechaHoraIngreso
          ? new Date(r.fechaHoraIngreso).toLocaleDateString("es-EC")
          : "-",
        hora: r.fechaHoraIngreso
          ? new Date(r.fechaHoraIngreso).toLocaleTimeString("es-EC")
          : "-",
      }));

      const salidas = salRes.data.map((r: any) => ({
        tipo: "SALIDA" as const,
        placa: r.registroIngreso?.placa || r.placa || "-",
        tipoVehiculo: r.tipoVehiculo?.tipo || "-",
        espacio: r.espacio?.codigo || "-",
        fecha: r.fechaHoraSalida
          ? new Date(r.fechaHoraSalida).toLocaleDateString("es-EC")
          : "-",
        hora: r.fechaHoraSalida
          ? new Date(r.fechaHoraSalida).toLocaleTimeString("es-EC")
          : "-",
      }));

      const todos = [...ingresos, ...salidas].sort((a, b) => {
        const fechaA = new Date(`${a.fecha} ${a.hora}`).getTime();
        const fechaB = new Date(`${b.fecha} ${b.hora}`).getTime();
        return fechaB - fechaA;
      });

      setRegistros(todos);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar los datos del sistema");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenForm = (tipo: "INGRESO" | "SALIDA") => {
    setTipoRegistro(tipo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTipoRegistro(null);
    setFormData({ placa: "", tipoVehiculoId: "", espacio: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (tipoRegistro === "SALIDA" && name === "placa") {
      const reg = registrosIngreso.find((r) => r.placa === value);
      if (reg) {
        setFormData({
          placa: reg.placa,
          tipoVehiculoId: String(reg.tipoVehiculo.id),
          espacio: String(reg.espacio.id),
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoRegistro) return;

    const endpoint =
      tipoRegistro === "INGRESO"
        ? `${API_URL}/api/registro/ingreso`
        : `${API_URL}/api/registro/salida`;

    const payload =
      tipoRegistro === "INGRESO"
        ? {
            placa: formData.placa,
            fechaHoraIngreso: new Date().toISOString(),
            empleado: { id: 1 },
            tipoVehiculo: { id: Number(formData.tipoVehiculoId) },
            espacio: { id: Number(formData.espacio) },
          }
        : {
            placa: formData.placa,
            fechaHoraSalida: new Date().toISOString(),
            empleado: { id: 1 },
            tipoVehiculo: { id: Number(formData.tipoVehiculoId) },
            espacio: { id: Number(formData.espacio) },
          };

    try {
      await axios.post(endpoint, payload);
      toast.success(`Registro de ${tipoRegistro.toLowerCase()} guardado`);

      await loadData();

      handleCloseForm();
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar en la base de datos");
    }
  };

  return (
    <div className="registro-container">
      <h3 className="registro-title">
        <FaCarAlt className="me-2" />
        Control de Ingreso y Salida
      </h3>

      {/* MAPA */}
      <div className="mapa-estacionamiento">
        <div className="espacios-grid">
          {espacios.map((esp) => (
            <div
              key={esp.id}
              className={`espacio ${esp.ocupado ? "ocupado" : "disponible"}`}
            >
              {esp.codigo || esp.id}
            </div>
          ))}
        </div>

        <div className="leyenda">
          <span>
            <FaSquare className="icono-disponible" /> Disponible
          </span>
          <span>
            <FaSquare className="icono-ocupado" /> Ocupado
          </span>
        </div>
      </div>

      {/* BOTONES */}
      <div className="registro-buttons-right">
        <button className="btn-icon" onClick={() => handleOpenForm("INGRESO")}>
          <FaSignInAlt size={20} className="me-2" /> Ingreso
        </button>
        <button className="btn-icon" onClick={() => handleOpenForm("SALIDA")}>
          <FaSignOutAlt size={20} className="me-2" /> Salida
        </button>
      </div>

      {/* TABLA */}
      <div className="tabla-registros">
        {registros.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Placa</th>
                <th>Vehículo</th>
                <th>Espacio</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, index) => (
                <tr key={index}>
                  <td className={r.tipo === "INGRESO" ? "text-ingreso" : "text-salida"}>
                    {r.tipo}
                  </td>
                  <td>{r.placa}</td>
                  <td>{r.tipoVehiculo}</td>
                  <td>{r.espacio}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No hay registros aún</p>
        )}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>
              {tipoRegistro === "INGRESO"
                ? "Registrar Ingreso"
                : "Registrar Salida"}
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Placa del vehículo</label>
                {tipoRegistro === "SALIDA" ? (
                  <select
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una placa</option>
                    {vehiculosDentro.map((r) => (
                      <option key={r.id} value={r.placa}>
                        {r.placa}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="placa"
                    placeholder="Ingrese la placa del vehículo"
                    value={formData.placa}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label>Tipo de vehículo</label>
                <select
                  name="tipoVehiculoId"
                  value={formData.tipoVehiculoId}
                  onChange={handleChange}
                  disabled={tipoRegistro === "SALIDA"}
                  required
                >
                  <option value="">Seleccione un tipo de vehículo</option>
                  {tiposVehiculo.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Espacio asignado</label>
                <select
                  name="espacio"
                  value={formData.espacio}
                  onChange={handleChange}
                  required
                  disabled={tipoRegistro === "SALIDA"}
                >
                  <option value="">Seleccione un espacio</option>
                  {espacios.map((esp) => (
                    <option
                      key={esp.id}
                      value={esp.id}
                      disabled={tipoRegistro === "INGRESO" && esp.ocupado}
                    >
                      {`${esp.codigo || esp.id} ${
                        esp.ocupado ? "(Ocupado)" : ""
                      }`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleCloseForm}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-registrar">
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
