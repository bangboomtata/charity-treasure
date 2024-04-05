package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import team.bham.domain.VolunteerPost;
import team.bham.repository.VolunteerPostRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.VolunteerPost}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VolunteerPostResource {

    private final Logger log = LoggerFactory.getLogger(VolunteerPostResource.class);

    private static final String ENTITY_NAME = "volunteerPost";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VolunteerPostRepository volunteerPostRepository;

    public VolunteerPostResource(VolunteerPostRepository volunteerPostRepository) {
        this.volunteerPostRepository = volunteerPostRepository;
    }

    /**
     * {@code POST  /volunteer-posts} : Create a new volunteerPost.
     *
     * @param volunteerPost the volunteerPost to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new volunteerPost, or with status {@code 400 (Bad Request)} if the volunteerPost has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/volunteer-posts")
    public ResponseEntity<VolunteerPost> createVolunteerPost(@Valid @RequestBody VolunteerPost volunteerPost) throws URISyntaxException {
        log.debug("REST request to save VolunteerPost : {}", volunteerPost);
        if (volunteerPost.getId() != null) {
            throw new BadRequestAlertException("A new volunteerPost cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VolunteerPost result = volunteerPostRepository.save(volunteerPost);
        return ResponseEntity
            .created(new URI("/api/volunteer-posts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /volunteer-posts/:id} : Updates an existing volunteerPost.
     *
     * @param id the id of the volunteerPost to save.
     * @param volunteerPost the volunteerPost to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated volunteerPost,
     * or with status {@code 400 (Bad Request)} if the volunteerPost is not valid,
     * or with status {@code 500 (Internal Server Error)} if the volunteerPost couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/volunteer-posts/{id}")
    public ResponseEntity<VolunteerPost> updateVolunteerPost(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody VolunteerPost volunteerPost
    ) throws URISyntaxException {
        log.debug("REST request to update VolunteerPost : {}, {}", id, volunteerPost);
        if (volunteerPost.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, volunteerPost.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!volunteerPostRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VolunteerPost result = volunteerPostRepository.save(volunteerPost);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, volunteerPost.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /volunteer-posts/:id} : Partial updates given fields of an existing volunteerPost, field will ignore if it is null
     *
     * @param id the id of the volunteerPost to save.
     * @param volunteerPost the volunteerPost to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated volunteerPost,
     * or with status {@code 400 (Bad Request)} if the volunteerPost is not valid,
     * or with status {@code 404 (Not Found)} if the volunteerPost is not found,
     * or with status {@code 500 (Internal Server Error)} if the volunteerPost couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/volunteer-posts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VolunteerPost> partialUpdateVolunteerPost(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody VolunteerPost volunteerPost
    ) throws URISyntaxException {
        log.debug("REST request to partial update VolunteerPost partially : {}, {}", id, volunteerPost);
        if (volunteerPost.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, volunteerPost.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!volunteerPostRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VolunteerPost> result = volunteerPostRepository
            .findById(volunteerPost.getId())
            .map(existingVolunteerPost -> {
                if (volunteerPost.getPostTitle() != null) {
                    existingVolunteerPost.setPostTitle(volunteerPost.getPostTitle());
                }
                if (volunteerPost.getLocationAddress() != null) {
                    existingVolunteerPost.setLocationAddress(volunteerPost.getLocationAddress());
                }
                if (volunteerPost.getContactNum() != null) {
                    existingVolunteerPost.setContactNum(volunteerPost.getContactNum());
                }
                if (volunteerPost.getEmail() != null) {
                    existingVolunteerPost.setEmail(volunteerPost.getEmail());
                }
                if (volunteerPost.getAboutUs() != null) {
                    existingVolunteerPost.setAboutUs(volunteerPost.getAboutUs());
                }
                if (volunteerPost.getAboutRole() != null) {
                    existingVolunteerPost.setAboutRole(volunteerPost.getAboutRole());
                }
                if (volunteerPost.getBenefits() != null) {
                    existingVolunteerPost.setBenefits(volunteerPost.getBenefits());
                }
                if (volunteerPost.getImg() != null) {
                    existingVolunteerPost.setImg(volunteerPost.getImg());
                }
                if (volunteerPost.getImgContentType() != null) {
                    existingVolunteerPost.setImgContentType(volunteerPost.getImgContentType());
                }
                if (volunteerPost.getActiveStatus() != null) {
                    existingVolunteerPost.setActiveStatus(volunteerPost.getActiveStatus());
                }
                if (volunteerPost.getStartDate() != null) {
                    existingVolunteerPost.setStartDate(volunteerPost.getStartDate());
                }
                if (volunteerPost.getMonday() != null) {
                    existingVolunteerPost.setMonday(volunteerPost.getMonday());
                }
                if (volunteerPost.getTuesday() != null) {
                    existingVolunteerPost.setTuesday(volunteerPost.getTuesday());
                }
                if (volunteerPost.getWednesday() != null) {
                    existingVolunteerPost.setWednesday(volunteerPost.getWednesday());
                }
                if (volunteerPost.getThursday() != null) {
                    existingVolunteerPost.setThursday(volunteerPost.getThursday());
                }
                if (volunteerPost.getFriday() != null) {
                    existingVolunteerPost.setFriday(volunteerPost.getFriday());
                }
                if (volunteerPost.getSaturday() != null) {
                    existingVolunteerPost.setSaturday(volunteerPost.getSaturday());
                }
                if (volunteerPost.getSunday() != null) {
                    existingVolunteerPost.setSunday(volunteerPost.getSunday());
                }
                if (volunteerPost.getMorning() != null) {
                    existingVolunteerPost.setMorning(volunteerPost.getMorning());
                }
                if (volunteerPost.getAfternoon() != null) {
                    existingVolunteerPost.setAfternoon(volunteerPost.getAfternoon());
                }
                if (volunteerPost.getEvening() != null) {
                    existingVolunteerPost.setEvening(volunteerPost.getEvening());
                }

                return existingVolunteerPost;
            })
            .map(volunteerPostRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, volunteerPost.getId().toString())
        );
    }

    /**
     * {@code GET  /volunteer-posts} : get all the volunteerPosts.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of volunteerPosts in body.
     */
    @GetMapping("/volunteer-posts")
    public ResponseEntity<List<VolunteerPost>> getAllVolunteerPosts(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of VolunteerPosts");
        Page<VolunteerPost> page = volunteerPostRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /volunteer-posts/:id} : get the "id" volunteerPost.
     *
     * @param id the id of the volunteerPost to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the volunteerPost, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/volunteer-posts/{id}")
    public ResponseEntity<VolunteerPost> getVolunteerPost(@PathVariable Long id) {
        log.debug("REST request to get VolunteerPost : {}", id);
        Optional<VolunteerPost> volunteerPost = volunteerPostRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(volunteerPost);
    }

    /**
     * {@code DELETE  /volunteer-posts/:id} : delete the "id" volunteerPost.
     *
     * @param id the id of the volunteerPost to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/volunteer-posts/{id}")
    public ResponseEntity<Void> deleteVolunteerPost(@PathVariable Long id) {
        log.debug("REST request to delete VolunteerPost : {}", id);
        volunteerPostRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
