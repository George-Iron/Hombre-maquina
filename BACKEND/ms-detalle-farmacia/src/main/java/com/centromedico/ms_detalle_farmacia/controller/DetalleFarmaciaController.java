package com.centromedico.ms_detalle_farmacia.controller;

import com.centromedico.ms_detalle_farmacia.entity.DetalleFarmacia;
import com.centromedico.ms_detalle_farmacia.repository.DetalleFarmaciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-farmacia")
public class DetalleFarmaciaController {

    @Autowired
    private DetalleFarmaciaRepository repo;

    @PostMapping("/registrar")
    public ResponseEntity<DetalleFarmacia> registrar(@RequestBody DetalleFarmacia d) {
        return ResponseEntity.ok(repo.save(d));
    }

    @PostMapping("/registrar-masivo")
    public ResponseEntity<List<DetalleFarmacia>> registrarMasivo(@RequestBody List<DetalleFarmacia> detalles) {
        return ResponseEntity.ok(repo.saveAll(detalles));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<DetalleFarmacia>> listarTodo() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/por-receta/{idReceta}")
    public ResponseEntity<List<DetalleFarmacia>> buscarPorReceta(@PathVariable Long idReceta) {
        return ResponseEntity.ok(repo.findByIdReceta(idReceta));
    }
}