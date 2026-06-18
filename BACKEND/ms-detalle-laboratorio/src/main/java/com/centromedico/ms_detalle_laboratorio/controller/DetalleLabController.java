package com.centromedico.ms_detalle_laboratorio.controller;

import com.centromedico.ms_detalle_laboratorio.entity.DetalleLaboratorio;
import com.centromedico.ms_detalle_laboratorio.repository.DetalleLabRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-laboratorio")
public class DetalleLabController {

    @Autowired
    private DetalleLabRepo repo;

    @PostMapping("/registrar")
    public ResponseEntity<DetalleLaboratorio> registrar(@RequestBody DetalleLaboratorio d) {
        return ResponseEntity.ok(repo.save(d));
    }

    @PostMapping("/registrar-masivo")
    public ResponseEntity<List<DetalleLaboratorio>> registrarMasivo(@RequestBody List<DetalleLaboratorio> detalles) {
        return ResponseEntity.ok(repo.saveAll(detalles));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<DetalleLaboratorio>> listarTodo() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/por-analisis/{idAnalisis}")
    public ResponseEntity<List<DetalleLaboratorio>> buscarPorAnalisis(@PathVariable Long idAnalisis) {
        return ResponseEntity.ok(repo.findByIdAnalisis(idAnalisis));
    }
}