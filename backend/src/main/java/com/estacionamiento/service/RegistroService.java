package com.estacionamiento.service;

import com.estacionamiento.entity.*;
import com.estacionamiento.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RegistroService {

    @Autowired
    private RegistroIngresoRepository ingresoRepo;

    @Autowired
    private RegistroSalidaRepository salidaRepo;

    @Autowired
    private EspacioEstacionamientoRepository espacioRepo;

    @Autowired
    private EmpleadoRepository empleadoRepo;

    @Autowired
    private TipoVehiculoRepository tipoVehiculoRepo;

    @Transactional
    public RegistroIngreso registrarIngreso(RegistroIngreso ingreso) {
        Empleado empleado = empleadoRepo.findById(ingreso.getEmpleado().getId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        TipoVehiculo tipoVehiculo = tipoVehiculoRepo.findById(ingreso.getTipoVehiculo().getId())
                .orElseThrow(() -> new RuntimeException("Tipo de vehículo no encontrado"));

        EspacioEstacionamiento espacio = espacioRepo.findById(ingreso.getEspacio().getId())
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado"));

        espacio.setOcupado(true);
        espacioRepo.save(espacio);

        ingreso.setEmpleado(empleado);
        ingreso.setTipoVehiculo(tipoVehiculo);
        ingreso.setEspacio(espacio);
        ingreso.setFechaHoraIngreso(LocalDateTime.now());

        RegistroIngreso saved = ingresoRepo.save(ingreso);
        saved.setEspacio(espacio);
        return saved;
    }

    @Transactional
    public RegistroSalida registrarSalida(RegistroSalida salida) {
        EspacioEstacionamiento espacio = espacioRepo.findById(salida.getEspacio().getId())
                .orElseThrow(() -> new RuntimeException("Espacio no encontrado"));

        espacio.setOcupado(false);
        espacioRepo.save(espacio);

        salida.setEspacio(espacio);
        salida.setFechaHoraSalida(LocalDateTime.now());

        RegistroSalida saved = salidaRepo.save(salida);
        saved.setEspacio(espacio);
        return saved;
    }
}
