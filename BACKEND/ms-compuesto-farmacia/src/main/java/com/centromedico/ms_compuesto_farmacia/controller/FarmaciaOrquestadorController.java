package com.centromedico.ms_compuesto_farmacia.controller;

import com.centromedico.ms_compuesto_farmacia.client.DetalleClient;
import com.centromedico.ms_compuesto_farmacia.client.RecetaClient;
import com.centromedico.ms_compuesto_farmacia.dto.CompraDTO;
import com.centromedico.ms_compuesto_farmacia.dto.DetalleDTO;
import com.centromedico.ms_compuesto_farmacia.dto.RecetaDTO;
import com.centromedico.ms_compuesto_farmacia.dto.SalidaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/servicio-farmacia")
@RequiredArgsConstructor
public class FarmaciaOrquestadorController {

    private final RecetaClient recetaClient;
    private final DetalleClient detalleClient;

    @PostMapping("/procesar-orden")
    public ResponseEntity<List<SalidaDTO>> procesar(@RequestBody CompraDTO compra) {

        // 1. Datos de Fecha/Hora
        String fechaActual = LocalDate.now().toString();
        String horaActual = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        // 2. Crear Cabecera (Receta)
        RecetaDTO r = new RecetaDTO();
        r.setNombreSolicitante(compra.getSolicitante());
        r.setIndicaciones(compra.getIndicaciones());
        r.setDuracion(compra.getDuracion());

        RecetaDTO creada = recetaClient.registrar(r);

        // 3. Preparar Detalles
        List<DetalleDTO> listaParaGuardar = new ArrayList<>();

        if (compra.getMedicamentosIds() != null) {
            for(Long idMed : compra.getMedicamentosIds()) {
                DetalleDTO d = new DetalleDTO();
                d.setIdReceta(creada.getIdReceta());
                d.setIdMedicamento(idMed);
                d.setCantidad(1);
                listaParaGuardar.add(d);
            }
        }

        // 4. Guardar y RECUPERAR los detalles con sus IDs nuevos
        List<DetalleDTO> detallesGuardados = new ArrayList<>();
        if (!listaParaGuardar.isEmpty()) {
            detallesGuardados = detalleClient.registrarMasivo(listaParaGuardar);
        }

        // 5. Construir la Lista de Salida (Como pide el diagrama)
        List<SalidaDTO> respuesta = new ArrayList<>();

        for(DetalleDTO det : detallesGuardados) {
            SalidaDTO salida = new SalidaDTO();

            salida.setIdDetalle(det.getIdDetalle());
            salida.setIdMedicamento(det.getIdMedicamento());

            salida.setIdReceta(creada.getIdReceta());
            salida.setNombreSolicitante(creada.getNombreSolicitante());

            salida.setFecha(creada.getFecha() != null ? creada.getFecha() : fechaActual);
            salida.setHora(creada.getHora() != null ? creada.getHora() : horaActual);

            salida.setIndicaciones(creada.getIndicaciones());
            salida.setDuracion(creada.getDuracion());

            respuesta.add(salida);
        }

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<SalidaDTO>> listar() {

        // 1. Traer todo de los microservicios
        List<RecetaDTO> recetas = recetaClient.listar();
        List<DetalleDTO> detalles = detalleClient.listar();

        List<SalidaDTO> listaSalida = new ArrayList<>();

        // 2. Algoritmo de Cruce (Recorrer detalles y buscar su receta)
        for (DetalleDTO det : detalles) {
            RecetaDTO rec = recetas.stream()
                    .filter(r -> r.getIdReceta().equals(det.getIdReceta()))
                    .findFirst()
                    .orElse(null);

            if (rec != null) {
                SalidaDTO salida = new SalidaDTO();

                salida.setIdDetalle(det.getIdDetalle());
                salida.setIdMedicamento(det.getIdMedicamento());

                salida.setIdReceta(rec.getIdReceta());
                salida.setNombreSolicitante(rec.getNombreSolicitante());
                salida.setFecha(rec.getFecha());
                salida.setHora(rec.getHora());
                salida.setIndicaciones(rec.getIndicaciones());
                salida.setDuracion(rec.getDuracion());

                listaSalida.add(salida);
            }
        }

        return ResponseEntity.ok(listaSalida);
    }
}