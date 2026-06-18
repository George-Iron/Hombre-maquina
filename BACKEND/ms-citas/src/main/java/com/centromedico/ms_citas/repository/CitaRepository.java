package com.centromedico.ms_citas.repository;

import com.centromedico.ms_citas.entity.CitaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<CitaMedica, Long> {

    List<CitaMedica> findByIdPaciente(Long idPaciente);

    List<CitaMedica> findByFechaCita(LocalDate fechaCita);

    List<CitaMedica> findByEstado(String estado);

}
