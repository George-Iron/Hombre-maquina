package com.centromedico.ms_citas.controller;

import com.centromedico.ms_citas.dto.CitaRequestDTO;
import com.centromedico.ms_citas.entity.CitaMedica;
import com.centromedico.ms_citas.service.ServicioCita;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cita")
public class CitaController implements ApiCita {

    @Autowired
    private ServicioCita servicioCita;

    @Override
    public ResponseEntity<CitaMedica> registrar(CitaRequestDTO request) {
        return ResponseEntity.ok(servicioCita.registrarCita(
                request.getDniPaciente(),
                request.getIdHorario(),
                request.getIdEncargado()
        ));
    }

    @Override
    public ResponseEntity<Void> actualizarEstado(Long id, String estado) {
        servicioCita.actualizarEstadoCita(id, estado);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<List<CitaMedica>> listar() {
        return ResponseEntity.ok(servicioCita.listarCitas());
    }

    @Override
    public ResponseEntity<CitaMedica> buscar(Long id) {
        return servicioCita.buscarCitaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> eliminar(Long id) {
        servicioCita.eliminarCita(id);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<List<CitaMedica>> verAgendaDiaria(String fecha) {
        // La lógica de conversión se queda aquí en el controlador
        LocalDate fechaDate = LocalDate.parse(fecha);

        return ResponseEntity.ok(servicioCita.listarCitasPorFecha(fechaDate));
    }

    @Override
    public ResponseEntity<List<CitaMedica>> listarPendientesPago() {
        // Asumiendo que 'servicioCita' tiene este método implementado
        return ResponseEntity.ok(servicioCita.listarCitasPorEstado("PENDIENTE_PAGO"));
    }

}