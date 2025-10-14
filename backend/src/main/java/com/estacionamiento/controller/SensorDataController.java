package com.estacionamiento.controller;

import com.estacionamiento.dto.SensorDataDTO;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class SensorDataController {

    @GetMapping("/sensor-data")
    public Map<String, String> getSensorData() {
        Map<String, String> response = new HashMap<>();
        response.put("dato", "esperando..."); // Temporal hasta conectar Arduino
        return response;
    }

    @PostMapping("/sensor-data")
    public void recibirDato(@RequestBody SensorDataDTO data) {
        System.out.println("Dato recibido del Arduino: " + data.getDato());
    }
}
