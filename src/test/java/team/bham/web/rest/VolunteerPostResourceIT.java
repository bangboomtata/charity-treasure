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
import team.bham.domain.VolunteerPost;
import team.bham.domain.enumeration.ActiveStatus;
import team.bham.repository.VolunteerPostRepository;

/**
 * Integration tests for the {@link VolunteerPostResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VolunteerPostResourceIT {

    private static final String DEFAULT_POST_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_POST_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NUM = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NUM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_ABOUT_US = "AAAAAAAAAA";
    private static final String UPDATED_ABOUT_US = "BBBBBBBBBB";

    private static final String DEFAULT_ABOUT_ROLE = "AAAAAAAAAA";
    private static final String UPDATED_ABOUT_ROLE = "BBBBBBBBBB";

    private static final String DEFAULT_BENEFITS = "AAAAAAAAAA";
    private static final String UPDATED_BENEFITS = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMG = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMG = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMG_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMG_CONTENT_TYPE = "image/png";

    private static final ActiveStatus DEFAULT_ACTIVE_STATUS = ActiveStatus.ACTIVE;
    private static final ActiveStatus UPDATED_ACTIVE_STATUS = ActiveStatus.EXPIRED;

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_MONDAY = false;
    private static final Boolean UPDATED_MONDAY = true;

    private static final Boolean DEFAULT_TUESDAY = false;
    private static final Boolean UPDATED_TUESDAY = true;

    private static final Boolean DEFAULT_WEDNESDAY = false;
    private static final Boolean UPDATED_WEDNESDAY = true;

    private static final Boolean DEFAULT_THURSDAY = false;
    private static final Boolean UPDATED_THURSDAY = true;

    private static final Boolean DEFAULT_FRIDAY = false;
    private static final Boolean UPDATED_FRIDAY = true;

    private static final Boolean DEFAULT_SATURDAY = false;
    private static final Boolean UPDATED_SATURDAY = true;

    private static final Boolean DEFAULT_SUNDAY = false;
    private static final Boolean UPDATED_SUNDAY = true;

    private static final Boolean DEFAULT_MORNING = false;
    private static final Boolean UPDATED_MORNING = true;

    private static final Boolean DEFAULT_AFTERNOON = false;
    private static final Boolean UPDATED_AFTERNOON = true;

    private static final Boolean DEFAULT_EVENING = false;
    private static final Boolean UPDATED_EVENING = true;

    private static final String ENTITY_API_URL = "/api/volunteer-posts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VolunteerPostRepository volunteerPostRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVolunteerPostMockMvc;

    private VolunteerPost volunteerPost;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VolunteerPost createEntity(EntityManager em) {
        VolunteerPost volunteerPost = new VolunteerPost()
            .postTitle(DEFAULT_POST_TITLE)
            .locationAddress(DEFAULT_LOCATION_ADDRESS)
            .contactNum(DEFAULT_CONTACT_NUM)
            .email(DEFAULT_EMAIL)
            .aboutUs(DEFAULT_ABOUT_US)
            .aboutRole(DEFAULT_ABOUT_ROLE)
            .benefits(DEFAULT_BENEFITS)
            .img(DEFAULT_IMG)
            .imgContentType(DEFAULT_IMG_CONTENT_TYPE)
            .activeStatus(DEFAULT_ACTIVE_STATUS)
            .startDate(DEFAULT_START_DATE)
            .monday(DEFAULT_MONDAY)
            .tuesday(DEFAULT_TUESDAY)
            .wednesday(DEFAULT_WEDNESDAY)
            .thursday(DEFAULT_THURSDAY)
            .friday(DEFAULT_FRIDAY)
            .saturday(DEFAULT_SATURDAY)
            .sunday(DEFAULT_SUNDAY)
            .morning(DEFAULT_MORNING)
            .afternoon(DEFAULT_AFTERNOON)
            .evening(DEFAULT_EVENING);
        return volunteerPost;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VolunteerPost createUpdatedEntity(EntityManager em) {
        VolunteerPost volunteerPost = new VolunteerPost()
            .postTitle(UPDATED_POST_TITLE)
            .locationAddress(UPDATED_LOCATION_ADDRESS)
            .contactNum(UPDATED_CONTACT_NUM)
            .email(UPDATED_EMAIL)
            .aboutUs(UPDATED_ABOUT_US)
            .aboutRole(UPDATED_ABOUT_ROLE)
            .benefits(UPDATED_BENEFITS)
            .img(UPDATED_IMG)
            .imgContentType(UPDATED_IMG_CONTENT_TYPE)
            .activeStatus(UPDATED_ACTIVE_STATUS)
            .startDate(UPDATED_START_DATE)
            .monday(UPDATED_MONDAY)
            .tuesday(UPDATED_TUESDAY)
            .wednesday(UPDATED_WEDNESDAY)
            .thursday(UPDATED_THURSDAY)
            .friday(UPDATED_FRIDAY)
            .saturday(UPDATED_SATURDAY)
            .sunday(UPDATED_SUNDAY)
            .morning(UPDATED_MORNING)
            .afternoon(UPDATED_AFTERNOON)
            .evening(UPDATED_EVENING);
        return volunteerPost;
    }

    @BeforeEach
    public void initTest() {
        volunteerPost = createEntity(em);
    }

    @Test
    @Transactional
    void createVolunteerPost() throws Exception {
        int databaseSizeBeforeCreate = volunteerPostRepository.findAll().size();
        // Create the VolunteerPost
        restVolunteerPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(volunteerPost)))
            .andExpect(status().isCreated());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeCreate + 1);
        VolunteerPost testVolunteerPost = volunteerPostList.get(volunteerPostList.size() - 1);
        assertThat(testVolunteerPost.getPostTitle()).isEqualTo(DEFAULT_POST_TITLE);
        assertThat(testVolunteerPost.getLocationAddress()).isEqualTo(DEFAULT_LOCATION_ADDRESS);
        assertThat(testVolunteerPost.getContactNum()).isEqualTo(DEFAULT_CONTACT_NUM);
        assertThat(testVolunteerPost.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testVolunteerPost.getAboutUs()).isEqualTo(DEFAULT_ABOUT_US);
        assertThat(testVolunteerPost.getAboutRole()).isEqualTo(DEFAULT_ABOUT_ROLE);
        assertThat(testVolunteerPost.getBenefits()).isEqualTo(DEFAULT_BENEFITS);
        assertThat(testVolunteerPost.getImg()).isEqualTo(DEFAULT_IMG);
        assertThat(testVolunteerPost.getImgContentType()).isEqualTo(DEFAULT_IMG_CONTENT_TYPE);
        assertThat(testVolunteerPost.getActiveStatus()).isEqualTo(DEFAULT_ACTIVE_STATUS);
        assertThat(testVolunteerPost.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testVolunteerPost.getMonday()).isEqualTo(DEFAULT_MONDAY);
        assertThat(testVolunteerPost.getTuesday()).isEqualTo(DEFAULT_TUESDAY);
        assertThat(testVolunteerPost.getWednesday()).isEqualTo(DEFAULT_WEDNESDAY);
        assertThat(testVolunteerPost.getThursday()).isEqualTo(DEFAULT_THURSDAY);
        assertThat(testVolunteerPost.getFriday()).isEqualTo(DEFAULT_FRIDAY);
        assertThat(testVolunteerPost.getSaturday()).isEqualTo(DEFAULT_SATURDAY);
        assertThat(testVolunteerPost.getSunday()).isEqualTo(DEFAULT_SUNDAY);
        assertThat(testVolunteerPost.getMorning()).isEqualTo(DEFAULT_MORNING);
        assertThat(testVolunteerPost.getAfternoon()).isEqualTo(DEFAULT_AFTERNOON);
        assertThat(testVolunteerPost.getEvening()).isEqualTo(DEFAULT_EVENING);
    }

    @Test
    @Transactional
    void createVolunteerPostWithExistingId() throws Exception {
        // Create the VolunteerPost with an existing ID
        volunteerPost.setId(1L);

        int databaseSizeBeforeCreate = volunteerPostRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVolunteerPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(volunteerPost)))
            .andExpect(status().isBadRequest());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPostTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = volunteerPostRepository.findAll().size();
        // set the field null
        volunteerPost.setPostTitle(null);

        // Create the VolunteerPost, which fails.

        restVolunteerPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(volunteerPost)))
            .andExpect(status().isBadRequest());

        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVolunteerPosts() throws Exception {
        // Initialize the database
        volunteerPostRepository.saveAndFlush(volunteerPost);

        // Get all the volunteerPostList
        restVolunteerPostMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(volunteerPost.getId().intValue())))
            .andExpect(jsonPath("$.[*].postTitle").value(hasItem(DEFAULT_POST_TITLE)))
            .andExpect(jsonPath("$.[*].locationAddress").value(hasItem(DEFAULT_LOCATION_ADDRESS)))
            .andExpect(jsonPath("$.[*].contactNum").value(hasItem(DEFAULT_CONTACT_NUM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].aboutUs").value(hasItem(DEFAULT_ABOUT_US.toString())))
            .andExpect(jsonPath("$.[*].aboutRole").value(hasItem(DEFAULT_ABOUT_ROLE.toString())))
            .andExpect(jsonPath("$.[*].benefits").value(hasItem(DEFAULT_BENEFITS.toString())))
            .andExpect(jsonPath("$.[*].imgContentType").value(hasItem(DEFAULT_IMG_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].img").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMG))))
            .andExpect(jsonPath("$.[*].activeStatus").value(hasItem(DEFAULT_ACTIVE_STATUS.toString())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].monday").value(hasItem(DEFAULT_MONDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].tuesday").value(hasItem(DEFAULT_TUESDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].wednesday").value(hasItem(DEFAULT_WEDNESDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].thursday").value(hasItem(DEFAULT_THURSDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].friday").value(hasItem(DEFAULT_FRIDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].saturday").value(hasItem(DEFAULT_SATURDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].sunday").value(hasItem(DEFAULT_SUNDAY.booleanValue())))
            .andExpect(jsonPath("$.[*].morning").value(hasItem(DEFAULT_MORNING.booleanValue())))
            .andExpect(jsonPath("$.[*].afternoon").value(hasItem(DEFAULT_AFTERNOON.booleanValue())))
            .andExpect(jsonPath("$.[*].evening").value(hasItem(DEFAULT_EVENING.booleanValue())));
    }

    @Test
    @Transactional
    void getVolunteerPost() throws Exception {
        // Initialize the database
        volunteerPostRepository.saveAndFlush(volunteerPost);

        // Get the volunteerPost
        restVolunteerPostMockMvc
            .perform(get(ENTITY_API_URL_ID, volunteerPost.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(volunteerPost.getId().intValue()))
            .andExpect(jsonPath("$.postTitle").value(DEFAULT_POST_TITLE))
            .andExpect(jsonPath("$.locationAddress").value(DEFAULT_LOCATION_ADDRESS))
            .andExpect(jsonPath("$.contactNum").value(DEFAULT_CONTACT_NUM))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.aboutUs").value(DEFAULT_ABOUT_US.toString()))
            .andExpect(jsonPath("$.aboutRole").value(DEFAULT_ABOUT_ROLE.toString()))
            .andExpect(jsonPath("$.benefits").value(DEFAULT_BENEFITS.toString()))
            .andExpect(jsonPath("$.imgContentType").value(DEFAULT_IMG_CONTENT_TYPE))
            .andExpect(jsonPath("$.img").value(Base64Utils.encodeToString(DEFAULT_IMG)))
            .andExpect(jsonPath("$.activeStatus").value(DEFAULT_ACTIVE_STATUS.toString()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.monday").value(DEFAULT_MONDAY.booleanValue()))
            .andExpect(jsonPath("$.tuesday").value(DEFAULT_TUESDAY.booleanValue()))
            .andExpect(jsonPath("$.wednesday").value(DEFAULT_WEDNESDAY.booleanValue()))
            .andExpect(jsonPath("$.thursday").value(DEFAULT_THURSDAY.booleanValue()))
            .andExpect(jsonPath("$.friday").value(DEFAULT_FRIDAY.booleanValue()))
            .andExpect(jsonPath("$.saturday").value(DEFAULT_SATURDAY.booleanValue()))
            .andExpect(jsonPath("$.sunday").value(DEFAULT_SUNDAY.booleanValue()))
            .andExpect(jsonPath("$.morning").value(DEFAULT_MORNING.booleanValue()))
            .andExpect(jsonPath("$.afternoon").value(DEFAULT_AFTERNOON.booleanValue()))
            .andExpect(jsonPath("$.evening").value(DEFAULT_EVENING.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingVolunteerPost() throws Exception {
        // Get the volunteerPost
        restVolunteerPostMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVolunteerPost() throws Exception {
        // Initialize the database
        volunteerPostRepository.saveAndFlush(volunteerPost);

        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();

        // Update the volunteerPost
        VolunteerPost updatedVolunteerPost = volunteerPostRepository.findById(volunteerPost.getId()).get();
        // Disconnect from session so that the updates on updatedVolunteerPost are not directly saved in db
        em.detach(updatedVolunteerPost);
        updatedVolunteerPost
            .postTitle(UPDATED_POST_TITLE)
            .locationAddress(UPDATED_LOCATION_ADDRESS)
            .contactNum(UPDATED_CONTACT_NUM)
            .email(UPDATED_EMAIL)
            .aboutUs(UPDATED_ABOUT_US)
            .aboutRole(UPDATED_ABOUT_ROLE)
            .benefits(UPDATED_BENEFITS)
            .img(UPDATED_IMG)
            .imgContentType(UPDATED_IMG_CONTENT_TYPE)
            .activeStatus(UPDATED_ACTIVE_STATUS)
            .startDate(UPDATED_START_DATE)
            .monday(UPDATED_MONDAY)
            .tuesday(UPDATED_TUESDAY)
            .wednesday(UPDATED_WEDNESDAY)
            .thursday(UPDATED_THURSDAY)
            .friday(UPDATED_FRIDAY)
            .saturday(UPDATED_SATURDAY)
            .sunday(UPDATED_SUNDAY)
            .morning(UPDATED_MORNING)
            .afternoon(UPDATED_AFTERNOON)
            .evening(UPDATED_EVENING);

        restVolunteerPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVolunteerPost.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVolunteerPost))
            )
            .andExpect(status().isOk());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
        VolunteerPost testVolunteerPost = volunteerPostList.get(volunteerPostList.size() - 1);
        assertThat(testVolunteerPost.getPostTitle()).isEqualTo(UPDATED_POST_TITLE);
        assertThat(testVolunteerPost.getLocationAddress()).isEqualTo(UPDATED_LOCATION_ADDRESS);
        assertThat(testVolunteerPost.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testVolunteerPost.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVolunteerPost.getAboutUs()).isEqualTo(UPDATED_ABOUT_US);
        assertThat(testVolunteerPost.getAboutRole()).isEqualTo(UPDATED_ABOUT_ROLE);
        assertThat(testVolunteerPost.getBenefits()).isEqualTo(UPDATED_BENEFITS);
        assertThat(testVolunteerPost.getImg()).isEqualTo(UPDATED_IMG);
        assertThat(testVolunteerPost.getImgContentType()).isEqualTo(UPDATED_IMG_CONTENT_TYPE);
        assertThat(testVolunteerPost.getActiveStatus()).isEqualTo(UPDATED_ACTIVE_STATUS);
        assertThat(testVolunteerPost.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testVolunteerPost.getMonday()).isEqualTo(UPDATED_MONDAY);
        assertThat(testVolunteerPost.getTuesday()).isEqualTo(UPDATED_TUESDAY);
        assertThat(testVolunteerPost.getWednesday()).isEqualTo(UPDATED_WEDNESDAY);
        assertThat(testVolunteerPost.getThursday()).isEqualTo(UPDATED_THURSDAY);
        assertThat(testVolunteerPost.getFriday()).isEqualTo(UPDATED_FRIDAY);
        assertThat(testVolunteerPost.getSaturday()).isEqualTo(UPDATED_SATURDAY);
        assertThat(testVolunteerPost.getSunday()).isEqualTo(UPDATED_SUNDAY);
        assertThat(testVolunteerPost.getMorning()).isEqualTo(UPDATED_MORNING);
        assertThat(testVolunteerPost.getAfternoon()).isEqualTo(UPDATED_AFTERNOON);
        assertThat(testVolunteerPost.getEvening()).isEqualTo(UPDATED_EVENING);
    }

    @Test
    @Transactional
    void putNonExistingVolunteerPost() throws Exception {
        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();
        volunteerPost.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVolunteerPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, volunteerPost.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(volunteerPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVolunteerPost() throws Exception {
        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();
        volunteerPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(volunteerPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVolunteerPost() throws Exception {
        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();
        volunteerPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerPostMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(volunteerPost)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVolunteerPostWithPatch() throws Exception {
        // Initialize the database
        volunteerPostRepository.saveAndFlush(volunteerPost);

        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();

        // Update the volunteerPost using partial update
        VolunteerPost partialUpdatedVolunteerPost = new VolunteerPost();
        partialUpdatedVolunteerPost.setId(volunteerPost.getId());

        partialUpdatedVolunteerPost
            .postTitle(UPDATED_POST_TITLE)
            .contactNum(UPDATED_CONTACT_NUM)
            .benefits(UPDATED_BENEFITS)
            .activeStatus(UPDATED_ACTIVE_STATUS)
            .morning(UPDATED_MORNING)
            .afternoon(UPDATED_AFTERNOON);

        restVolunteerPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVolunteerPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVolunteerPost))
            )
            .andExpect(status().isOk());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
        VolunteerPost testVolunteerPost = volunteerPostList.get(volunteerPostList.size() - 1);
        assertThat(testVolunteerPost.getPostTitle()).isEqualTo(UPDATED_POST_TITLE);
        assertThat(testVolunteerPost.getLocationAddress()).isEqualTo(DEFAULT_LOCATION_ADDRESS);
        assertThat(testVolunteerPost.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testVolunteerPost.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testVolunteerPost.getAboutUs()).isEqualTo(DEFAULT_ABOUT_US);
        assertThat(testVolunteerPost.getAboutRole()).isEqualTo(DEFAULT_ABOUT_ROLE);
        assertThat(testVolunteerPost.getBenefits()).isEqualTo(UPDATED_BENEFITS);
        assertThat(testVolunteerPost.getImg()).isEqualTo(DEFAULT_IMG);
        assertThat(testVolunteerPost.getImgContentType()).isEqualTo(DEFAULT_IMG_CONTENT_TYPE);
        assertThat(testVolunteerPost.getActiveStatus()).isEqualTo(UPDATED_ACTIVE_STATUS);
        assertThat(testVolunteerPost.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testVolunteerPost.getMonday()).isEqualTo(DEFAULT_MONDAY);
        assertThat(testVolunteerPost.getTuesday()).isEqualTo(DEFAULT_TUESDAY);
        assertThat(testVolunteerPost.getWednesday()).isEqualTo(DEFAULT_WEDNESDAY);
        assertThat(testVolunteerPost.getThursday()).isEqualTo(DEFAULT_THURSDAY);
        assertThat(testVolunteerPost.getFriday()).isEqualTo(DEFAULT_FRIDAY);
        assertThat(testVolunteerPost.getSaturday()).isEqualTo(DEFAULT_SATURDAY);
        assertThat(testVolunteerPost.getSunday()).isEqualTo(DEFAULT_SUNDAY);
        assertThat(testVolunteerPost.getMorning()).isEqualTo(UPDATED_MORNING);
        assertThat(testVolunteerPost.getAfternoon()).isEqualTo(UPDATED_AFTERNOON);
        assertThat(testVolunteerPost.getEvening()).isEqualTo(DEFAULT_EVENING);
    }

    @Test
    @Transactional
    void fullUpdateVolunteerPostWithPatch() throws Exception {
        // Initialize the database
        volunteerPostRepository.saveAndFlush(volunteerPost);

        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();

        // Update the volunteerPost using partial update
        VolunteerPost partialUpdatedVolunteerPost = new VolunteerPost();
        partialUpdatedVolunteerPost.setId(volunteerPost.getId());

        partialUpdatedVolunteerPost
            .postTitle(UPDATED_POST_TITLE)
            .locationAddress(UPDATED_LOCATION_ADDRESS)
            .contactNum(UPDATED_CONTACT_NUM)
            .email(UPDATED_EMAIL)
            .aboutUs(UPDATED_ABOUT_US)
            .aboutRole(UPDATED_ABOUT_ROLE)
            .benefits(UPDATED_BENEFITS)
            .img(UPDATED_IMG)
            .imgContentType(UPDATED_IMG_CONTENT_TYPE)
            .activeStatus(UPDATED_ACTIVE_STATUS)
            .startDate(UPDATED_START_DATE)
            .monday(UPDATED_MONDAY)
            .tuesday(UPDATED_TUESDAY)
            .wednesday(UPDATED_WEDNESDAY)
            .thursday(UPDATED_THURSDAY)
            .friday(UPDATED_FRIDAY)
            .saturday(UPDATED_SATURDAY)
            .sunday(UPDATED_SUNDAY)
            .morning(UPDATED_MORNING)
            .afternoon(UPDATED_AFTERNOON)
            .evening(UPDATED_EVENING);

        restVolunteerPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVolunteerPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVolunteerPost))
            )
            .andExpect(status().isOk());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
        VolunteerPost testVolunteerPost = volunteerPostList.get(volunteerPostList.size() - 1);
        assertThat(testVolunteerPost.getPostTitle()).isEqualTo(UPDATED_POST_TITLE);
        assertThat(testVolunteerPost.getLocationAddress()).isEqualTo(UPDATED_LOCATION_ADDRESS);
        assertThat(testVolunteerPost.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testVolunteerPost.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVolunteerPost.getAboutUs()).isEqualTo(UPDATED_ABOUT_US);
        assertThat(testVolunteerPost.getAboutRole()).isEqualTo(UPDATED_ABOUT_ROLE);
        assertThat(testVolunteerPost.getBenefits()).isEqualTo(UPDATED_BENEFITS);
        assertThat(testVolunteerPost.getImg()).isEqualTo(UPDATED_IMG);
        assertThat(testVolunteerPost.getImgContentType()).isEqualTo(UPDATED_IMG_CONTENT_TYPE);
        assertThat(testVolunteerPost.getActiveStatus()).isEqualTo(UPDATED_ACTIVE_STATUS);
        assertThat(testVolunteerPost.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testVolunteerPost.getMonday()).isEqualTo(UPDATED_MONDAY);
        assertThat(testVolunteerPost.getTuesday()).isEqualTo(UPDATED_TUESDAY);
        assertThat(testVolunteerPost.getWednesday()).isEqualTo(UPDATED_WEDNESDAY);
        assertThat(testVolunteerPost.getThursday()).isEqualTo(UPDATED_THURSDAY);
        assertThat(testVolunteerPost.getFriday()).isEqualTo(UPDATED_FRIDAY);
        assertThat(testVolunteerPost.getSaturday()).isEqualTo(UPDATED_SATURDAY);
        assertThat(testVolunteerPost.getSunday()).isEqualTo(UPDATED_SUNDAY);
        assertThat(testVolunteerPost.getMorning()).isEqualTo(UPDATED_MORNING);
        assertThat(testVolunteerPost.getAfternoon()).isEqualTo(UPDATED_AFTERNOON);
        assertThat(testVolunteerPost.getEvening()).isEqualTo(UPDATED_EVENING);
    }

    @Test
    @Transactional
    void patchNonExistingVolunteerPost() throws Exception {
        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();
        volunteerPost.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVolunteerPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, volunteerPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(volunteerPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVolunteerPost() throws Exception {
        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();
        volunteerPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(volunteerPost))
            )
            .andExpect(status().isBadRequest());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVolunteerPost() throws Exception {
        int databaseSizeBeforeUpdate = volunteerPostRepository.findAll().size();
        volunteerPost.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolunteerPostMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(volunteerPost))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VolunteerPost in the database
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVolunteerPost() throws Exception {
        // Initialize the database
        volunteerPostRepository.saveAndFlush(volunteerPost);

        int databaseSizeBeforeDelete = volunteerPostRepository.findAll().size();

        // Delete the volunteerPost
        restVolunteerPostMockMvc
            .perform(delete(ENTITY_API_URL_ID, volunteerPost.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VolunteerPost> volunteerPostList = volunteerPostRepository.findAll();
        assertThat(volunteerPostList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
