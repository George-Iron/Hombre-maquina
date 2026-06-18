package com.centromedico.ms_atencion_medica.controller;

import com.centromedico.ms_atencion_medica.entity.AtencionMedica;
import com.centromedico.ms_atencion_medica.service.ServicioAtencion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/atencion")
public class AtencionController implements ApiAtencion {

    @Autowired
    private ServicioAtencion servicioAtencion;

    @Override
    public ResponseEntity<AtencionMedica> registrar(AtencionMedica atencion) {
        return ResponseEntity.ok(servicioAtencion.registrarAtencion(atencion));
    }

    @Override
    public ResponseEntity<List<AtencionMedica>> listar() {
        return ResponseEntity.ok(servicioAtencion.listarAtenciones());
    }

    @Override
    public ResponseEntity<List<AtencionMedica>> listarPorPaciente(Long idPaciente) {
        return ResponseEntity.ok(servicioAtencion.listarPorPaciente(idPaciente));
    }
}