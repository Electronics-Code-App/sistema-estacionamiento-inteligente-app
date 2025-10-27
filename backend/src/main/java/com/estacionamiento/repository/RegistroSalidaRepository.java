package com.estacionamiento.repository;

import com.estacionamiento.entity.RegistroSalida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface RegistroSalidaRepository extends JpaRepository<RegistroSalida, Long> { }
