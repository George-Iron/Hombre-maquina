package com.centromedico.ms_atencion_medica.client;

import com.centromedico.ms_atencion_medica.dto.MedicamentoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-farmacia", path = "/api/farmacia")
public interface FarmaciaClient {

    @GetMapping("/{id}")
    ResponseEntity<MedicamentoDTO> buscarMedicamento(@PathVariable Long id);

}
