package com.plataform.Seguridad_Server.Service;
import com.plataform.Seguridad_Server.Client.PersonalClient;
import com.plataform.Seguridad_Server.DTOs.PersonalClientDTO;
import com.plataform.Seguridad_Server.DTOs.PersonalRegisterRequestDTO;
import com.plataform.Seguridad_Server.DTOs.PersonalRegisterResponseDTO;
import com.plataform.Seguridad_Server.Model.AuthPersonalModel;
import com.plataform.Seguridad_Server.Repository.AuthPersonalRepository;
import com.plataform.Seguridad_Server.Security.JwtToken;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthPersonalService {
    @Autowired
    private PersonalClient clientEmpleado;
    @Autowired
    private AuthPersonalRepository repositoryAuthentication;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtToken jwtUtil;

    public List<PersonalClientDTO> obtenerEmpleados() {
        return clientEmpleado.listarPersonal();
    }

    public PersonalRegisterResponseDTO  registrarPersonal(PersonalRegisterRequestDTO request) {
        PersonalClientDTO empleado;
        try {
            empleado = clientEmpleado.buscarEmpleado(request.getDni());
        } catch (FeignException.NotFound e) {
            throw new RuntimeException("El DNI no existe en Empleado");
        }
        if (!empleado.getHabilitado()) {
            throw new RuntimeException("Empleado deshabilitado");
        }
        if (repositoryAuthentication.findByDniAuth(request.getDni()).isPresent()) {
            throw new RuntimeException("El usuario ya está registrado");
        }
        AuthPersonalModel usuario = new AuthPersonalModel();
        usuario.setDniAuth(request.getDni());
        usuario.setCorreoAuth(empleado.getCorreo());
        usuario.setContraseñaAuth(passwordEncoder.encode(request.getPassword()));
        usuario.setRolAuth(empleado.getRol());
        usuario.setHabilitadoAuth(true);
        repositoryAuthentication.save(usuario);
        return new PersonalRegisterResponseDTO(
                usuario.getDniAuth(),
                usuario.getCorreoAuth(),
                usuario.getContraseñaAuth(),
                usuario.getRolAuth(),
                usuario.getHabilitadoAuth()
        );
    }

    public String loginAsistente(String dni, String password) {
        AuthPersonalModel emp = repositoryAuthentication.findByDniAuth(dni)
                .orElseThrow(() -> new RuntimeException("No existe"));
        if (!emp.getHabilitadoAuth()) {
            throw new RuntimeException("Usuario deshabilitado");
        }
        if (!passwordEncoder.matches(password, emp.getContraseñaAuth())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        String nombre = "Usuario";
        try {
            PersonalClientDTO empleadoDTO = clientEmpleado.buscarEmpleado(dni);
            nombre = empleadoDTO.getNombre();
        } catch (Exception e) {
            // Ignorar y usar nombre por defecto
        }
        
        return jwtUtil.generateTokenByEmail(
                emp.getDniAuth(),
                emp.getRolAuth(),
                nombre
        );
    }
}
