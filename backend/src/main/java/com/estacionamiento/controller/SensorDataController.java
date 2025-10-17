package com.estacionamiento.controller;

import com.estacionamiento.dto.DashboardStatusDTO;
import com.estacionamiento.dto.SensorDataDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SensorDataController {

    private int ultimaDistancia = 0;
    private int ultimaPosicionServo = 0;
    private boolean vehiculoDetectado = false;
    private boolean solicitudSalida = false;

    @PostMapping("/sensor-data")
    public void recibirDato(@RequestBody SensorDataDTO data) {
        String dato = data.getDato();
        System.out.println("Dato recibido del Arduino: " + dato);

        if (dato.startsWith("DISTANCIA:")) {
            try {
                ultimaDistancia = Integer.parseInt(dato.split(":")[1]);
                vehiculoDetectado = ultimaDistancia < 15;
            } catch (Exception e) {
                System.err.println("Error parseando distancia: " + e.getMessage());
            }
        }

        if (dato.startsWith("SERVO:")) {
            try {
                ultimaPosicionServo = Integer.parseInt(dato.split(":")[1]);
            } catch (Exception e) {
                System.err.println("Error parseando servo: " + e.getMessage());
            }
        }

        if (dato.equalsIgnoreCase("SOLICITUD_SALIDA")) {
            solicitudSalida = true;
        } else if (dato.equalsIgnoreCase("SALIDA_REGISTRADA")) {
            solicitudSalida = false;
        }
    }

    @GetMapping("/dashboard-status")
    public DashboardStatusDTO getDashboardStatus() {
        DashboardStatusDTO dto = new DashboardStatusDTO();

        dto.setArduinoConectado(true);
        dto.setDistancia(ultimaDistancia);
        dto.setPosicionServo(ultimaPosicionServo);
        dto.setVehiculoDetectado(vehiculoDetectado);
        dto.setSolicitudSalida(solicitudSalida);

        return dto;
    }
}
