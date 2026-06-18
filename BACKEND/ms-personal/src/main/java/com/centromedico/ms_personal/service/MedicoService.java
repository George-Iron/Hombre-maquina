package com.centromedico.ms_personal.service;
import com.centromedico.ms_personal.entity.Empleado;
import com.centromedico.ms_personal.entity.Medico;
import com.centromedico.ms_personal.repository.EmpleadoRepository;
import com.centromedico.ms_personal.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicoService {
    @Autowired
    MedicoRepository repository_medico;
    @Autowired
    EmpleadoRepository repository_empleado;
    public List<Medico> listarMedico(){
        return repository_medico.findAll();
    }
    public Medico crearMedico(Long idEmpleado,Medico  medico){
        Empleado empleado = repository_empleado.findById(idEmpleado)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        medico.setEmpleado(empleado);
        return repository_medico.save(medico);
    }
    public Medico agregarMedico(Medico  medico){
        Long idEmpleado = medico.getEmpleado().getIdEmpleado();
        Empleado empleado = repository_empleado.findById(idEmpleado)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        medico.setEmpleado(empleado);
        return repository_medico.save(medico);
    }
}
