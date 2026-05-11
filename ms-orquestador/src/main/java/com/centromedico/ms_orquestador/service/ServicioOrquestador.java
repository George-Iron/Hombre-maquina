package com.centromedico.ms_orquestador.service;

import com.centromedico.ms_orquestador.client.*;
import com.centromedico.ms_orquestador.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioOrquestador {

    @Autowired
    private PacienteClient pacienteClient;

    @Autowired
    private HistoriaClient historiaClient;

    @Autowired
    private AtencionClient atencionClient;

    @Autowired
    private CitaClient citaClient;

    @Autowired
    private FacturacionClient facturacionClient;

    @Autowired
    private PersonalClient personalClient;

    public Optional<ExpedienteDTO> obtenerExpediente(String dni) {
        try {
            // 1. Paciente
            PacienteDTO paciente = pacienteClient.buscarPorDni(dni).getBody();
            if (paciente == null) return Optional.empty();

            // 2. Historia
            HistoriaDTO historia = null;
            try { historia = historiaClient.buscarPorIdPaciente(paciente.getIdPaciente()).getBody(); }
            catch (Exception e) {}

            // 3. Atenciones (Historial)
            List<AtencionDTO> atenciones = null;
            try { atenciones = atencionClient.listarHistorial(paciente.getIdPaciente()).getBody(); }
            catch (Exception e) {}

            // 4. Trazabilidad: Cita + Factura + Empleados
            if (atenciones != null) {
                for (AtencionDTO atencion : atenciones) {
                    Long idCitaRef = atencion.getIdCita();

                    // A. Buscar Cita y Encargado
                    try {
                        System.out.println("--> BUSCANDO CITA ID: " + idCitaRef); // DEBUG 1

                        DetalleCitaDTO citaFull = citaClient.buscarCitaPorId(idCitaRef).getBody();

                        System.out.println("--> CITA ENCONTRADA: " + citaFull); // DEBUG 2

                        if (citaFull != null && citaFull.getIdEncargado() != null) {
                            try {
                                EmpleadoDTO encargado = personalClient.buscarEmpleadoPorId(citaFull.getIdEncargado()).getBody();
                                if (encargado != null) {
                                    citaFull.setNombreEncargado(encargado.getNombre() + " " + encargado.getApellido());
                                    citaFull.setRolEncargado(encargado.getRol());
                                }
                            } catch (Exception e) {
                                System.out.println("Error buscando encargado: " + e.getMessage());
                            }
                        }
                        atencion.setInfoCita(citaFull);

                    } catch (Exception e) {
                        System.err.println("!!! ERROR FATAL EN CITA !!!");
                        e.printStackTrace();
                    }

                    // B. Buscar Factura y Cajero
                    try {
                        DetalleFacturacionDTO facturaFull = facturacionClient.buscarPorCita(idCitaRef).getBody();
                        if (facturaFull != null && facturaFull.getIdCajero() != null) {
                            // Buscar Nombre del Cajero
                            try {
                                EmpleadoDTO cajero = personalClient.buscarEmpleadoPorId(facturaFull.getIdCajero()).getBody();
                                if (cajero != null) {
                                    facturaFull.setNombreCajero(cajero.getNombre() + " " + cajero.getApellido());
                                }
                            } catch (Exception e) {}
                        }
                        atencion.setInfoFacturacion(facturaFull);
                    } catch (Exception e) {}
                }
            }

            return Optional.of(new ExpedienteDTO(paciente, historia, atenciones));
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

}
