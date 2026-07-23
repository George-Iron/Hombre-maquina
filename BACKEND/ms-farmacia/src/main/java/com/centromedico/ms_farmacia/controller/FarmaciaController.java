package com.centromedico.ms_farmacia.controller;

import com.centromedico.ms_farmacia.entity.Medicamento;
import com.centromedico.ms_farmacia.service.ServicioFarmacia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmacia")
public class FarmaciaController {

    @Autowired
    private ServicioFarmacia servicio;

    @PostMapping("/registrar")
    public ResponseEntity<Medicamento> registrar(@RequestBody Medicamento med) {
        return ResponseEntity.ok(servicio.registrar(med));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Medicamento>> listar() {
        return ResponseEntity.ok(servicio.listar());
    }

    @GetMapping("/laboratorios")
    public ResponseEntity<List<String>> listarLaboratorios() {
        return ResponseEntity.ok(List.of(
            "Bago",
            "Genfar",
            "Hersil",
            "Portugal",
            "Mylan",
            "Roche",
            "Pfizer",
            "Sjcorp"
        ));
    }

    @GetMapping("/nombres-predefinidos")
    public ResponseEntity<List<String>> listarNombresPredefinidos() {
        return ResponseEntity.ok(List.of(
            "Paracetamol",
            "Ibuprofeno",
            "Amoxicilina",
            "Omeprazol",
            "Loratadina",
            "Atorvastatina",
            "Metformina",
            "Aspirina"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> buscarPorId(@PathVariable Long id) {
        return servicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Medicamento> actualizar(@PathVariable Long id, @RequestBody Medicamento m) {
        return ResponseEntity.ok(servicio.actualizar(id, m));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.ok().build();
    }

}
