package com.centromedico.ms_detalle_farmacia.repository;

import com.centromedico.ms_detalle_farmacia.entity.DetalleFarmacia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleFarmaciaRepository extends JpaRepository<DetalleFarmacia, Long> {
    List<DetalleFarmacia> findByIdReceta(Long idReceta);
}
