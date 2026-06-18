package com.centromedico.ms_receta.repository;

import com.centromedico.ms_receta.entity.Receta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecetaRepository extends JpaRepository<Receta, Long> {}
