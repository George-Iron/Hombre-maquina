package com.centromedico.ms_atencion_medica.controller;

import com.centromedico.ms_atencion_medica.entity.AtencionMedica;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ApiAtencion {

    @PostMapping("/registrar")
    ResponseEntity<AtencionMedica> registrar(@RequestBody AtencionMedica atencion);

    @GetMapping("/listar")
    ResponseEntity<List<AtencionMedica>> listar();

    // Endpoint necesario para el Orquestador o Historial Clínico
    @GetMapping("/historial/{idPaciente}")
    ResponseEntity<List<AtencionMedica>> listarPorPaciente(@PathVariable Long idPaciente);
}
