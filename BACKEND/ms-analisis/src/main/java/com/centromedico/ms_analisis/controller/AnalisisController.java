package com.centromedico.ms_analisis.controller;

import com.centromedico.ms_analisis.entity.Analisis;
import com.centromedico.ms_analisis.repository.AnalisisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/analisis")
public class AnalisisController {

    @Autowired
    private AnalisisRepository repo;

    @PostMapping("/registrar")
    public ResponseEntity<Analisis> registrar(@RequestBody Analisis a) {
        // 1. Asignar Fecha Actual
        a.setFecha(LocalDate.now());

        // 2. Asignar HORA Actual
        a.setHora(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

        // 3. Estado Inicial
        a.setEstado("PENDIENTE");

        return ResponseEntity.ok(repo.save(a));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Analisis>> listar() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Analisis> buscar(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}