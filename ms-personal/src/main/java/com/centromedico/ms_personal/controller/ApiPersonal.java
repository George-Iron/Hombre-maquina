package com.centromedico.ms_personal.controller;

import com.centromedico.ms_personal.dto.LoginDTO;
import com.centromedico.ms_personal.entity.Empleado;
import com.centromedico.ms_personal.entity.Rol;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface ApiPersonal {

    @GetMapping("listar/{rol}")
    ResponseEntity<List<Empleado>> listarPorRol(@PathVariable Rol rol);
    @GetMapping("/listar")
    ResponseEntity<List<Empleado>> listarPersonal();

    @GetMapping("/empleado/buscar-id/{id}")
    ResponseEntity<Empleado> buscarEmpleadoPorId(@PathVariable Long id);
    @GetMapping("/buscar/{dni}")
    ResponseEntity<Empleado> buscarEmpleado(@PathVariable String dni);

    @PostMapping("/registrar")
    ResponseEntity<Empleado> registrarEmpleado(@RequestBody Empleado empleado);
    @GetMapping("listar/{rol}")
    ResponseEntity<List<Empleado>> listarPorRol(@PathVariable Rol rol);

    @PutMapping("/actualizar/{id}")
    ResponseEntity<Empleado> actualizarEmpleado(@PathVariable Long id, @RequestBody Empleado empleado);
    @DeleteMapping("/eliminar/{id}")
    ResponseEntity<Void> eliminarEmpleado(@PathVariable Long id);

    @PostMapping("/login")
    ResponseEntity<Object> login(@RequestBody LoginDTO loginDTO);

}
