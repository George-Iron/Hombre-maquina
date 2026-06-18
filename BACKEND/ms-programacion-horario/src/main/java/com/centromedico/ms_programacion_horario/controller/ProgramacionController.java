package com.centromedico.ms_programacion_horario.controller;

import com.centromedico.ms_programacion_horario.entity.Consultorio;
import com.centromedico.ms_programacion_horario.entity.ProgramacionHorario;
import com.centromedico.ms_programacion_horario.service.ServicioProgramacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programacion")
public class ProgramacionController implements ApiProgramacion {

    @Autowired
    private ServicioProgramacion servicioProgramacion;

    @Override
    public ResponseEntity<Consultorio> registrarConsultorio(Consultorio consultorio) {
        return ResponseEntity.ok(servicioProgramacion.registrarConsultorio(consultorio));
    }

    @Override
    public ResponseEntity<List<Consultorio>> listarConsultorios() {
        return ResponseEntity.ok(servicioProgramacion.listarConsultorios());
    }

    @Override
    public ResponseEntity<ProgramacionHorario> registrarHorario(ProgramacionHorario horario) {
        return ResponseEntity.ok(servicioProgramacion.registrarHorario(horario));
    }

    @Override
    public ResponseEntity<List<ProgramacionHorario>> listarHorariosDisponibles(@RequestParam(value = "especialidad", required = false) String especialidad) {
        return ResponseEntity.ok(servicioProgramacion.listarHorariosDisponibles(especialidad));
    }

    @Override
    public ResponseEntity<List<ProgramacionHorario>> listarHorarios() {
        return ResponseEntity.ok(servicioProgramacion.listarTodos());
    }

    @Override
    public ResponseEntity<ProgramacionHorario> buscarHorarioPorId(Long id) {
        return ResponseEntity.ok(servicioProgramacion.buscarHorarioPorId(id));
    }

    @Override
    public ResponseEntity<Void> actualizarEstado(Long id, boolean disponible) {
        servicioProgramacion.actualizarEstado(id, disponible);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<ProgramacionHorario> actualizarHorario(Long id, ProgramacionHorario horario) {
        return ResponseEntity.ok(servicioProgramacion.actualizarHorario(id, horario));
    }

    @Override
    public ResponseEntity<Void> eliminarHorario(Long id) {
        servicioProgramacion.eliminarHorario(id);
        return ResponseEntity.ok().build();
    }

}