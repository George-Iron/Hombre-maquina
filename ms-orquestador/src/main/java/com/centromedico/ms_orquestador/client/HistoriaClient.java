package com.centromedico.ms_orquestador.client;

import com.centromedico.ms_orquestador.dto.HistoriaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-historia", path = "/api/historia")
public interface HistoriaClient {

    @GetMapping("/paciente/{idPaciente}")
    ResponseEntity<HistoriaDTO> buscarPorIdPaciente(@PathVariable Long idPaciente);

}
