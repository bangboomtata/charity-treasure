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
import team.bham.domain.Application;
import team.bham.domain.enumeration.ApplicationStatus;
import team.bham.repository.ApplicationRepository;

/**
 * Integration tests for the {@link ApplicationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ApplicationResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NUM = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NUM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_OF_BIRTH = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_OF_BIRTH = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_COMMITMENT_DURATION = "AAAAAAAAAA";
    private static final String UPDATED_COMMITMENT_DURATION = "BBBBBBBBBB";

    private static final String DEFAULT_VOLUNTEER_EXPERIENCE = "AAAAAAAAAA";
    private static final String UPDATED_VOLUNTEER_EXPERIENCE = "BBBBBBBBBB";

    private static final String DEFAULT_RELEVANT_SKILLS = "AAAAAAAAAA";
    private static final String UPDATED_RELEVANT_SKILLS = "BBBBBBBBBB";

    private static final String DEFAULT_MOTIVATION = "AAAAAAAAAA";
    private static final String UPDATED_MOTIVATION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_APPLICATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_APPLICATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final ApplicationStatus DEFAULT_APPLICATION_STATUS = ApplicationStatus.PENDING;
    private static final ApplicationStatus UPDATED_APPLICATION_STATUS = ApplicationStatus.ACCEPTED;

    private static final Boolean DEFAULT_APPLIED_MONDAY = false;
    private static final Boolean UPDATED_APPLIED_MONDAY = true;

    private static final Boolean DEFAULT_APPLIED_TUESDAY = false;
    private static final Boolean UPDATED_APPLIED_TUESDAY = true;

    private static final Boolean DEFAULT_APPLIED_WEDNESDAY = false;
    private static final Boolean UPDATED_APPLIED_WEDNESDAY = true;

    private static final Boolean DEFAULT_APPLIED_THURSDAY = false;
    private static final Boolean UPDATED_APPLIED_THURSDAY = true;

    private static final Boolean DEFAULT_APPLIED_FRIDAY = false;
    private static final Boolean UPDATED_APPLIED_FRIDAY = true;

    private static final Boolean DEFAULT_APPLIED_SATURDAY = false;
    private static final Boolean UPDATED_APPLIED_SATURDAY = true;

    private static final Boolean DEFAULT_APPLIED_SUNDAY = false;
    private static final Boolean UPDATED_APPLIED_SUNDAY = true;

    private static final Boolean DEFAULT_APPLIED_MORNING = false;
    private static final Boolean UPDATED_APPLIED_MORNING = true;

    private static final Boolean DEFAULT_APPLIED_AFTERNOON = false;
    private static final Boolean UPDATED_APPLIED_AFTERNOON = true;

    private static final Boolean DEFAULT_APPLIED_EVENING = false;
    private static final Boolean UPDATED_APPLIED_EVENING = true;

    private static final String ENTITY_API_URL = "/api/applications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restApplicationMockMvc;

    private Application application;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Application createEntity(EntityManager em) {
        Application application = new Application()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .contactNum(DEFAULT_CONTACT_NUM)
            .email(DEFAULT_EMAIL)
            .dateOfBirth(DEFAULT_DATE_OF_BIRTH)
            .commitmentDuration(DEFAULT_COMMITMENT_DURATION)
            .volunteerExperience(DEFAULT_VOLUNTEER_EXPERIENCE)
            .relevantSkills(DEFAULT_RELEVANT_SKILLS)
            .motivation(DEFAULT_MOTIVATION)
            .applicationDate(DEFAULT_APPLICATION_DATE)
            .applicationStatus(DEFAULT_APPLICATION_STATUS)
            .appliedMonday(DEFAULT_APPLIED_MONDAY)
            .appliedTuesday(DEFAULT_APPLIED_TUESDAY)
            .appliedWednesday(DEFAULT_APPLIED_WEDNESDAY)
            .appliedThursday(DEFAULT_APPLIED_THURSDAY)
            .appliedFriday(DEFAULT_APPLIED_FRIDAY)
            .appliedSaturday(DEFAULT_APPLIED_SATURDAY)
            .appliedSunday(DEFAULT_APPLIED_SUNDAY)
            .appliedMorning(DEFAULT_APPLIED_MORNING)
            .appliedAfternoon(DEFAULT_APPLIED_AFTERNOON)
            .appliedEvening(DEFAULT_APPLIED_EVENING);
        return application;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Application createUpdatedEntity(EntityManager em) {
        Application application = new Application()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .contactNum(UPDATED_CONTACT_NUM)
            .email(UPDATED_EMAIL)
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .commitmentDuration(UPDATED_COMMITMENT_DURATION)
            .volunteerExperience(UPDATED_VOLUNTEER_EXPERIENCE)
            .relevantSkills(UPDATED_RELEVANT_SKILLS)
            .motivation(UPDATED_MOTIVATION)
            .applicationDate(UPDATED_APPLICATION_DATE)
            .applicationStatus(UPDATED_APPLICATION_STATUS)
            .appliedMonday(UPDATED_APPLIED_MONDAY)
            .appliedTuesday(UPDATED_APPLIED_TUESDAY)
            .appliedWednesday(UPDATED_APPLIED_WEDNESDAY)
            .appliedThursday(UPDATED_APPLIED_THURSDAY)
            .appliedFriday(UPDATED_APPLIED_FRIDAY)
            .appliedSaturday(UPDATED_APPLIED_SATURDAY)
            .appliedSunday(UPDATED_APPLIED_SUNDAY)
            .appliedMorning(UPDATED_APPLIED_MORNING)
            .appliedAfternoon(UPDATED_APPLIED_AFTERNOON)
            .appliedEvening(UPDATED_APPLIED_EVENING);
        return application;
    }

    @BeforeEach
    public void initTest() {
        application = createEntity(em);
    }

    @Test
    @Transactional
    void createApplication() throws Exception {
        int databaseSizeBeforeCreate = applicationRepository.findAll().size();
        // Create the Application
        restApplicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isCreated());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeCreate + 1);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testApplication.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testApplication.getContactNum()).isEqualTo(DEFAULT_CONTACT_NUM);
        assertThat(testApplication.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testApplication.getDateOfBirth()).isEqualTo(DEFAULT_DATE_OF_BIRTH);
        assertThat(testApplication.getCommitmentDuration()).isEqualTo(DEFAULT_COMMITMENT_DURATION);
        assertThat(testApplication.getVolunteerExperience()).isEqualTo(DEFAULT_VOLUNTEER_EXPERIENCE);
        assertThat(testApplication.getRelevantSkills()).isEqualTo(DEFAULT_RELEVANT_SKILLS);
        assertThat(testApplication.getMotivation()).isEqualTo(DEFAULT_MOTIVATION);
        assertThat(testApplication.getApplicationDate()).isEqualTo(DEFAULT_APPLICATION_DATE);
        assertThat(testApplication.getApplicationStatus()).isEqualTo(DEFAULT_APPLICATION_STATUS);
        assertThat(testApplication.getAppliedMonday()).isEqualTo(DEFAULT_APPLIED_MONDAY);
        assertThat(testApplication.getAppliedTuesday()).isEqualTo(DEFAULT_APPLIED_TUESDAY);
        assertThat(testApplication.getAppliedWednesday()).isEqualTo(DEFAULT_APPLIED_WEDNESDAY);
        assertThat(testApplication.getAppliedThursday()).isEqualTo(DEFAULT_APPLIED_THURSDAY);
        assertThat(testApplication.getAppliedFriday()).isEqualTo(DEFAULT_APPLIED_FRIDAY);
        assertThat(testApplication.getAppliedSaturday()).isEqualTo(DEFAULT_APPLIED_SATURDAY);
        assertThat(testApplication.getAppliedSunday()).isEqualTo(DEFAULT_APPLIED_SUNDAY);
        assertThat(testApplication.getAppliedMorning()).isEqualTo(DEFAULT_APPLIED_MORNING);
        assertThat(testApplication.getAppliedAfternoon()).isEqualTo(DEFAULT_APPLIED_AFTERNOON);
        assertThat(testApplication.getAppliedEvening()).isEqualTo(DEFAULT_APPLIED_EVENING);
    }

    @Test
    @Transactional
    void createApplicationWithExistingId() throws Exception {
        // Create the Application with an existing ID
        application.setId(1L);

        int databaseSizeBeforeCreate = applicationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restApplicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationRepository.findAll().size();
        // set the field null
        application.setFirstName(null);

        // Create the Application, which fails.

        restApplicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isBadRequest());

        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationRepository.findAll().size();
        // set the field null
        application.setLastName(null);

        // Create the Application, which fails.

        restApplicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isBadRequest());

        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkContactNumIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationRepository.findAll().size();
        // set the field null
        application.setContactNum(null);

        // Create the Application, which fails.

        restApplicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isBadRequest());

        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllApplications() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        // Get all the applicationList
        restApplicationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(application.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].contactNum").value(hasItem(DEFAULT_CONTACT_NUM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].dateOfBirth").value(hasItem(DEFAULT_DATE_OF_BIRTH.toString())))
            .andExpect(jsonPath("$.[*].commitmentDuration").value(hasItem(DEFAULT_COMMITMENT_DURATION)))
            .andExpect(jsonPath("$.[*].volunteerExperience").value(hasItem(DEFAULT_VOLUNTEER_EXPERIENCE)))
            .andExpect(jsonPath("$.[*].relevantSkills").value(hasItem(DEFAULT_RELEVANT_SKILLS.toString())))
            .andExpect(jsonPath("$.[*].motivation").value(hasItem(DEFAULT_MOTIVATION.toString())))
            .andExpect(jsonPath("$.[*].applicationDate").value(hasItem(DEFAULT_APPLICATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].applicationStatus").value(hasItem(DEFAULT_APPLICATION_STATUS.toString())))
            .andExpect(jsonPath("$.[*].appliedMonday").value(hasItem(DEFAULT_APPLIED_MONDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedTuesday").value(hasItem(DEFAULT_APPLIED_TUESDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedWednesday").value(hasItem(DEFAULT_APPLIED_WEDNESDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedThursday").value(hasItem(DEFAULT_APPLIED_THURSDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedFriday").value(hasItem(DEFAULT_APPLIED_FRIDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedSaturday").value(hasItem(DEFAULT_APPLIED_SATURDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedSunday").value(hasItem(DEFAULT_APPLIED_SUNDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedMorning").value(hasItem(DEFAULT_APPLIED_MORNING.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedAfternoon").value(hasItem(DEFAULT_APPLIED_AFTERNOON.booleanValue())))
            .andExpect(jsonPath("$.[*].appliedEvening").value(hasItem(DEFAULT_APPLIED_EVENING.booleanValue())));
    }

    @Test
    @Transactional
    void getApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        // Get the application
        restApplicationMockMvc
            .perform(get(ENTITY_API_URL_ID, application.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(application.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.contactNum").value(DEFAULT_CONTACT_NUM))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.dateOfBirth").value(DEFAULT_DATE_OF_BIRTH.toString()))
            .andExpect(jsonPath("$.commitmentDuration").value(DEFAULT_COMMITMENT_DURATION))
            .andExpect(jsonPath("$.volunteerExperience").value(DEFAULT_VOLUNTEER_EXPERIENCE))
            .andExpect(jsonPath("$.relevantSkills").value(DEFAULT_RELEVANT_SKILLS.toString()))
            .andExpect(jsonPath("$.motivation").value(DEFAULT_MOTIVATION.toString()))
            .andExpect(jsonPath("$.applicationDate").value(DEFAULT_APPLICATION_DATE.toString()))
            .andExpect(jsonPath("$.applicationStatus").value(DEFAULT_APPLICATION_STATUS.toString()))
            .andExpect(jsonPath("$.appliedMonday").value(DEFAULT_APPLIED_MONDAY.booleanValue()))
            .andExpect(jsonPath("$.appliedTuesday").value(DEFAULT_APPLIED_TUESDAY.booleanValue()))
            .andExpect(jsonPath("$.appliedWednesday").value(DEFAULT_APPLIED_WEDNESDAY.booleanValue()))
            .andExpect(jsonPath("$.appliedThursday").value(DEFAULT_APPLIED_THURSDAY.booleanValue()))
            .andExpect(jsonPath("$.appliedFriday").value(DEFAULT_APPLIED_FRIDAY.booleanValue()))
            .andExpect(jsonPath("$.appliedSaturday").value(DEFAULT_APPLIED_SATURDAY.booleanValue()))
            .andExpect(jsonPath("$.appliedSunday").value(DEFAULT_APPLIED_SUNDAY.booleanValue()))
            .andExpect(jsonPath("$.appliedMorning").value(DEFAULT_APPLIED_MORNING.booleanValue()))
            .andExpect(jsonPath("$.appliedAfternoon").value(DEFAULT_APPLIED_AFTERNOON.booleanValue()))
            .andExpect(jsonPath("$.appliedEvening").value(DEFAULT_APPLIED_EVENING.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingApplication() throws Exception {
        // Get the application
        restApplicationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application
        Application updatedApplication = applicationRepository.findById(application.getId()).get();
        // Disconnect from session so that the updates on updatedApplication are not directly saved in db
        em.detach(updatedApplication);
        updatedApplication
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .contactNum(UPDATED_CONTACT_NUM)
            .email(UPDATED_EMAIL)
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .commitmentDuration(UPDATED_COMMITMENT_DURATION)
            .volunteerExperience(UPDATED_VOLUNTEER_EXPERIENCE)
            .relevantSkills(UPDATED_RELEVANT_SKILLS)
            .motivation(UPDATED_MOTIVATION)
            .applicationDate(UPDATED_APPLICATION_DATE)
            .applicationStatus(UPDATED_APPLICATION_STATUS)
            .appliedMonday(UPDATED_APPLIED_MONDAY)
            .appliedTuesday(UPDATED_APPLIED_TUESDAY)
            .appliedWednesday(UPDATED_APPLIED_WEDNESDAY)
            .appliedThursday(UPDATED_APPLIED_THURSDAY)
            .appliedFriday(UPDATED_APPLIED_FRIDAY)
            .appliedSaturday(UPDATED_APPLIED_SATURDAY)
            .appliedSunday(UPDATED_APPLIED_SUNDAY)
            .appliedMorning(UPDATED_APPLIED_MORNING)
            .appliedAfternoon(UPDATED_APPLIED_AFTERNOON)
            .appliedEvening(UPDATED_APPLIED_EVENING);

        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedApplication.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testApplication.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testApplication.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testApplication.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testApplication.getDateOfBirth()).isEqualTo(UPDATED_DATE_OF_BIRTH);
        assertThat(testApplication.getCommitmentDuration()).isEqualTo(UPDATED_COMMITMENT_DURATION);
        assertThat(testApplication.getVolunteerExperience()).isEqualTo(UPDATED_VOLUNTEER_EXPERIENCE);
        assertThat(testApplication.getRelevantSkills()).isEqualTo(UPDATED_RELEVANT_SKILLS);
        assertThat(testApplication.getMotivation()).isEqualTo(UPDATED_MOTIVATION);
        assertThat(testApplication.getApplicationDate()).isEqualTo(UPDATED_APPLICATION_DATE);
        assertThat(testApplication.getApplicationStatus()).isEqualTo(UPDATED_APPLICATION_STATUS);
        assertThat(testApplication.getAppliedMonday()).isEqualTo(UPDATED_APPLIED_MONDAY);
        assertThat(testApplication.getAppliedTuesday()).isEqualTo(UPDATED_APPLIED_TUESDAY);
        assertThat(testApplication.getAppliedWednesday()).isEqualTo(UPDATED_APPLIED_WEDNESDAY);
        assertThat(testApplication.getAppliedThursday()).isEqualTo(UPDATED_APPLIED_THURSDAY);
        assertThat(testApplication.getAppliedFriday()).isEqualTo(UPDATED_APPLIED_FRIDAY);
        assertThat(testApplication.getAppliedSaturday()).isEqualTo(UPDATED_APPLIED_SATURDAY);
        assertThat(testApplication.getAppliedSunday()).isEqualTo(UPDATED_APPLIED_SUNDAY);
        assertThat(testApplication.getAppliedMorning()).isEqualTo(UPDATED_APPLIED_MORNING);
        assertThat(testApplication.getAppliedAfternoon()).isEqualTo(UPDATED_APPLIED_AFTERNOON);
        assertThat(testApplication.getAppliedEvening()).isEqualTo(UPDATED_APPLIED_EVENING);
    }

    @Test
    @Transactional
    void putNonExistingApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, application.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(application)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateApplicationWithPatch() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application using partial update
        Application partialUpdatedApplication = new Application();
        partialUpdatedApplication.setId(application.getId());

        partialUpdatedApplication
            .lastName(UPDATED_LAST_NAME)
            .volunteerExperience(UPDATED_VOLUNTEER_EXPERIENCE)
            .applicationDate(UPDATED_APPLICATION_DATE)
            .appliedMonday(UPDATED_APPLIED_MONDAY)
            .appliedTuesday(UPDATED_APPLIED_TUESDAY)
            .appliedFriday(UPDATED_APPLIED_FRIDAY)
            .appliedSaturday(UPDATED_APPLIED_SATURDAY)
            .appliedSunday(UPDATED_APPLIED_SUNDAY)
            .appliedEvening(UPDATED_APPLIED_EVENING);

        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testApplication.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testApplication.getContactNum()).isEqualTo(DEFAULT_CONTACT_NUM);
        assertThat(testApplication.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testApplication.getDateOfBirth()).isEqualTo(DEFAULT_DATE_OF_BIRTH);
        assertThat(testApplication.getCommitmentDuration()).isEqualTo(DEFAULT_COMMITMENT_DURATION);
        assertThat(testApplication.getVolunteerExperience()).isEqualTo(UPDATED_VOLUNTEER_EXPERIENCE);
        assertThat(testApplication.getRelevantSkills()).isEqualTo(DEFAULT_RELEVANT_SKILLS);
        assertThat(testApplication.getMotivation()).isEqualTo(DEFAULT_MOTIVATION);
        assertThat(testApplication.getApplicationDate()).isEqualTo(UPDATED_APPLICATION_DATE);
        assertThat(testApplication.getApplicationStatus()).isEqualTo(DEFAULT_APPLICATION_STATUS);
        assertThat(testApplication.getAppliedMonday()).isEqualTo(UPDATED_APPLIED_MONDAY);
        assertThat(testApplication.getAppliedTuesday()).isEqualTo(UPDATED_APPLIED_TUESDAY);
        assertThat(testApplication.getAppliedWednesday()).isEqualTo(DEFAULT_APPLIED_WEDNESDAY);
        assertThat(testApplication.getAppliedThursday()).isEqualTo(DEFAULT_APPLIED_THURSDAY);
        assertThat(testApplication.getAppliedFriday()).isEqualTo(UPDATED_APPLIED_FRIDAY);
        assertThat(testApplication.getAppliedSaturday()).isEqualTo(UPDATED_APPLIED_SATURDAY);
        assertThat(testApplication.getAppliedSunday()).isEqualTo(UPDATED_APPLIED_SUNDAY);
        assertThat(testApplication.getAppliedMorning()).isEqualTo(DEFAULT_APPLIED_MORNING);
        assertThat(testApplication.getAppliedAfternoon()).isEqualTo(DEFAULT_APPLIED_AFTERNOON);
        assertThat(testApplication.getAppliedEvening()).isEqualTo(UPDATED_APPLIED_EVENING);
    }

    @Test
    @Transactional
    void fullUpdateApplicationWithPatch() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();

        // Update the application using partial update
        Application partialUpdatedApplication = new Application();
        partialUpdatedApplication.setId(application.getId());

        partialUpdatedApplication
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .contactNum(UPDATED_CONTACT_NUM)
            .email(UPDATED_EMAIL)
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .commitmentDuration(UPDATED_COMMITMENT_DURATION)
            .volunteerExperience(UPDATED_VOLUNTEER_EXPERIENCE)
            .relevantSkills(UPDATED_RELEVANT_SKILLS)
            .motivation(UPDATED_MOTIVATION)
            .applicationDate(UPDATED_APPLICATION_DATE)
            .applicationStatus(UPDATED_APPLICATION_STATUS)
            .appliedMonday(UPDATED_APPLIED_MONDAY)
            .appliedTuesday(UPDATED_APPLIED_TUESDAY)
            .appliedWednesday(UPDATED_APPLIED_WEDNESDAY)
            .appliedThursday(UPDATED_APPLIED_THURSDAY)
            .appliedFriday(UPDATED_APPLIED_FRIDAY)
            .appliedSaturday(UPDATED_APPLIED_SATURDAY)
            .appliedSunday(UPDATED_APPLIED_SUNDAY)
            .appliedMorning(UPDATED_APPLIED_MORNING)
            .appliedAfternoon(UPDATED_APPLIED_AFTERNOON)
            .appliedEvening(UPDATED_APPLIED_EVENING);

        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedApplication.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedApplication))
            )
            .andExpect(status().isOk());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
        Application testApplication = applicationList.get(applicationList.size() - 1);
        assertThat(testApplication.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testApplication.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testApplication.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testApplication.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testApplication.getDateOfBirth()).isEqualTo(UPDATED_DATE_OF_BIRTH);
        assertThat(testApplication.getCommitmentDuration()).isEqualTo(UPDATED_COMMITMENT_DURATION);
        assertThat(testApplication.getVolunteerExperience()).isEqualTo(UPDATED_VOLUNTEER_EXPERIENCE);
        assertThat(testApplication.getRelevantSkills()).isEqualTo(UPDATED_RELEVANT_SKILLS);
        assertThat(testApplication.getMotivation()).isEqualTo(UPDATED_MOTIVATION);
        assertThat(testApplication.getApplicationDate()).isEqualTo(UPDATED_APPLICATION_DATE);
        assertThat(testApplication.getApplicationStatus()).isEqualTo(UPDATED_APPLICATION_STATUS);
        assertThat(testApplication.getAppliedMonday()).isEqualTo(UPDATED_APPLIED_MONDAY);
        assertThat(testApplication.getAppliedTuesday()).isEqualTo(UPDATED_APPLIED_TUESDAY);
        assertThat(testApplication.getAppliedWednesday()).isEqualTo(UPDATED_APPLIED_WEDNESDAY);
        assertThat(testApplication.getAppliedThursday()).isEqualTo(UPDATED_APPLIED_THURSDAY);
        assertThat(testApplication.getAppliedFriday()).isEqualTo(UPDATED_APPLIED_FRIDAY);
        assertThat(testApplication.getAppliedSaturday()).isEqualTo(UPDATED_APPLIED_SATURDAY);
        assertThat(testApplication.getAppliedSunday()).isEqualTo(UPDATED_APPLIED_SUNDAY);
        assertThat(testApplication.getAppliedMorning()).isEqualTo(UPDATED_APPLIED_MORNING);
        assertThat(testApplication.getAppliedAfternoon()).isEqualTo(UPDATED_APPLIED_AFTERNOON);
        assertThat(testApplication.getAppliedEvening()).isEqualTo(UPDATED_APPLIED_EVENING);
    }

    @Test
    @Transactional
    void patchNonExistingApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, application.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isBadRequest());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamApplication() throws Exception {
        int databaseSizeBeforeUpdate = applicationRepository.findAll().size();
        application.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restApplicationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(application))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Application in the database
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteApplication() throws Exception {
        // Initialize the database
        applicationRepository.saveAndFlush(application);

        int databaseSizeBeforeDelete = applicationRepository.findAll().size();

        // Delete the application
        restApplicationMockMvc
            .perform(delete(ENTITY_API_URL_ID, application.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Application> applicationList = applicationRepository.findAll();
        assertThat(applicationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
