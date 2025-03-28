package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.VolunteerPost;

/**
 * Spring Data JPA repository for the VolunteerPost entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VolunteerPostRepository extends JpaRepository<VolunteerPost, Long> {}
