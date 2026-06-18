package com.centromedico.ms_personal.repository;
import com.centromedico.ms_personal.entity.Empleado;
import com.centromedico.ms_personal.entity.Medico;
import com.centromedico.ms_personal.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
    Optional<Medico> findByEmpleado_Dni(String dni);
    List<Medico> findByEmpleado_Rol(Rol rol);
}
