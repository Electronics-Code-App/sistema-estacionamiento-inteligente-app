package com.estacionamiento.controller;

import com.estacionamiento.entity.TipoVehiculo;
import com.estacionamiento.repository.TipoVehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos")
@CrossOrigin(origins = "*")
public class TipoVehiculoController {

    @Autowired
    private TipoVehiculoRepository tipoVehiculoRepository;

    @GetMapping
    public List<TipoVehiculo> listarTipos() {
        return tipoVehiculoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return tipoVehiculoRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Tipo de vehículo no encontrado"));
    }

    @PostMapping
    public ResponseEntity<?> crearTipo(@RequestBody TipoVehiculo tipoVehiculo) {
        try {
            TipoVehiculo nuevo = tipoVehiculoRepository.save(tipoVehiculo);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear tipo de vehículo: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTipo(@PathVariable Long id, @RequestBody TipoVehiculo tipoVehiculo) {
        return tipoVehiculoRepository.findById(id)
                .<ResponseEntity<?>>map(existing -> {
                    existing.setTipo(tipoVehiculo.getTipo());
                    tipoVehiculoRepository.save(existing);
                    return ResponseEntity.ok(existing);
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Tipo de vehículo no encontrado"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTipo(@PathVariable Long id) {
        if (!tipoVehiculoRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Tipo de vehículo no encontrado");
        }
        tipoVehiculoRepository.deleteById(id);
        return ResponseEntity.ok("Tipo de vehículo eliminado correctamente");
    }
}
