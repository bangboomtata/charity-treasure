package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Shop;

/**
 * Spring Data JPA repository for the Shop entity.
 */

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    @Query("select s.shopEmail from Shop s where s.id = :id")
    String findShopEmailById(@Param("id") Long id);

    @Query("select s.shopName from Shop s where s.id = :id")
    String findShopNameById(@Param("id") Long id);
}
