package com.centromedico.ms_historia.controller;

import com.centromedico.ms_historia.entity.Historia;
import com.centromedico.ms_historia.service.ServicioHistoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/historia") //ruta base para este microservicio
public class HistoriaController implements ApiHistoria {

    @Autowired
    private ServicioHistoria servicioHistoria;

    @Override
    public ResponseEntity<Historia> buscarHistoriaPorIdPaciente(@PathVariable Long idPaciente){
        return servicioHistoria.buscarPorIdPaciente(idPaciente)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Historia> registrarHistoria(@RequestBody Historia historia){
        return ResponseEntity.ok(servicioHistoria.registrar(historia));
    }

}
