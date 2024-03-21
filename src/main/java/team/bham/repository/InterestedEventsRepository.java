package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.InterestedEvents;

/**
 * Spring Data JPA repository for the InterestedEvents entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InterestedEventsRepository extends JpaRepository<InterestedEvents, Long> {}
