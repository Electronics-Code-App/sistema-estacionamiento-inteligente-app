package com.estacionamiento.controller;

import com.estacionamiento.dto.SensorDataDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SensorDataController {

    @PostMapping("/sensor-data")
    public void recibirDato(@RequestBody SensorDataDTO data) {
        System.out.println("Dato recibido del Arduino: " + data.getDato());
    }
}
