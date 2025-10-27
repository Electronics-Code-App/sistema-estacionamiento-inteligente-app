package com.estacionamiento.controller;

import com.estacionamiento.entity.RegistroIngreso;
import com.estacionamiento.entity.RegistroSalida;
import com.estacionamiento.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registro")
@CrossOrigin(origins = "*")
public class RegistroController {

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
