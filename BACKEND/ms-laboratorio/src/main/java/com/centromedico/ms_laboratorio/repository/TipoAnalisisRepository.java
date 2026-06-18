package com.centromedico.ms_laboratorio.repository;

import com.centromedico.ms_laboratorio.entity.TipoAnalisis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoAnalisisRepository extends JpaRepository<TipoAnalisis, Long> {
}
