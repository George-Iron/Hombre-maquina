package com.centromedico.ms_programacion_horario.client;

import com.centromedico.ms_programacion_horario.dto.BoletaVentaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-facturacion", path = "/api/facturacion")
public interface FacturacionClient {

    @GetMapping("/listar")
    ResponseEntity<List<BoletaVentaDTO>> listarBoletas();

    @GetMapping("/buscar-por-cita/{idCita}")
    ResponseEntity<BoletaVentaDTO> buscarPorCita(@PathVariable("idCita") Long idCita);

}
