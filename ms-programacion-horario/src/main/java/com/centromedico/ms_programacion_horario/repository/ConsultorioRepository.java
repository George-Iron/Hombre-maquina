package com.centromedico.ms_programacion_horario.repository;

import com.centromedico.ms_programacion_horario.entity.Consultorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultorioRepository extends JpaRepository<Consultorio, Long> {

}
