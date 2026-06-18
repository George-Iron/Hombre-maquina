package com.centromedico.ms_compuesto_farmacia.client;

import com.centromedico.ms_compuesto_farmacia.dto.RecetaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "ms-receta")
public interface RecetaClient {

    @PostMapping("/api/receta/registrar")
    RecetaDTO registrar(@RequestBody RecetaDTO r);

    @GetMapping("/api/receta/listar")
    List<RecetaDTO> listar();
}
