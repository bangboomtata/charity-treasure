package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
import team.bham.domain.InterestedEvents;
import team.bham.repository.InterestedEventsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.InterestedEvents}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InterestedEventsResource {

    private final Logger log = LoggerFactory.getLogger(InterestedEventsResource.class);

    private static final String ENTITY_NAME = "interestedEvents";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InterestedEventsRepository interestedEventsRepository;

    public InterestedEventsResource(InterestedEventsRepository interestedEventsRepository) {
        this.interestedEventsRepository = interestedEventsRepository;
    }

    /**
     * {@code POST  /interested-events} : Create a new interestedEvents.
     *
     * @param interestedEvents the interestedEvents to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new interestedEvents, or with status {@code 400 (Bad Request)} if the interestedEvents has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/interested-events")
    public ResponseEntity<InterestedEvents> createInterestedEvents(@RequestBody InterestedEvents interestedEvents)
        throws URISyntaxException {
        log.debug("REST request to save InterestedEvents : {}", interestedEvents);
        if (interestedEvents.getId() != null) {
            throw new BadRequestAlertException("A new interestedEvents cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InterestedEvents result = interestedEventsRepository.save(interestedEvents);
        return ResponseEntity
            .created(new URI("/api/interested-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /interested-events/:id} : Updates an existing interestedEvents.
     *
     * @param id the id of the interestedEvents to save.
     * @param interestedEvents the interestedEvents to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interestedEvents,
     * or with status {@code 400 (Bad Request)} if the interestedEvents is not valid,
     * or with status {@code 500 (Internal Server Error)} if the interestedEvents couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/interested-events/{id}")
    public ResponseEntity<InterestedEvents> updateInterestedEvents(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InterestedEvents interestedEvents
    ) throws URISyntaxException {
        log.debug("REST request to update InterestedEvents : {}, {}", id, interestedEvents);
        if (interestedEvents.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interestedEvents.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interestedEventsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        InterestedEvents result = interestedEventsRepository.save(interestedEvents);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, interestedEvents.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /interested-events/:id} : Partial updates given fields of an existing interestedEvents, field will ignore if it is null
     *
     * @param id the id of the interestedEvents to save.
     * @param interestedEvents the interestedEvents to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interestedEvents,
     * or with status {@code 400 (Bad Request)} if the interestedEvents is not valid,
     * or with status {@code 404 (Not Found)} if the interestedEvents is not found,
     * or with status {@code 500 (Internal Server Error)} if the interestedEvents couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/interested-events/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InterestedEvents> partialUpdateInterestedEvents(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InterestedEvents interestedEvents
    ) throws URISyntaxException {
        log.debug("REST request to partial update InterestedEvents partially : {}, {}", id, interestedEvents);
        if (interestedEvents.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interestedEvents.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interestedEventsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InterestedEvents> result = interestedEventsRepository
            .findById(interestedEvents.getId())
            .map(existingInterestedEvents -> {
                return existingInterestedEvents;
            })
            .map(interestedEventsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, interestedEvents.getId().toString())
        );
    }

    /**
     * {@code GET  /interested-events} : get all the interestedEvents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of interestedEvents in body.
     */
    @GetMapping("/interested-events")
    public ResponseEntity<List<InterestedEvents>> getAllInterestedEvents(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of InterestedEvents");
        Page<InterestedEvents> page = interestedEventsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /interested-events/:id} : get the "id" interestedEvents.
     *
     * @param id the id of the interestedEvents to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the interestedEvents, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/interested-events/{id}")
    public ResponseEntity<InterestedEvents> getInterestedEvents(@PathVariable Long id) {
        log.debug("REST request to get InterestedEvents : {}", id);
        Optional<InterestedEvents> interestedEvents = interestedEventsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(interestedEvents);
    }

    /**
     * {@code DELETE  /interested-events/:id} : delete the "id" interestedEvents.
     *
     * @param id the id of the interestedEvents to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/interested-events/{id}")
    public ResponseEntity<Void> deleteInterestedEvents(@PathVariable Long id) {
        log.debug("REST request to delete InterestedEvents : {}", id);
        interestedEventsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
