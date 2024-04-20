package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Customer;

/**
 * Spring Data JPA repository for the Customer entity.
 */

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {}
