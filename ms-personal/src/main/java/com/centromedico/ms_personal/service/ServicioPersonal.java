package com.centromedico.ms_personal.service;

import com.centromedico.ms_personal.dto.LoginDTO;
import com.centromedico.ms_personal.entity.Empleado;
import com.centromedico.ms_personal.entity.Rol;
import com.centromedico.ms_personal.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioPersonal {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    public Empleado crearEmpleado(Empleado empleado){
        //esto es para encriptar pero no se porque me sale error   empleado.setContraseña(passwordEncoder.encode(empleado.getContraseña()));
        return empleadoRepository.save(empleado);
    }

    public Optional<Empleado> buscarEmpleadoPorDni(String dni){
        return empleadoRepository.findByDni(dni);
    }

    public List<Empleado> listarPorRol(Rol rol){
        return empleadoRepository.findByRol(rol);
    }

    public Optional<Empleado> actualizarEmpleado(Long id, Empleado empleadoActualizado){
        return empleadoRepository.findById(id).map(empleadoExistente -> {
            empleadoExistente.setNombre(empleadoActualizado.getNombre());
            empleadoExistente.setApellido(empleadoActualizado.getApellido());
            empleadoExistente.setDni(empleadoActualizado.getDni());
            empleadoExistente.setRol(empleadoActualizado.getRol());
            empleadoExistente.setEspecialidad(empleadoActualizado.getEspecialidad());

            return empleadoRepository.save(empleadoExistente);
        });
    }

    public boolean eliminarEmpleado(Long id){
        if (empleadoRepository.existsById(id)){
            empleadoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Empleado> login(LoginDTO loginDTO){
        return empleadoRepository.findByDniAndContraseña(loginDTO.getDni(), loginDTO.getContraseña());
    }

    public Optional<Empleado> buscarEmpleadoPorId(Long id) {
        return empleadoRepository.findById(id);
    }

}
