package com.centromedico.ms_facturacion.controller;

import com.centromedico.ms_facturacion.entity.BoletaVenta;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ApiFacturacion {

    @PostMapping("/generar")
    ResponseEntity<BoletaVenta> generarBoleta(@RequestBody BoletaVenta boleta);

    @GetMapping("/listar")
    ResponseEntity<List<BoletaVenta>> listarBoletas();

    @GetMapping("/buscar-por-cita/{idCita}")
    ResponseEntity<BoletaVenta> buscarPorCita(@PathVariable("idCita") Long idCita);

}
