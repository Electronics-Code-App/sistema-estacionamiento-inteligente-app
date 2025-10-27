package com.estacionamiento.controller;

import com.estacionamiento.dto.SensorDataDTO;
import com.estacionamiento.hardware.SerialCommandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sensor-data")
@CrossOrigin(origins = "*")
public class SensorDataController {

    private final SerialCommandService serialCommandService;

    public SensorDataController(SerialCommandService serialCommandService) {
        this.serialCommandService = serialCommandService;
    }

    @PostMapping
    public ResponseEntity<String> recibirDato(@RequestBody SensorDataDTO data) {
        String dato = data.getDato().trim();
        System.out.println("Dato recibido desde Arduino: " + dato);
        serialCommandService.actualizarDato(dato);
        return ResponseEntity.ok("Dato procesado correctamente");
    }

    @GetMapping("/estado")
    public ResponseEntity<?> obtenerEstado() {
        return ResponseEntity.ok(serialCommandService.obtenerEstadoActual());
    }

    @PostMapping("/autorizar-ingreso")
    public ResponseEntity<String> autorizarIngreso() {
        System.out.println("Autorizando ingreso...");
        serialCommandService.enviarComandoAlArduino("AUTORIZADO");
        serialCommandService.abrirYcerrarPluma();
        return ResponseEntity.ok("Ingreso autorizado y pluma operada correctamente");
    }

    @PostMapping("/confirmar-salida")
    public ResponseEntity<String> confirmarSalida() {
        System.out.println("Confirmando salida...");
        serialCommandService.enviarComandoAlArduino("SALIDA_CONFIRMADA");
        serialCommandService.abrirYcerrarPluma();
        return ResponseEntity.ok("Salida confirmada correctamente");
    }

    @PostMapping("/comando")
    public ResponseEntity<String> enviarComando(@RequestParam String comando) {
        if (comando.equalsIgnoreCase("ABRIR_CERRAR")) {
            serialCommandService.abrirYcerrarPluma();
            return ResponseEntity.ok("Servo abierto y cerrado automáticamente");
        }
        serialCommandService.enviarComandoAlArduino(comando);
        return ResponseEntity.ok("Comando enviado: " + comando);
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetEstados() {
        serialCommandService.resetEstados();
        return ResponseEntity.ok("Estados del hardware reiniciados");
    }
}
