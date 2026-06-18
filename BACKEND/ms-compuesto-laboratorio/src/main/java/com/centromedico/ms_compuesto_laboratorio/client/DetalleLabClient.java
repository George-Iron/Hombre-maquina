package com.centromedico.ms_compuesto_laboratorio.client;

import com.centromedico.ms_compuesto_laboratorio.dto.DetalleLabDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "ms-detalle-laboratorio")
public interface DetalleLabClient {

    @PostMapping("/api/detalle-laboratorio/registrar")
    void registrar(@RequestBody DetalleLabDTO d);

    @PostMapping("/api/detalle-laboratorio/registrar-masivo")
    List<DetalleLabDTO> registrarMasivo(@RequestBody List<DetalleLabDTO> detalles);

    @GetMapping("/api/detalle-laboratorio/listar")
    List<DetalleLabDTO> listar();
}