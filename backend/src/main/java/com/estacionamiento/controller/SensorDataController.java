package com.estacionamiento.controller;

import com.estacionamiento.dto.SensorDataDTO;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class SensorDataController {

    private String ultimoDato = "";

    @PostMapping("/sensor-data")
    public void recibirDato(@RequestBody SensorDataDTO data) {
        System.out.println("Dato recibido del Arduino: " + data.getDato());
        ultimoDato = data.getDato();
    }

    @GetMapping("/sensor-data")
    public SensorDataDTO obtenerDato() {
        SensorDataDTO dto = new SensorDataDTO();
        dto.setDato(ultimoDato);
        return dto;
    }
}
