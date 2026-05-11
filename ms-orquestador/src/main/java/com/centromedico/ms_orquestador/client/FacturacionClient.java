package com.centromedico.ms_orquestador.client;

import com.centromedico.ms_orquestador.dto.DetalleFacturacionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-facturacion", path = "/api/facturacion")
public interface FacturacionClient {

    @GetMapping("buscar-por-cita/{idCita}")
    ResponseEntity<DetalleFacturacionDTO> buscarPorCita(@PathVariable Long idCita);

}
