package com.centromedico.ms_laboratorio.controller;

import com.centromedico.ms_laboratorio.entity.TipoAnalisis;
import com.centromedico.ms_laboratorio.service.ServicioLaboratorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratorio")
public class LaboratorioController {

    @Autowired
    private ServicioLaboratorio servicio;

    @PostMapping("/registrar")
    public ResponseEntity<TipoAnalisis> registrar(@RequestBody TipoAnalisis tipo) {
        return ResponseEntity.ok(servicio.registrar(tipo));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<TipoAnalisis>> listar() {
        return ResponseEntity.ok(servicio.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoAnalisis> buscarPorId(@PathVariable Long id) {
        return servicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<TipoAnalisis> actualizar(@PathVariable Long id, @RequestBody TipoAnalisis tipo) {
        return ResponseEntity.ok(servicio.actualizar(id, tipo));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.ok().build();
    }

}
