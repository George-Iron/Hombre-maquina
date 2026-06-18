package com.centromedico.ms_programacion_horario.controller;

import com.centromedico.ms_programacion_horario.entity.Consultorio;
import com.centromedico.ms_programacion_horario.entity.ProgramacionHorario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface ApiProgramacion {

    @PostMapping("/consultorio/registrar")
    ResponseEntity<Consultorio> registrarConsultorio(@RequestBody Consultorio consultorio);

    @GetMapping("/consultorio/listar")
    ResponseEntity<List<Consultorio>> listarConsultorios();

    @PostMapping("/horario/registrar")
    ResponseEntity<ProgramacionHorario> registrarHorario(@RequestBody ProgramacionHorario horario);

    @GetMapping("/horario/disponibles")
    ResponseEntity<List<ProgramacionHorario>> listarHorariosDisponibles(
            @RequestParam(value = "especialidad", required = false) String especialidad);

    @GetMapping("/horario/{id}")
    ResponseEntity<ProgramacionHorario> buscarHorarioPorId(@PathVariable Long id);

    @PutMapping("/horario/actualizar-estado/{id}")
    ResponseEntity<Void> actualizarEstado(@PathVariable Long id, @RequestParam boolean disponible);

    @PutMapping("/horario/actualizar/{id}")
    ResponseEntity<ProgramacionHorario> actualizarHorario(@PathVariable Long id, @RequestBody ProgramacionHorario horario);

    @DeleteMapping("/horario/eliminar/{id}")
    ResponseEntity<Void> eliminarHorario(@PathVariable Long id);
}