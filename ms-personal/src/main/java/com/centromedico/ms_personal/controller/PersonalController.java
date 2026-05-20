package com.centromedico.ms_personal.controller;

import com.centromedico.ms_personal.dto.LoginDTO;
import com.centromedico.ms_personal.dto.TokenDTO;
import com.centromedico.ms_personal.entity.Empleado;
import com.centromedico.ms_personal.entity.Rol;
import com.centromedico.ms_personal.security.JwtProvider;
import com.centromedico.ms_personal.service.ServicioPersonal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/personal")
public class PersonalController implements ApiPersonal {

    @Autowired
    private ServicioPersonal servicioPersonal;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public ResponseEntity<Empleado> registrarEmpleado(@RequestBody Empleado empleado){
        return ResponseEntity.ok(servicioPersonal.crearEmpleado(empleado));
    }

    @Override
    public ResponseEntity<Empleado> buscarEmpleado(@PathVariable String dni){
        return servicioPersonal.buscarEmpleadoPorDni(dni)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<Empleado>> listarPorRol(@PathVariable Rol rol){
        return ResponseEntity.ok(servicioPersonal.listarPorRol(rol));
    }

    @Override
    public ResponseEntity<List<Empleado>> listarTodos(){
        return ResponseEntity.ok(servicioPersonal.listarTodos());
    }

    @Override
    public ResponseEntity<Empleado> actualizarEmpleado(@PathVariable Long id, @RequestBody Empleado empleado){
        return servicioPersonal.actualizarEmpleado(id, empleado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable Long id){
        if (servicioPersonal.eliminarEmpleado(id)){
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<Object> login(@RequestBody LoginDTO loginDTO) {
        // 1. Validar usuario y contraseña en la base de datos
        Optional<Empleado> empleadoOpt = servicioPersonal.login(loginDTO);

        if (empleadoOpt.isPresent()) {
            Empleado empleado = empleadoOpt.get();

            // 2. Generar el token JWT
            String token = jwtProvider.createToken(empleado);

            // 3. Devolver el token en un objeto JSON
            return ResponseEntity.ok(new TokenDTO(token));
        } else {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }

    @Override
    public ResponseEntity<Empleado> buscarEmpleadoPorId(@PathVariable Long id) {
        return servicioPersonal.buscarEmpleadoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
