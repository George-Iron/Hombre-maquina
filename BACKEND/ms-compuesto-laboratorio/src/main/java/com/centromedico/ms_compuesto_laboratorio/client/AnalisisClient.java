package com.centromedico.ms_compuesto_laboratorio.client;

import com.centromedico.ms_compuesto_laboratorio.dto.AnalisisDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "ms-analisis")
public interface AnalisisClient {

    @PostMapping("/api/analisis/registrar")
    AnalisisDTO registrar(@RequestBody AnalisisDTO a);

    @GetMapping("/api/analisis/listar")
    List<AnalisisDTO> listar();
}