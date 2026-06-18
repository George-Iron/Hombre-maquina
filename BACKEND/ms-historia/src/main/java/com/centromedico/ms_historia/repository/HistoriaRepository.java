package com.centromedico.ms_historia.repository;

import com.centromedico.ms_historia.entity.Historia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistoriaRepository extends JpaRepository<Historia, Long> {

    Optional<Historia> findByIdPaciente(Long idPaciente);

}
