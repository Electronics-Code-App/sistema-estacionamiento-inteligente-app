package com.estacionamiento.repository;

import com.estacionamiento.entity.EspacioEstacionamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface EspacioEstacionamientoRepository extends JpaRepository<EspacioEstacionamiento, Long> {
}
