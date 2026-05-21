package com.centromedico.ms_personal.repository;
import com.centromedico.ms_personal.entity.Empleado;
import com.centromedico.ms_personal.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    Optional<Empleado> findByDni(String dni);
    List<Empleado> findByRol(Rol rol);

    //para mi login
    //Optional<Empleado> findByDniAndContraseña(String dni, String contraseña);

}
