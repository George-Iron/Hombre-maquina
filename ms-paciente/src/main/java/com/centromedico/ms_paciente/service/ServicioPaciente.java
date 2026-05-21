package com.centromedico.ms_paciente.service;
import com.centromedico.ms_paciente.entity.Paciente;
import com.centromedico.ms_paciente.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioPaciente {

    @Autowired
    private PacienteRepository pacienteRepository;

    public List<Paciente> listar(){
        return pacienteRepository.findAll();
    }
    public Optional<Paciente> buscarPorDni(String dni){
        return pacienteRepository.findByDocumento(dni);
    }
    public Optional<Paciente> buscarPorId(Long id){
        return pacienteRepository.findById(id);
    }

    public Paciente registrar(Paciente paciente){
        return pacienteRepository.save(paciente);
    }

    public Paciente actualizar(Long id, Paciente nuevosDatos) {
        return pacienteRepository.findById(id).map(p -> {
            p.setNombre(nuevosDatos.getNombre());
            p.setApellido(nuevosDatos.getApellido());
            p.setDocumento(nuevosDatos.getDocumento());
            p.setTelefono(nuevosDatos.getTelefono());
            p.setFechaNac(nuevosDatos.getFechaNac());
            return pacienteRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
    }

    public void eliminar(Long id) {
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("No se puede eliminar: Paciente no existe");
        }
    }
}
