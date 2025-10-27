package com.estacionamiento.controller;

import com.estacionamiento.entity.RegistroIngreso;
import com.estacionamiento.entity.RegistroSalida;
import com.estacionamiento.repository.RegistroIngresoRepository;
import com.estacionamiento.repository.RegistroSalidaRepository;
import com.estacionamiento.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registro")
@CrossOrigin(origins = "*")
public class RegistroController {

    @Autowired
    private RegistroIngresoRepository ingresoRepo;

    @Autowired
    private RegistroSalidaRepository salidaRepo;

    @GetMapping("/ingresos")
    public List<RegistroIngreso> listarIngresos() {
        return ingresoRepo.findAll();
    }

    @GetMapping("/salidas")
    public List<RegistroSalida> listarSalidas() {
        return salidaRepo.findAll();
    }

    @Autowired
    private RegistroService registroService;

    @PostMapping("/ingreso")
    public ResponseEntity<?> registrarIngreso(@RequestBody RegistroIngreso ingreso) {
        try {
            RegistroIngreso saved = registroService.registrarIngreso(ingreso);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar ingreso: " + e.getMessage());
        }
    }

    @PostMapping("/salida")
    public ResponseEntity<?> registrarSalida(@RequestBody RegistroSalida salida) {
        try {
            RegistroSalida saved = registroService.registrarSalida(salida);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar salida: " + e.getMessage());
        }
    }
}
