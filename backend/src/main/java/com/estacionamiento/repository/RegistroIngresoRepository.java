package com.estacionamiento.repository;

import com.estacionamiento.entity.RegistroIngreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface RegistroIngresoRepository extends JpaRepository<RegistroIngreso, Long> { }
