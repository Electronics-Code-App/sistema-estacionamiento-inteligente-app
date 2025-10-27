package com.estacionamiento.controller;

import com.estacionamiento.entity.EspacioEstacionamiento;
import com.estacionamiento.repository.EspacioEstacionamientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/espacios")
@CrossOrigin(origins = "*")
public class EspacioEstacionamientoController {

    @Autowired
    private EspacioEstacionamientoRepository espacioRepo;

    @GetMapping
    public List<EspacioEstacionamiento> listarEspacios() {
        return espacioRepo.findAll();
    }
}
