package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.CustomerEmails;
import team.bham.repository.CustomerEmailsRepository;

/**
 * Integration tests for the {@link CustomerEmailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CustomerEmailsResourceIT {

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/customer-emails";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CustomerEmailsRepository customerEmailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCustomerEmailsMockMvc;

    private CustomerEmails customerEmails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CustomerEmails createEntity(EntityManager em) {
        CustomerEmails customerEmails = new CustomerEmails().email(DEFAULT_EMAIL);
        return customerEmails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CustomerEmails createUpdatedEntity(EntityManager em) {
        CustomerEmails customerEmails = new CustomerEmails().email(UPDATED_EMAIL);
        return customerEmails;
    }

    @BeforeEach
    public void initTest() {
        customerEmails = createEntity(em);
    }

    @Test
    @Transactional
    void createCustomerEmails() throws Exception {
        int databaseSizeBeforeCreate = customerEmailsRepository.findAll().size();
        // Create the CustomerEmails
        restCustomerEmailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customerEmails))
            )
            .andExpect(status().isCreated());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeCreate + 1);
        CustomerEmails testCustomerEmails = customerEmailsList.get(customerEmailsList.size() - 1);
        assertThat(testCustomerEmails.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    void createCustomerEmailsWithExistingId() throws Exception {
        // Create the CustomerEmails with an existing ID
        customerEmails.setId(1L);

        int databaseSizeBeforeCreate = customerEmailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCustomerEmailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customerEmails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCustomerEmails() throws Exception {
        // Initialize the database
        customerEmailsRepository.saveAndFlush(customerEmails);

        // Get all the customerEmailsList
        restCustomerEmailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(customerEmails.getId().intValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }

    @Test
    @Transactional
    void getCustomerEmails() throws Exception {
        // Initialize the database
        customerEmailsRepository.saveAndFlush(customerEmails);

        // Get the customerEmails
        restCustomerEmailsMockMvc
            .perform(get(ENTITY_API_URL_ID, customerEmails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(customerEmails.getId().intValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }

    @Test
    @Transactional
    void getNonExistingCustomerEmails() throws Exception {
        // Get the customerEmails
        restCustomerEmailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCustomerEmails() throws Exception {
        // Initialize the database
        customerEmailsRepository.saveAndFlush(customerEmails);

        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();

        // Update the customerEmails
        CustomerEmails updatedCustomerEmails = customerEmailsRepository.findById(customerEmails.getId()).get();
        // Disconnect from session so that the updates on updatedCustomerEmails are not directly saved in db
        em.detach(updatedCustomerEmails);
        updatedCustomerEmails.email(UPDATED_EMAIL);

        restCustomerEmailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCustomerEmails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCustomerEmails))
            )
            .andExpect(status().isOk());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
        CustomerEmails testCustomerEmails = customerEmailsList.get(customerEmailsList.size() - 1);
        assertThat(testCustomerEmails.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void putNonExistingCustomerEmails() throws Exception {
        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();
        customerEmails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomerEmailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, customerEmails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(customerEmails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCustomerEmails() throws Exception {
        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();
        customerEmails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerEmailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(customerEmails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCustomerEmails() throws Exception {
        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();
        customerEmails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerEmailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(customerEmails)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCustomerEmailsWithPatch() throws Exception {
        // Initialize the database
        customerEmailsRepository.saveAndFlush(customerEmails);

        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();

        // Update the customerEmails using partial update
        CustomerEmails partialUpdatedCustomerEmails = new CustomerEmails();
        partialUpdatedCustomerEmails.setId(customerEmails.getId());

        restCustomerEmailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomerEmails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCustomerEmails))
            )
            .andExpect(status().isOk());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
        CustomerEmails testCustomerEmails = customerEmailsList.get(customerEmailsList.size() - 1);
        assertThat(testCustomerEmails.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    void fullUpdateCustomerEmailsWithPatch() throws Exception {
        // Initialize the database
        customerEmailsRepository.saveAndFlush(customerEmails);

        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();

        // Update the customerEmails using partial update
        CustomerEmails partialUpdatedCustomerEmails = new CustomerEmails();
        partialUpdatedCustomerEmails.setId(customerEmails.getId());

        partialUpdatedCustomerEmails.email(UPDATED_EMAIL);

        restCustomerEmailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomerEmails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCustomerEmails))
            )
            .andExpect(status().isOk());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
        CustomerEmails testCustomerEmails = customerEmailsList.get(customerEmailsList.size() - 1);
        assertThat(testCustomerEmails.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void patchNonExistingCustomerEmails() throws Exception {
        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();
        customerEmails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomerEmailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, customerEmails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(customerEmails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCustomerEmails() throws Exception {
        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();
        customerEmails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerEmailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(customerEmails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCustomerEmails() throws Exception {
        int databaseSizeBeforeUpdate = customerEmailsRepository.findAll().size();
        customerEmails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomerEmailsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(customerEmails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomerEmails in the database
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCustomerEmails() throws Exception {
        // Initialize the database
        customerEmailsRepository.saveAndFlush(customerEmails);

        int databaseSizeBeforeDelete = customerEmailsRepository.findAll().size();

        // Delete the customerEmails
        restCustomerEmailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, customerEmails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CustomerEmails> customerEmailsList = customerEmailsRepository.findAll();
        assertThat(customerEmailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
