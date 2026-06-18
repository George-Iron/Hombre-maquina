package com.centromedico.ms_orquestador.service;

import com.centromedico.ms_orquestador.client.*;
import com.centromedico.ms_orquestador.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ServicioOrquestador {

    @Autowired private PacienteClient pacienteClient;
    @Autowired private HistoriaClient historiaClient;
    @Autowired private AtencionClient atencionClient;
    @Autowired private CitaClient citaClient;
    @Autowired private FacturacionClient facturacionClient;
    @Autowired private PersonalClient personalClient;

    public Optional<ExpedienteDTO> obtenerExpediente(String dni) {
        try {
            // 1. Obtener Paciente
            PacienteDTO paciente = pacienteClient.buscarPorDni(dni).getBody();
            if (paciente == null) return Optional.empty();

            Long idPaciente = paciente.getIdPaciente();

            // 2. Lanzar búsquedas de Historia y Atenciones
            CompletableFuture<HistoriaDTO> historiaFuture = CompletableFuture.supplyAsync(() -> {
                try { return historiaClient.buscarPorIdPaciente(idPaciente).getBody(); }
                catch (Exception e) { return null; }
            });

            CompletableFuture<List<AtencionDTO>> atencionesFuture = CompletableFuture.supplyAsync(() -> {
                try { return atencionClient.listarHistorial(idPaciente).getBody(); }
                catch (Exception e) { return null; }
            });

            CompletableFuture.allOf(historiaFuture, atencionesFuture).join();

            HistoriaDTO historia = historiaFuture.get();
            List<AtencionDTO> atenciones = atencionesFuture.get();

            if (atenciones != null && !atenciones.isEmpty()) {

                List<CompletableFuture<Void>> tareasEnriquecimiento = atenciones.stream().map(atencion ->
                        CompletableFuture.runAsync(() -> enriquecerAtencion(atencion))
                ).collect(Collectors.toList());

                CompletableFuture.allOf(tareasEnriquecimiento.toArray(new CompletableFuture[0])).join();
            }

            return Optional.of(new ExpedienteDTO(paciente, historia, atenciones));

        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    private void enriquecerAtencion(AtencionDTO atencion) {
        Long idCitaRef = atencion.getIdCita();

        // A. Buscar Cita y Encargado
        try {
            DetalleCitaDTO citaFull = citaClient.buscarCitaPorId(idCitaRef).getBody();
            if (citaFull != null && citaFull.getIdEncargado() != null) {
                try {
                    EmpleadoDTO encargado = personalClient.buscarEmpleadoPorId(citaFull.getIdEncargado()).getBody();
                    if (encargado != null) {
                        citaFull.setNombreEncargado(encargado.getNombre() + " " + encargado.getApellido());
                        citaFull.setRolEncargado(encargado.getRol());
                    }
                } catch (Exception e) { /* Ignorar si falla el empleado */ }
            }
            atencion.setInfoCita(citaFull);
        } catch (Exception e) { /* Ignorar si falla la cita */ }

        // B. Buscar Factura y Cajero
        try {
            DetalleFacturacionDTO facturaFull = facturacionClient.buscarPorCita(idCitaRef).getBody();
            if (facturaFull != null && facturaFull.getIdCajero() != null) {
                try {
                    EmpleadoDTO cajero = personalClient.buscarEmpleadoPorId(facturaFull.getIdCajero()).getBody();
                    if (cajero != null) {
                        facturaFull.setNombreCajero(cajero.getNombre() + " " + cajero.getApellido());
                    }
                } catch (Exception e) { /* Ignorar si falla el cajero */ }
            }
            atencion.setInfoFacturacion(facturaFull);
        } catch (Exception e) { /* Ignorar si falla la factura */ }
    }
}