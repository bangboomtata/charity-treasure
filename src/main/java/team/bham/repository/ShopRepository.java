package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import team.bham.domain.Shop;

/**
 * Spring Data JPA repository for the Shop entity.
 */

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    //    @Query("SELECT s.email FROM Shop s WHERE s.id = :id")
    //    String findEmailById(Long id);
}
