package com.centromedico.ms_receta.controller;

import com.centromedico.ms_receta.entity.Receta;
import com.centromedico.ms_receta.repository.RecetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/receta")
public class RecetaController {

    @Autowired
    private RecetaRepository repo;

    @PostMapping("/registrar")
    public ResponseEntity<Receta> registrar(@RequestBody Receta r) {
        if(r.getFechaEmision() == null) {
            r.setFechaEmision(LocalDate.now());
        }

        if(r.getHoraEmision() == null) {
            r.setHoraEmision(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        }

        return ResponseEntity.ok(repo.save(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receta> buscar(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Receta>> listar() {
        return ResponseEntity.ok(repo.findAll());
    }
}