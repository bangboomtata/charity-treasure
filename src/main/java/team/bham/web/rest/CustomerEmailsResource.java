package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.CustomerEmails;
import team.bham.repository.CustomerEmailsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CustomerEmails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CustomerEmailsResource {

    private final Logger log = LoggerFactory.getLogger(CustomerEmailsResource.class);

    private static final String ENTITY_NAME = "customerEmails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomerEmailsRepository customerEmailsRepository;

    public CustomerEmailsResource(CustomerEmailsRepository customerEmailsRepository) {
        this.customerEmailsRepository = customerEmailsRepository;
    }

    /**
     * {@code POST  /customer-emails} : Create a new customerEmails.
     *
     * @param customerEmails the customerEmails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customerEmails, or with status {@code 400 (Bad Request)} if the customerEmails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/customer-emails")
    public ResponseEntity<CustomerEmails> createCustomerEmails(@RequestBody CustomerEmails customerEmails) throws URISyntaxException {
        log.debug("REST request to save CustomerEmails : {}", customerEmails);
        if (customerEmails.getId() != null) {
            throw new BadRequestAlertException("A new customerEmails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomerEmails result = customerEmailsRepository.save(customerEmails);
        return ResponseEntity
            .created(new URI("/api/customer-emails/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /customer-emails/:id} : Updates an existing customerEmails.
     *
     * @param id the id of the customerEmails to save.
     * @param customerEmails the customerEmails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customerEmails,
     * or with status {@code 400 (Bad Request)} if the customerEmails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customerEmails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/customer-emails/{id}")
    public ResponseEntity<CustomerEmails> updateCustomerEmails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomerEmails customerEmails
    ) throws URISyntaxException {
        log.debug("REST request to update CustomerEmails : {}, {}", id, customerEmails);
        if (customerEmails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customerEmails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customerEmailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CustomerEmails result = customerEmailsRepository.save(customerEmails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customerEmails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /customer-emails/:id} : Partial updates given fields of an existing customerEmails, field will ignore if it is null
     *
     * @param id the id of the customerEmails to save.
     * @param customerEmails the customerEmails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customerEmails,
     * or with status {@code 400 (Bad Request)} if the customerEmails is not valid,
     * or with status {@code 404 (Not Found)} if the customerEmails is not found,
     * or with status {@code 500 (Internal Server Error)} if the customerEmails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/customer-emails/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomerEmails> partialUpdateCustomerEmails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomerEmails customerEmails
    ) throws URISyntaxException {
        log.debug("REST request to partial update CustomerEmails partially : {}, {}", id, customerEmails);
        if (customerEmails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customerEmails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customerEmailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CustomerEmails> result = customerEmailsRepository
            .findById(customerEmails.getId())
            .map(existingCustomerEmails -> {
                if (customerEmails.getEmail() != null) {
                    existingCustomerEmails.setEmail(customerEmails.getEmail());
                }

                return existingCustomerEmails;
            })
            .map(customerEmailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customerEmails.getId().toString())
        );
    }

    /**
     * {@code GET  /customer-emails} : get all the customerEmails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customerEmails in body.
     */
    @GetMapping("/customer-emails")
    public List<CustomerEmails> getAllCustomerEmails() {
        log.debug("REST request to get all CustomerEmails");
        return customerEmailsRepository.findAll();
    }

    /**
     * {@code GET  /customer-emails/:id} : get the "id" customerEmails.
     *
     * @param id the id of the customerEmails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customerEmails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/customer-emails/{id}")
    public ResponseEntity<CustomerEmails> getCustomerEmails(@PathVariable Long id) {
        log.debug("REST request to get CustomerEmails : {}", id);
        Optional<CustomerEmails> customerEmails = customerEmailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(customerEmails);
    }

    /**
     * {@code DELETE  /customer-emails/:id} : delete the "id" customerEmails.
     *
     * @param id the id of the customerEmails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/customer-emails/{id}")
    public ResponseEntity<Void> deleteCustomerEmails(@PathVariable Long id) {
        log.debug("REST request to delete CustomerEmails : {}", id);
        customerEmailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
