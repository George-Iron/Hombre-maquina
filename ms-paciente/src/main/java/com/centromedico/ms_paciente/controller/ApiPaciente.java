package com.centromedico.ms_paciente.controller;

import com.centromedico.ms_paciente.entity.Paciente;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface ApiPaciente {

    @GetMapping("/listar")
    ResponseEntity<List<Paciente>> listarPacientes();

    @GetMapping("/buscar/{dni}")
    ResponseEntity<Paciente> buscarPacientePorDni(@PathVariable String dni);

    @PostMapping("/registrar")
    ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente paciente);

    @PutMapping("/actualizar/{id}")
    ResponseEntity<Paciente> actualizarPaciente(@PathVariable Long id, @RequestBody Paciente paciente);

    @DeleteMapping("/eliminar/{id}")
    ResponseEntity<Void> eliminarPaciente(@PathVariable Long id);

    @GetMapping("/{id}")
    ResponseEntity<Paciente> buscarPorId(@PathVariable Long id);

}
