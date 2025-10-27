package com.estacionamiento.repository;

import com.estacionamiento.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> { }
