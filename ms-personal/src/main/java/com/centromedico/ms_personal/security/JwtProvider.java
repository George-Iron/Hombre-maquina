package com.centromedico.ms_personal.security;

import com.centromedico.ms_personal.entity.Empleado;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; // Nueva importación
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secret;

    public String createToken(Empleado empleado) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", empleado.getIdEmpleado());
        claims.put("rol", empleado.getRol());
        claims.put("nombre", empleado.getNombre() + " " + empleado.getApellido());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(empleado.getDni())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}