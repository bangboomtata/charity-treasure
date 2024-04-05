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
import team.bham.domain.InterestedEvents;
import team.bham.repository.InterestedEventsRepository;

/**
 * Integration tests for the {@link InterestedEventsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InterestedEventsResourceIT {

    private static final String ENTITY_API_URL = "/api/interested-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InterestedEventsRepository interestedEventsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInterestedEventsMockMvc;

    private InterestedEvents interestedEvents;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InterestedEvents createEntity(EntityManager em) {
        InterestedEvents interestedEvents = new InterestedEvents();
        return interestedEvents;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InterestedEvents createUpdatedEntity(EntityManager em) {
        InterestedEvents interestedEvents = new InterestedEvents();
        return interestedEvents;
    }

    @BeforeEach
    public void initTest() {
        interestedEvents = createEntity(em);
    }

    @Test
    @Transactional
    void createInterestedEvents() throws Exception {
        int databaseSizeBeforeCreate = interestedEventsRepository.findAll().size();
        // Create the InterestedEvents
        restInterestedEventsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isCreated());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeCreate + 1);
        InterestedEvents testInterestedEvents = interestedEventsList.get(interestedEventsList.size() - 1);
    }

    @Test
    @Transactional
    void createInterestedEventsWithExistingId() throws Exception {
        // Create the InterestedEvents with an existing ID
        interestedEvents.setId(1L);

        int databaseSizeBeforeCreate = interestedEventsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInterestedEventsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInterestedEvents() throws Exception {
        // Initialize the database
        interestedEventsRepository.saveAndFlush(interestedEvents);

        // Get all the interestedEventsList
        restInterestedEventsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(interestedEvents.getId().intValue())));
    }

    @Test
    @Transactional
    void getInterestedEvents() throws Exception {
        // Initialize the database
        interestedEventsRepository.saveAndFlush(interestedEvents);

        // Get the interestedEvents
        restInterestedEventsMockMvc
            .perform(get(ENTITY_API_URL_ID, interestedEvents.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(interestedEvents.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingInterestedEvents() throws Exception {
        // Get the interestedEvents
        restInterestedEventsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInterestedEvents() throws Exception {
        // Initialize the database
        interestedEventsRepository.saveAndFlush(interestedEvents);

        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();

        // Update the interestedEvents
        InterestedEvents updatedInterestedEvents = interestedEventsRepository.findById(interestedEvents.getId()).get();
        // Disconnect from session so that the updates on updatedInterestedEvents are not directly saved in db
        em.detach(updatedInterestedEvents);

        restInterestedEventsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInterestedEvents.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInterestedEvents))
            )
            .andExpect(status().isOk());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
        InterestedEvents testInterestedEvents = interestedEventsList.get(interestedEventsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingInterestedEvents() throws Exception {
        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();
        interestedEvents.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterestedEventsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, interestedEvents.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInterestedEvents() throws Exception {
        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();
        interestedEvents.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterestedEventsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInterestedEvents() throws Exception {
        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();
        interestedEvents.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterestedEventsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInterestedEventsWithPatch() throws Exception {
        // Initialize the database
        interestedEventsRepository.saveAndFlush(interestedEvents);

        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();

        // Update the interestedEvents using partial update
        InterestedEvents partialUpdatedInterestedEvents = new InterestedEvents();
        partialUpdatedInterestedEvents.setId(interestedEvents.getId());

        restInterestedEventsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterestedEvents.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterestedEvents))
            )
            .andExpect(status().isOk());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
        InterestedEvents testInterestedEvents = interestedEventsList.get(interestedEventsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateInterestedEventsWithPatch() throws Exception {
        // Initialize the database
        interestedEventsRepository.saveAndFlush(interestedEvents);

        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();

        // Update the interestedEvents using partial update
        InterestedEvents partialUpdatedInterestedEvents = new InterestedEvents();
        partialUpdatedInterestedEvents.setId(interestedEvents.getId());

        restInterestedEventsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterestedEvents.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterestedEvents))
            )
            .andExpect(status().isOk());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
        InterestedEvents testInterestedEvents = interestedEventsList.get(interestedEventsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingInterestedEvents() throws Exception {
        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();
        interestedEvents.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterestedEventsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, interestedEvents.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInterestedEvents() throws Exception {
        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();
        interestedEvents.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterestedEventsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isBadRequest());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInterestedEvents() throws Exception {
        int databaseSizeBeforeUpdate = interestedEventsRepository.findAll().size();
        interestedEvents.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterestedEventsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interestedEvents))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InterestedEvents in the database
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInterestedEvents() throws Exception {
        // Initialize the database
        interestedEventsRepository.saveAndFlush(interestedEvents);

        int databaseSizeBeforeDelete = interestedEventsRepository.findAll().size();

        // Delete the interestedEvents
        restInterestedEventsMockMvc
            .perform(delete(ENTITY_API_URL_ID, interestedEvents.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<InterestedEvents> interestedEventsList = interestedEventsRepository.findAll();
        assertThat(interestedEventsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
