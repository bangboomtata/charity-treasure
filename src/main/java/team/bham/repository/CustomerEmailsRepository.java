package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CustomerEmails;

/**
 * Spring Data JPA repository for the CustomerEmails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerEmailsRepository extends JpaRepository<CustomerEmails, Long> {}
