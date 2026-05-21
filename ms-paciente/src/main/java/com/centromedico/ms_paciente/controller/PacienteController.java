package com.centromedico.ms_paciente.controller;
import com.centromedico.ms_paciente.entity.Paciente;
import com.centromedico.ms_paciente.service.ServicioPaciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/paciente") //ruta base para este microservicio
public class PacienteController implements ApiPaciente {

    @Autowired
    private ServicioPaciente servicioPaciente;

    @Override
    public ResponseEntity<List<Paciente>> listarPacientes(){
        return ResponseEntity.ok(servicioPaciente.listar());
    }

    @Override
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Long id){
        return servicioPaciente.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Paciente> buscarPacientePorDni(@PathVariable String dni){
        return servicioPaciente.buscarPorDni(dni)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente paciente){
        return ResponseEntity.ok(servicioPaciente.registrar(paciente));
    }

    @Override
    public ResponseEntity<Paciente> actualizarPaciente(Long id, Paciente paciente) {
        return ResponseEntity.ok(servicioPaciente.actualizar(id, paciente));
    }

    @Override
    public ResponseEntity<Void> eliminarPaciente(Long id) {
        servicioPaciente.eliminar(id);
        return ResponseEntity.ok().build();
    }



}
