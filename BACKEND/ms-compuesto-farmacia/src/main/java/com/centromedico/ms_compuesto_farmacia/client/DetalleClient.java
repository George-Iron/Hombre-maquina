package com.centromedico.ms_compuesto_farmacia.client;

import com.centromedico.ms_compuesto_farmacia.dto.DetalleDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "ms-detalle-farmacia")
public interface DetalleClient {

    @PostMapping("/api/detalle-farmacia/registrar")
    void registrar(@RequestBody DetalleDTO d);

    @PostMapping("/api/detalle-farmacia/registrar-masivo")
    List<DetalleDTO> registrarMasivo(@RequestBody List<DetalleDTO> detalles);

    @GetMapping("/api/detalle-farmacia/listar")
    List<DetalleDTO> listar();
}