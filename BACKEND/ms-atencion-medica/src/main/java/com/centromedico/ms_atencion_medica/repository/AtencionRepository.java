package com.centromedico.ms_atencion_medica.repository;

import com.centromedico.ms_atencion_medica.entity.AtencionMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AtencionRepository extends JpaRepository<AtencionMedica, Long> {

    List<AtencionMedica> findByIdPaciente(Long idPaciente);
}
