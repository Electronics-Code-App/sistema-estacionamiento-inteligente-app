import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaMicrochip, FaClipboardList, FaChartBar } from "react-icons/fa";
import { Hardware, Registro, Dashboard } from "./components";
import "./App.css";

// Importa Bootstrap JS y CSS (asegura funcionalidad del menú)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* NAVBAR */}
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3 custom-navbar">
          <div className="container-fluid px-4">
            <NavLink className="navbar-brand fw-bold fs-5" to="/">
              Sistema de Estacionamiento Inteligente Básico
            </NavLink>

            {/* Botón hamburguesa */}
            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#menuNav"
              aria-controls="menuNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Menú */}
            <div className="collapse navbar-collapse mt-3 mt-lg-0" id="menuNav">
              <ul className="navbar-nav ms-auto gap-2 gap-lg-3">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link fw-semibold d-flex align-items-center gap-1 ${isActive ? "active-link" : ""}`
                    }
                    to="/hardware"
                  >
                    <FaMicrochip size={16} />
                    Hardware
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link fw-semibold d-flex align-items-center gap-1 ${isActive ? "active-link" : ""}`
                    }
                    to="/registro"
                  >
                    <FaClipboardList size={16} />
                    Registro
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link fw-semibold d-flex align-items-center gap-1 ${isActive ? "active-link" : ""}`
                    }
                    to="/dashboard"
                  >
                    <FaChartBar size={16} />
                    Dashboard
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* CONTENIDO */}
        <main className="py-4 fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hardware" element={<Hardware />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
