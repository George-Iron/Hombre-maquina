package com.centromedico.ms_paciente.repository;
import com.centromedico.ms_paciente.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByDocumento(String documento);
}
