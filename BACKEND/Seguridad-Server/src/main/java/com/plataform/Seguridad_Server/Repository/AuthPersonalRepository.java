package com.plataform.Seguridad_Server.Repository;
import com.plataform.Seguridad_Server.Model.AuthPersonalModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AuthPersonalRepository extends JpaRepository<AuthPersonalModel, Long> {
    Optional<AuthPersonalModel> findByDniAuth(String dniAuth);
    List<AuthPersonalModel> findByRolAuth(String rolAuth);
}
