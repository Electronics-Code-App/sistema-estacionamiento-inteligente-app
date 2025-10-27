import { useState } from "react";
import { FaCarAlt, FaSignInAlt, FaSignOutAlt, FaSquare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Registro.css";

interface RegistroData {
  tipo: "INGRESO" | "SALIDA";
  placa: string;
  tipoVehiculo: string;
  espacio: string;
  observacion: string;
  fecha: string;
  hora: string;
}

interface Espacio {
  id: number;
  ocupado: boolean;
}

export default function Registro() {
  const [showForm, setShowForm] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<"INGRESO" | "SALIDA" | null>(null);
  const [formData, setFormData] = useState({
    placa: "",
    tipoVehiculo: "Auto",
    espacio: "",
    observacion: "",
  });
  const [registros, setRegistros] = useState<RegistroData[]>([]);

  // Creamos espacios del 1 al 12
  const [espacios, setEspacios] = useState<Espacio[]>(
    Array.from({ length: 12 }, (_, i) => ({ id: i + 1, ocupado: false }))
  );

  const handleOpenForm = (tipo: "INGRESO" | "SALIDA") => {
    setTipoRegistro(tipo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTipoRegistro(null);
    setFormData({ placa: "", tipoVehiculo: "Auto", espacio: "", observacion: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ahora = new Date();

    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "America/Guayaquil",
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Guayaquil",
    };

    const fecha = ahora.toLocaleDateString("es-EC", opcionesFecha);
    const hora = ahora.toLocaleTimeString("es-EC", opcionesHora);

    const nuevoRegistro: RegistroData = {
      tipo: tipoRegistro!,
      ...formData,
      fecha,
      hora,
    };

    setRegistros((prev) => [nuevoRegistro, ...prev]);

    // Actualiza estado del espacio
    setEspacios((prev) =>
      prev.map((esp) =>
        esp.id === Number(formData.espacio)
          ? { ...esp, ocupado: tipoRegistro === "INGRESO" }
          : esp
      )
    );

    toast.success(`Registro de ${tipoRegistro?.toLowerCase()} guardado correctamente`);
    handleCloseForm();
  };

  return (
    <div className="registro-container">
      <h3 className="registro-title">
        <FaCarAlt className="me-2" />
        Control de Ingreso y Salida
      </h3>

      {/* ====== SECCIÓN 1: Mapa de estacionamiento ====== */}
      <div className="mapa-estacionamiento">
        <div className="espacios-grid">
          {espacios.map((esp) => (
            <div
              key={esp.id}
              className={`espacio ${esp.ocupado ? "ocupado" : "disponible"}`}
            >
              {esp.id}
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

      {/* ====== SECCIÓN 2: Botones + Tabla ====== */}
      <div className="registro-buttons-right">
        <button className="btn-icon" onClick={() => handleOpenForm("INGRESO")}>
          <FaSignInAlt size={20} className="me-2" /> Ingreso
        </button>
        <button className="btn-icon" onClick={() => handleOpenForm("SALIDA")}>
          <FaSignOutAlt size={20} className="me-2" /> Salida
        </button>
      </div>

      <div className="tabla-registros">
        {registros.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Placa</th>
                <th>Vehículo</th>
                <th>Espacio</th>
                <th>Observación</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, index) => (
                <tr key={index}>
                  <td className={r.tipo === "INGRESO" ? "text-ingreso" : "text-salida"}>{r.tipo}</td>
                  <td>{r.placa}</td>
                  <td>{r.tipoVehiculo}</td>
                  <td>{r.espacio}</td>
                  <td>{r.observacion || "-"}</td>
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

      {/* ====== MODAL ====== */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{tipoRegistro === "INGRESO" ? "Registrar Ingreso" : "Registrar Salida"}</h4>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Placa del vehículo</label>
                <input
                  type="text"
                  name="placa"
                  value={formData.placa}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de vehículo</label>
                <select
                  name="tipoVehiculo"
                  value={formData.tipoVehiculo}
                  onChange={handleChange}
                >
                  <option value="Auto">Auto</option>
                  <option value="Moto">Moto</option>
                  <option value="Camión">Camión</option>
                </select>
              </div>

              {/* Espacios disponibles */}
              <div className="form-group">
                <label>Espacio asignado</label>
                <select
                  name="espacio"
                  value={formData.espacio}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un espacio</option>
                  {espacios.map((esp) => (
                    <option
                      key={esp.id}
                      value={esp.id}
                      disabled={tipoRegistro === "INGRESO" && esp.ocupado}
                    >
                      {`Espacio ${esp.id} ${esp.ocupado ? "(Ocupado)" : ""}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  name="observacion"
                  value={formData.observacion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-buttons">
                <button type="button" className="btn-cancelar" onClick={handleCloseForm}>
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
