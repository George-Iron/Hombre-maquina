package com.plataform.Seguridad_Server.Controller;

import com.plataform.Seguridad_Server.DTOs.PersonalRegisterRequestDTO;
import com.plataform.Seguridad_Server.Service.AuthPersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController()
@RequestMapping("/api/security")
public class AuthPersonalController {
    @Autowired
    private AuthPersonalService serviceAuthentication;

    @GetMapping("/seguro")
    public String seguro(){
        return "hola estimado seguro seguro piero";
    }
    @GetMapping("/libre")
    public String libre(){
        return "hola estimado piero";
    }
    @PostMapping("/registerAsistente")
    public ResponseEntity<Map<String, Object>> register(@RequestBody PersonalRegisterRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("mensaje", "Asistente registrado correctamente");
            response.put("data", serviceAuthentication.registrarPersonal(request));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping("/loginAsistente")
    public ResponseEntity<Map<String, Object>> loginEmpleado(@RequestBody PersonalRegisterRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String token = serviceAuthentication.loginAsistente(
                    request.getDni(),
                    request.getPassword()
            );
            response.put("mensaje", "Login correcto");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}
