package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.Event;
import team.bham.domain.enumeration.Location;
import team.bham.repository.EventRepository;

/**
 * Integration tests for the {@link EventResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventResourceIT {

    private static final String DEFAULT_EVENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_EVENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EVENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_EVENT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_EVENT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_ADDRESS = "BBBBBBBBBB";

    private static final Location DEFAULT_EVENT_LOCATION = Location.SCOTLAND;
    private static final Location UPDATED_EVENT_LOCATION = Location.NORTHEAST;

    private static final String DEFAULT_EVENT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_EVENT_TIME = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_TIME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_EVENT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EVENT_EMAIL = "BBBBBBBBBB";

    private static final byte[] DEFAULT_EVENT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_EVENT_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_EVENT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_EVENT_IMAGE_CONTENT_TYPE = "image/png";

    private static final LocalDate DEFAULT_EVENT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EVENT_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventMockMvc;

    private Event event;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createEntity(EntityManager em) {
        Event event = new Event()
            .eventName(DEFAULT_EVENT_NAME)
            .eventDate(DEFAULT_EVENT_DATE)
            .eventDescription(DEFAULT_EVENT_DESCRIPTION)
            .eventAddress(DEFAULT_EVENT_ADDRESS)
            .eventLocation(DEFAULT_EVENT_LOCATION)
            .eventCity(DEFAULT_EVENT_CITY)
            .eventTime(DEFAULT_EVENT_TIME)
            .contactNumber(DEFAULT_CONTACT_NUMBER)
            .eventEmail(DEFAULT_EVENT_EMAIL)
            .eventImage(DEFAULT_EVENT_IMAGE)
            .eventImageContentType(DEFAULT_EVENT_IMAGE_CONTENT_TYPE)
            .eventEndDate(DEFAULT_EVENT_END_DATE);
        return event;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createUpdatedEntity(EntityManager em) {
        Event event = new Event()
            .eventName(UPDATED_EVENT_NAME)
            .eventDate(UPDATED_EVENT_DATE)
            .eventDescription(UPDATED_EVENT_DESCRIPTION)
            .eventAddress(UPDATED_EVENT_ADDRESS)
            .eventLocation(UPDATED_EVENT_LOCATION)
            .eventCity(UPDATED_EVENT_CITY)
            .eventTime(UPDATED_EVENT_TIME)
            .contactNumber(UPDATED_CONTACT_NUMBER)
            .eventEmail(UPDATED_EVENT_EMAIL)
            .eventImage(UPDATED_EVENT_IMAGE)
            .eventImageContentType(UPDATED_EVENT_IMAGE_CONTENT_TYPE)
            .eventEndDate(UPDATED_EVENT_END_DATE);
        return event;
    }

    @BeforeEach
    public void initTest() {
        event = createEntity(em);
    }

    @Test
    @Transactional
    void createEvent() throws Exception {
        int databaseSizeBeforeCreate = eventRepository.findAll().size();
        // Create the Event
        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isCreated());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeCreate + 1);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getEventName()).isEqualTo(DEFAULT_EVENT_NAME);
        assertThat(testEvent.getEventDate()).isEqualTo(DEFAULT_EVENT_DATE);
        assertThat(testEvent.getEventDescription()).isEqualTo(DEFAULT_EVENT_DESCRIPTION);
        assertThat(testEvent.getEventAddress()).isEqualTo(DEFAULT_EVENT_ADDRESS);
        assertThat(testEvent.getEventLocation()).isEqualTo(DEFAULT_EVENT_LOCATION);
        assertThat(testEvent.getEventCity()).isEqualTo(DEFAULT_EVENT_CITY);
        assertThat(testEvent.getEventTime()).isEqualTo(DEFAULT_EVENT_TIME);
        assertThat(testEvent.getContactNumber()).isEqualTo(DEFAULT_CONTACT_NUMBER);
        assertThat(testEvent.getEventEmail()).isEqualTo(DEFAULT_EVENT_EMAIL);
        assertThat(testEvent.getEventImage()).isEqualTo(DEFAULT_EVENT_IMAGE);
        assertThat(testEvent.getEventImageContentType()).isEqualTo(DEFAULT_EVENT_IMAGE_CONTENT_TYPE);
        assertThat(testEvent.getEventEndDate()).isEqualTo(DEFAULT_EVENT_END_DATE);
    }

    @Test
    @Transactional
    void createEventWithExistingId() throws Exception {
        // Create the Event with an existing ID
        event.setId(1L);

        int databaseSizeBeforeCreate = eventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkEventNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setEventName(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEventDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setEventDate(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEventCityIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setEventCity(null);

        // Create the Event, which fails.

        restEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEvents() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get all the eventList
        restEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(event.getId().intValue())))
            .andExpect(jsonPath("$.[*].eventName").value(hasItem(DEFAULT_EVENT_NAME)))
            .andExpect(jsonPath("$.[*].eventDate").value(hasItem(DEFAULT_EVENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].eventDescription").value(hasItem(DEFAULT_EVENT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].eventAddress").value(hasItem(DEFAULT_EVENT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].eventLocation").value(hasItem(DEFAULT_EVENT_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].eventCity").value(hasItem(DEFAULT_EVENT_CITY)))
            .andExpect(jsonPath("$.[*].eventTime").value(hasItem(DEFAULT_EVENT_TIME)))
            .andExpect(jsonPath("$.[*].contactNumber").value(hasItem(DEFAULT_CONTACT_NUMBER)))
            .andExpect(jsonPath("$.[*].eventEmail").value(hasItem(DEFAULT_EVENT_EMAIL)))
            .andExpect(jsonPath("$.[*].eventImageContentType").value(hasItem(DEFAULT_EVENT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].eventImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_EVENT_IMAGE))))
            .andExpect(jsonPath("$.[*].eventEndDate").value(hasItem(DEFAULT_EVENT_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get the event
        restEventMockMvc
            .perform(get(ENTITY_API_URL_ID, event.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(event.getId().intValue()))
            .andExpect(jsonPath("$.eventName").value(DEFAULT_EVENT_NAME))
            .andExpect(jsonPath("$.eventDate").value(DEFAULT_EVENT_DATE.toString()))
            .andExpect(jsonPath("$.eventDescription").value(DEFAULT_EVENT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.eventAddress").value(DEFAULT_EVENT_ADDRESS.toString()))
            .andExpect(jsonPath("$.eventLocation").value(DEFAULT_EVENT_LOCATION.toString()))
            .andExpect(jsonPath("$.eventCity").value(DEFAULT_EVENT_CITY))
            .andExpect(jsonPath("$.eventTime").value(DEFAULT_EVENT_TIME))
            .andExpect(jsonPath("$.contactNumber").value(DEFAULT_CONTACT_NUMBER))
            .andExpect(jsonPath("$.eventEmail").value(DEFAULT_EVENT_EMAIL))
            .andExpect(jsonPath("$.eventImageContentType").value(DEFAULT_EVENT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.eventImage").value(Base64Utils.encodeToString(DEFAULT_EVENT_IMAGE)))
            .andExpect(jsonPath("$.eventEndDate").value(DEFAULT_EVENT_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEvent() throws Exception {
        // Get the event
        restEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event
        Event updatedEvent = eventRepository.findById(event.getId()).get();
        // Disconnect from session so that the updates on updatedEvent are not directly saved in db
        em.detach(updatedEvent);
        updatedEvent
            .eventName(UPDATED_EVENT_NAME)
            .eventDate(UPDATED_EVENT_DATE)
            .eventDescription(UPDATED_EVENT_DESCRIPTION)
            .eventAddress(UPDATED_EVENT_ADDRESS)
            .eventLocation(UPDATED_EVENT_LOCATION)
            .eventCity(UPDATED_EVENT_CITY)
            .eventTime(UPDATED_EVENT_TIME)
            .contactNumber(UPDATED_CONTACT_NUMBER)
            .eventEmail(UPDATED_EVENT_EMAIL)
            .eventImage(UPDATED_EVENT_IMAGE)
            .eventImageContentType(UPDATED_EVENT_IMAGE_CONTENT_TYPE)
            .eventEndDate(UPDATED_EVENT_END_DATE);

        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testEvent.getEventDate()).isEqualTo(UPDATED_EVENT_DATE);
        assertThat(testEvent.getEventDescription()).isEqualTo(UPDATED_EVENT_DESCRIPTION);
        assertThat(testEvent.getEventAddress()).isEqualTo(UPDATED_EVENT_ADDRESS);
        assertThat(testEvent.getEventLocation()).isEqualTo(UPDATED_EVENT_LOCATION);
        assertThat(testEvent.getEventCity()).isEqualTo(UPDATED_EVENT_CITY);
        assertThat(testEvent.getEventTime()).isEqualTo(UPDATED_EVENT_TIME);
        assertThat(testEvent.getContactNumber()).isEqualTo(UPDATED_CONTACT_NUMBER);
        assertThat(testEvent.getEventEmail()).isEqualTo(UPDATED_EVENT_EMAIL);
        assertThat(testEvent.getEventImage()).isEqualTo(UPDATED_EVENT_IMAGE);
        assertThat(testEvent.getEventImageContentType()).isEqualTo(UPDATED_EVENT_IMAGE_CONTENT_TYPE);
        assertThat(testEvent.getEventEndDate()).isEqualTo(UPDATED_EVENT_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, event.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventWithPatch() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event using partial update
        Event partialUpdatedEvent = new Event();
        partialUpdatedEvent.setId(event.getId());

        partialUpdatedEvent.eventDate(UPDATED_EVENT_DATE).contactNumber(UPDATED_CONTACT_NUMBER);

        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getEventName()).isEqualTo(DEFAULT_EVENT_NAME);
        assertThat(testEvent.getEventDate()).isEqualTo(UPDATED_EVENT_DATE);
        assertThat(testEvent.getEventDescription()).isEqualTo(DEFAULT_EVENT_DESCRIPTION);
        assertThat(testEvent.getEventAddress()).isEqualTo(DEFAULT_EVENT_ADDRESS);
        assertThat(testEvent.getEventLocation()).isEqualTo(DEFAULT_EVENT_LOCATION);
        assertThat(testEvent.getEventCity()).isEqualTo(DEFAULT_EVENT_CITY);
        assertThat(testEvent.getEventTime()).isEqualTo(DEFAULT_EVENT_TIME);
        assertThat(testEvent.getContactNumber()).isEqualTo(UPDATED_CONTACT_NUMBER);
        assertThat(testEvent.getEventEmail()).isEqualTo(DEFAULT_EVENT_EMAIL);
        assertThat(testEvent.getEventImage()).isEqualTo(DEFAULT_EVENT_IMAGE);
        assertThat(testEvent.getEventImageContentType()).isEqualTo(DEFAULT_EVENT_IMAGE_CONTENT_TYPE);
        assertThat(testEvent.getEventEndDate()).isEqualTo(DEFAULT_EVENT_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateEventWithPatch() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event using partial update
        Event partialUpdatedEvent = new Event();
        partialUpdatedEvent.setId(event.getId());

        partialUpdatedEvent
            .eventName(UPDATED_EVENT_NAME)
            .eventDate(UPDATED_EVENT_DATE)
            .eventDescription(UPDATED_EVENT_DESCRIPTION)
            .eventAddress(UPDATED_EVENT_ADDRESS)
            .eventLocation(UPDATED_EVENT_LOCATION)
            .eventCity(UPDATED_EVENT_CITY)
            .eventTime(UPDATED_EVENT_TIME)
            .contactNumber(UPDATED_CONTACT_NUMBER)
            .eventEmail(UPDATED_EVENT_EMAIL)
            .eventImage(UPDATED_EVENT_IMAGE)
            .eventImageContentType(UPDATED_EVENT_IMAGE_CONTENT_TYPE)
            .eventEndDate(UPDATED_EVENT_END_DATE);

        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvent))
            )
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getEventName()).isEqualTo(UPDATED_EVENT_NAME);
        assertThat(testEvent.getEventDate()).isEqualTo(UPDATED_EVENT_DATE);
        assertThat(testEvent.getEventDescription()).isEqualTo(UPDATED_EVENT_DESCRIPTION);
        assertThat(testEvent.getEventAddress()).isEqualTo(UPDATED_EVENT_ADDRESS);
        assertThat(testEvent.getEventLocation()).isEqualTo(UPDATED_EVENT_LOCATION);
        assertThat(testEvent.getEventCity()).isEqualTo(UPDATED_EVENT_CITY);
        assertThat(testEvent.getEventTime()).isEqualTo(UPDATED_EVENT_TIME);
        assertThat(testEvent.getContactNumber()).isEqualTo(UPDATED_CONTACT_NUMBER);
        assertThat(testEvent.getEventEmail()).isEqualTo(UPDATED_EVENT_EMAIL);
        assertThat(testEvent.getEventImage()).isEqualTo(UPDATED_EVENT_IMAGE);
        assertThat(testEvent.getEventImageContentType()).isEqualTo(UPDATED_EVENT_IMAGE_CONTENT_TYPE);
        assertThat(testEvent.getEventEndDate()).isEqualTo(UPDATED_EVENT_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, event.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(event))
            )
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();
        event.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(event)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeDelete = eventRepository.findAll().size();

        // Delete the event
        restEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, event.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
