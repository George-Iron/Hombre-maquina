package com.centromedico.ms_historia.controller;

import com.centromedico.ms_historia.entity.Historia;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface ApiHistoria {

    @GetMapping("/paciente/{idPaciente}")
    ResponseEntity<Historia> buscarHistoriaPorIdPaciente(@PathVariable Long idPaciente);

    @PostMapping("/registrar")
    ResponseEntity<Historia> registrarHistoria(@RequestBody Historia historia);

}
