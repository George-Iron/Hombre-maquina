package com.centromedico.ms_compuesto_laboratorio.controller;

import com.centromedico.ms_compuesto_laboratorio.client.AnalisisClient;
import com.centromedico.ms_compuesto_laboratorio.client.DetalleLabClient;
import com.centromedico.ms_compuesto_laboratorio.dto.AnalisisDTO;
import com.centromedico.ms_compuesto_laboratorio.dto.DetalleLabDTO;
import com.centromedico.ms_compuesto_laboratorio.dto.OrdenLabDTO;
import com.centromedico.ms_compuesto_laboratorio.dto.SalidaLabDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/servicio-laboratorio")
@RequiredArgsConstructor
public class LaboratorioOrquestadorController {

    private final AnalisisClient analisisClient;
    private final DetalleLabClient detalleClient;

    @PostMapping("/crear-orden")
    public ResponseEntity<List<SalidaLabDTO>> crear(@RequestBody OrdenLabDTO orden) {

        // Generar fecha y hora actuales
        String fechaActual = LocalDate.now().toString();
        String horaActual = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        AnalisisDTO a = new AnalisisDTO();
        a.setSolicitante(orden.getSolicitante());
        a.setObservaciones(orden.getObservaciones());
        a.setResultado("PENDIENTE");

        AnalisisDTO guardado = analisisClient.registrar(a);

        // 2. Preparar Detalles para guardar
        List<DetalleLabDTO> listaParaGuardar = new ArrayList<>();

        if (orden.getTiposAnalisisIds() != null) {
            for(Long idTipo : orden.getTiposAnalisisIds()) {
                DetalleLabDTO det = new DetalleLabDTO();
                det.setIdAnalisis(guardado.getIdAnalisis());
                det.setIdTipoAnalisis(idTipo);
                listaParaGuardar.add(det);
            }
        }

        // 3. Guardar y RECUPERAR los detalles (con sus IDs generados)
        List<DetalleLabDTO> detallesGuardados = new ArrayList<>();
        if (!listaParaGuardar.isEmpty()) {
            detallesGuardados = detalleClient.registrarMasivo(listaParaGuardar);
        }

        // 4. Construir la Lista de Salida (SalidaLabDTO)
        List<SalidaLabDTO> respuesta = new ArrayList<>();

        for(DetalleLabDTO det : detallesGuardados) {
            SalidaLabDTO salida = new SalidaLabDTO();

            salida.setIdDetalle(det.getIdDetalle());
            salida.setIdTipoAnalisis(det.getIdTipoAnalisis());

            salida.setIdFichaAna(guardado.getIdAnalisis());
            salida.setSolicitante(guardado.getSolicitante());
            salida.setFecha(fechaActual);
            salida.setHora(horaActual);
            salida.setObservaciones(guardado.getObservaciones());
            salida.setResultado(guardado.getResultado());

            respuesta.add(salida);
        }

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<SalidaLabDTO>> listar() {

        // 1. Obtener listas de los microservicios base
        List<AnalisisDTO> fichas = analisisClient.listar();
        List<DetalleLabDTO> detalles = detalleClient.listar();

        List<SalidaLabDTO> listaSalida = new ArrayList<>();

        // 2. Cruzar información (JOIN manual: Detalle -> Ficha)
        for (DetalleLabDTO det : detalles) {
            AnalisisDTO ficha = fichas.stream()
                    .filter(f -> f.getIdAnalisis().equals(det.getIdAnalisis()))
                    .findFirst()
                    .orElse(null);

            if (ficha != null) {
                SalidaLabDTO salida = new SalidaLabDTO();

                salida.setIdDetalle(det.getIdDetalle());
                salida.setIdTipoAnalisis(det.getIdTipoAnalisis());

                salida.setIdFichaAna(ficha.getIdAnalisis());
                salida.setSolicitante(ficha.getSolicitante());

                salida.setFecha(ficha.getFecha());
                salida.setHora(ficha.getHora());

                salida.setObservaciones(ficha.getObservaciones());
                salida.setResultado(ficha.getResultado());

                listaSalida.add(salida);
            }
        }

        return ResponseEntity.ok(listaSalida);
    }
}