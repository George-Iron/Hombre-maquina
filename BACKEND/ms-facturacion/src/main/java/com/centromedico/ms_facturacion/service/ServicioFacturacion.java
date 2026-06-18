package com.centromedico.ms_facturacion.service;

import com.centromedico.ms_facturacion.client.CitaClient;
import com.centromedico.ms_facturacion.dto.CitaDTO;
import com.centromedico.ms_facturacion.entity.BoletaVenta;
import com.centromedico.ms_facturacion.repository.BoletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioFacturacion {

    @Autowired
    private BoletaRepository boletaRepository;
    @Autowired private CitaClient citaClient; // Asegúrate de tener el FeignClient

    public BoletaVenta generarBoleta(BoletaVenta boleta) {
        // 1. Buscar Cita
        CitaDTO cita = citaClient.buscarCitaPorId(boleta.getIdCita()).getBody();
        if (cita == null) throw new RuntimeException("Cita no encontrada");

        // 2. Completar datos
        boleta.setFechaEmision(LocalDate.now());
        boleta.setEstado("PAGADA");
        boleta.setSerie("B001-" + System.currentTimeMillis()); // Generar serie
        if (boleta.getMontoTotal() == null) {
            boleta.setMontoTotal(cita.getPrecio() != null ? cita.getPrecio() : 50.00);
        }

        // 3. Guardar Boleta
        BoletaVenta guardada = boletaRepository.save(boleta);

        // 4. CRÍTICO: Notificar a ms-citas
        try {
            // Nota: Debes agregar este método en tu interfaz CitaClient (ver abajo)
            citaClient.actualizarEstado(boleta.getIdCita(), "PAGADA");
        } catch (Exception e) {
            System.err.println("Error actualizando estado en ms-citas: " + e.getMessage());
        }

        return guardada;
    }

    public List<BoletaVenta> listarBoletas() { return boletaRepository.findAll(); }

    public Optional<BoletaVenta> buscarPorCita(Long idCita) {
        return boletaRepository.findByIdCita(idCita);
    }

}
