package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.CustomerEmails;

/**
 * Spring Data JPA repository for the CustomerEmails entity.
 */
@Repository
public interface CustomerEmailsRepository extends JpaRepository<CustomerEmails, Long> {
    List<CustomerEmails> findOneByEmailIgnoreCase(String email);

    @Query("SELECT ce.id FROM CustomerEmails ce WHERE LOWER(ce.email) = LOWER(:email)")
    List<Long> findIdsByEmail(@Param("email") String email);

    List<CustomerEmails> findByEmail(String email);
}
