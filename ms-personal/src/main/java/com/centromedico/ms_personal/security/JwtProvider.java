package com.centromedico.ms_personal.security;

import com.centromedico.ms_personal.entity.Empleado;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtProvider {

    // ESTA ES LA LLAVE SECRETA. ¡En producción debe ser compleja y estar en variables de entorno!
    // Debe tener al menos 256 bits (32 caracteres)
    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    public String createToken(Empleado empleado) {
        Map<String, Object> claims = new HashMap<>();
        // Aquí guardamos datos útiles dentro del token
        claims.put("id", empleado.getIdEmpleado());
        claims.put("rol", empleado.getRol());
        claims.put("nombre", empleado.getNombre() + " " + empleado.getApellido());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(empleado.getDni()) // El DNI será el identificador principal
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 Horas de vida
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
