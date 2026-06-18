package com.centromedico.ms_facturacion.controller;

import com.centromedico.ms_facturacion.entity.BoletaVenta;
import com.centromedico.ms_facturacion.service.ServicioFacturacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturacion")
public class FacturacionController implements ApiFacturacion {

    @Autowired
    private ServicioFacturacion servicioFacturacion;

    @Override
    public ResponseEntity<BoletaVenta> generarBoleta(BoletaVenta boleta) {
        return ResponseEntity.ok(servicioFacturacion.generarBoleta(boleta));
    }

    @Override
    public ResponseEntity<List<BoletaVenta>> listarBoletas() {
        return ResponseEntity.ok(servicioFacturacion.listarBoletas());
    }

    @Override
    public ResponseEntity<BoletaVenta> buscarPorCita(Long idCita) {
        // La lógica que ya tenías es correcta
        return servicioFacturacion.buscarPorCita(idCita)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
