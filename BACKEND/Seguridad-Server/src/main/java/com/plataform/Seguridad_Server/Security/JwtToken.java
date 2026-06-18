package com.plataform.Seguridad_Server.Security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtToken {
    // Usamos la misma llave global para que el API Gateway pueda validar los tokens
    private static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
    private final byte[] key = io.jsonwebtoken.io.Decoders.BASE64.decode(SECRET);

    public String generateTokenByEmail(String dni, String role, String nombre) {
        return Jwts.builder()
                .setSubject(dni)
                .claim("role", role)
                .claim("rol", role)
                .claim("nombre", nombre != null ? nombre : "Usuario")
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 600000)
                )
                .signWith(
                        Keys.hmacShaKeyFor(key),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public String extractDni(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }
}
