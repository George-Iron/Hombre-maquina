package com.centromedico.ms_citas.controller;

import com.centromedico.ms_citas.dto.CitaRequestDTO;
import com.centromedico.ms_citas.entity.CitaMedica;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

public interface ApiCita {

    @PostMapping("/registrar")
    ResponseEntity<CitaMedica> registrar(@RequestBody CitaRequestDTO request);

    @PutMapping("/actualizar-estado/{id}")
    ResponseEntity<Void> actualizarEstado(@PathVariable("id") Long id, @RequestParam("estado") String estado);

    @GetMapping("/listar")
    ResponseEntity<List<CitaMedica>> listar();

    @GetMapping("/{id}")
    ResponseEntity<CitaMedica> buscar(@PathVariable("id") Long id);

    @DeleteMapping("/eliminar/{id}")
    ResponseEntity<Void> eliminar(@PathVariable("id") Long id);

    @GetMapping("/agenda")
    ResponseEntity<List<CitaMedica>> verAgendaDiaria(@RequestParam("fecha") String fecha);

    @GetMapping("/pendientes")
    ResponseEntity<List<CitaMedica>> listarPendientesPago();

}
