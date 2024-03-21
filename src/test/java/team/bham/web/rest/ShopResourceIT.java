package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Duration;
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
import team.bham.domain.Shop;
import team.bham.repository.ShopRepository;

/**
 * Integration tests for the {@link ShopResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShopResourceIT {

    private static final String DEFAULT_SHOP_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SHOP_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT_NUM = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT_NUM = "BBBBBBBBBB";

    private static final String DEFAULT_SHOP_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_SHOP_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_CHARITY_SHOP_ID = "AAAAAAAAAA";
    private static final String UPDATED_CHARITY_SHOP_ID = "BBBBBBBBBB";

    private static final String DEFAULT_OPEN_HOURS_WEEKDAYS = "AAAAAAAAAA";
    private static final String UPDATED_OPEN_HOURS_WEEKDAYS = "BBBBBBBBBB";

    private static final String DEFAULT_OPEN_HOURS_WEEKENDS = "AAAAAAAAAA";
    private static final String UPDATED_OPEN_HOURS_WEEKENDS = "BBBBBBBBBB";

    private static final String DEFAULT_OPEN_HOURS_HOLIDAYS = "AAAAAAAAAA";
    private static final String UPDATED_OPEN_HOURS_HOLIDAYS = "BBBBBBBBBB";

    private static final String DEFAULT_STREET = "AAAAAAAAAA";
    private static final String UPDATED_STREET = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_POST_CODE = "AAAAAAAAAA";
    private static final String UPDATED_POST_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY = "AAAAAAAAAA";
    private static final String UPDATED_COUNTRY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final Double DEFAULT_RATING = 1D;
    private static final Double UPDATED_RATING = 2D;

    private static final Double DEFAULT_DISTANCE = 1D;
    private static final Double UPDATED_DISTANCE = 2D;

    private static final Duration DEFAULT_DURATION = Duration.ofHours(6);
    private static final Duration UPDATED_DURATION = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/shops";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShopMockMvc;

    private Shop shop;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shop createEntity(EntityManager em) {
        Shop shop = new Shop()
            .shopName(DEFAULT_SHOP_NAME)
            .contactNum(DEFAULT_CONTACT_NUM)
            .shopEmail(DEFAULT_SHOP_EMAIL)
            .charityShopId(DEFAULT_CHARITY_SHOP_ID)
            .openHoursWeekdays(DEFAULT_OPEN_HOURS_WEEKDAYS)
            .openHoursWeekends(DEFAULT_OPEN_HOURS_WEEKENDS)
            .openHoursHolidays(DEFAULT_OPEN_HOURS_HOLIDAYS)
            .street(DEFAULT_STREET)
            .city(DEFAULT_CITY)
            .postCode(DEFAULT_POST_CODE)
            .country(DEFAULT_COUNTRY)
            .creationDate(DEFAULT_CREATION_DATE)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .rating(DEFAULT_RATING)
            .distance(DEFAULT_DISTANCE)
            .duration(DEFAULT_DURATION);
        return shop;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shop createUpdatedEntity(EntityManager em) {
        Shop shop = new Shop()
            .shopName(UPDATED_SHOP_NAME)
            .contactNum(UPDATED_CONTACT_NUM)
            .shopEmail(UPDATED_SHOP_EMAIL)
            .charityShopId(UPDATED_CHARITY_SHOP_ID)
            .openHoursWeekdays(UPDATED_OPEN_HOURS_WEEKDAYS)
            .openHoursWeekends(UPDATED_OPEN_HOURS_WEEKENDS)
            .openHoursHolidays(UPDATED_OPEN_HOURS_HOLIDAYS)
            .street(UPDATED_STREET)
            .city(UPDATED_CITY)
            .postCode(UPDATED_POST_CODE)
            .country(UPDATED_COUNTRY)
            .creationDate(UPDATED_CREATION_DATE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .rating(UPDATED_RATING)
            .distance(UPDATED_DISTANCE)
            .duration(UPDATED_DURATION);
        return shop;
    }

    @BeforeEach
    public void initTest() {
        shop = createEntity(em);
    }

    @Test
    @Transactional
    void createShop() throws Exception {
        int databaseSizeBeforeCreate = shopRepository.findAll().size();
        // Create the Shop
        restShopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shop)))
            .andExpect(status().isCreated());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeCreate + 1);
        Shop testShop = shopList.get(shopList.size() - 1);
        assertThat(testShop.getShopName()).isEqualTo(DEFAULT_SHOP_NAME);
        assertThat(testShop.getContactNum()).isEqualTo(DEFAULT_CONTACT_NUM);
        assertThat(testShop.getShopEmail()).isEqualTo(DEFAULT_SHOP_EMAIL);
        assertThat(testShop.getCharityShopId()).isEqualTo(DEFAULT_CHARITY_SHOP_ID);
        assertThat(testShop.getOpenHoursWeekdays()).isEqualTo(DEFAULT_OPEN_HOURS_WEEKDAYS);
        assertThat(testShop.getOpenHoursWeekends()).isEqualTo(DEFAULT_OPEN_HOURS_WEEKENDS);
        assertThat(testShop.getOpenHoursHolidays()).isEqualTo(DEFAULT_OPEN_HOURS_HOLIDAYS);
        assertThat(testShop.getStreet()).isEqualTo(DEFAULT_STREET);
        assertThat(testShop.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testShop.getPostCode()).isEqualTo(DEFAULT_POST_CODE);
        assertThat(testShop.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testShop.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testShop.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testShop.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testShop.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testShop.getDistance()).isEqualTo(DEFAULT_DISTANCE);
        assertThat(testShop.getDuration()).isEqualTo(DEFAULT_DURATION);
    }

    @Test
    @Transactional
    void createShopWithExistingId() throws Exception {
        // Create the Shop with an existing ID
        shop.setId(1L);

        int databaseSizeBeforeCreate = shopRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shop)))
            .andExpect(status().isBadRequest());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkShopNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = shopRepository.findAll().size();
        // set the field null
        shop.setShopName(null);

        // Create the Shop, which fails.

        restShopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shop)))
            .andExpect(status().isBadRequest());

        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkContactNumIsRequired() throws Exception {
        int databaseSizeBeforeTest = shopRepository.findAll().size();
        // set the field null
        shop.setContactNum(null);

        // Create the Shop, which fails.

        restShopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shop)))
            .andExpect(status().isBadRequest());

        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCharityShopIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = shopRepository.findAll().size();
        // set the field null
        shop.setCharityShopId(null);

        // Create the Shop, which fails.

        restShopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shop)))
            .andExpect(status().isBadRequest());

        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllShops() throws Exception {
        // Initialize the database
        shopRepository.saveAndFlush(shop);

        // Get all the shopList
        restShopMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shop.getId().intValue())))
            .andExpect(jsonPath("$.[*].shopName").value(hasItem(DEFAULT_SHOP_NAME)))
            .andExpect(jsonPath("$.[*].contactNum").value(hasItem(DEFAULT_CONTACT_NUM)))
            .andExpect(jsonPath("$.[*].shopEmail").value(hasItem(DEFAULT_SHOP_EMAIL)))
            .andExpect(jsonPath("$.[*].charityShopId").value(hasItem(DEFAULT_CHARITY_SHOP_ID)))
            .andExpect(jsonPath("$.[*].openHoursWeekdays").value(hasItem(DEFAULT_OPEN_HOURS_WEEKDAYS)))
            .andExpect(jsonPath("$.[*].openHoursWeekends").value(hasItem(DEFAULT_OPEN_HOURS_WEEKENDS)))
            .andExpect(jsonPath("$.[*].openHoursHolidays").value(hasItem(DEFAULT_OPEN_HOURS_HOLIDAYS)))
            .andExpect(jsonPath("$.[*].street").value(hasItem(DEFAULT_STREET)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].postCode").value(hasItem(DEFAULT_POST_CODE)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY)))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING.doubleValue())))
            .andExpect(jsonPath("$.[*].distance").value(hasItem(DEFAULT_DISTANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION.toString())));
    }

    @Test
    @Transactional
    void getShop() throws Exception {
        // Initialize the database
        shopRepository.saveAndFlush(shop);

        // Get the shop
        restShopMockMvc
            .perform(get(ENTITY_API_URL_ID, shop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shop.getId().intValue()))
            .andExpect(jsonPath("$.shopName").value(DEFAULT_SHOP_NAME))
            .andExpect(jsonPath("$.contactNum").value(DEFAULT_CONTACT_NUM))
            .andExpect(jsonPath("$.shopEmail").value(DEFAULT_SHOP_EMAIL))
            .andExpect(jsonPath("$.charityShopId").value(DEFAULT_CHARITY_SHOP_ID))
            .andExpect(jsonPath("$.openHoursWeekdays").value(DEFAULT_OPEN_HOURS_WEEKDAYS))
            .andExpect(jsonPath("$.openHoursWeekends").value(DEFAULT_OPEN_HOURS_WEEKENDS))
            .andExpect(jsonPath("$.openHoursHolidays").value(DEFAULT_OPEN_HOURS_HOLIDAYS))
            .andExpect(jsonPath("$.street").value(DEFAULT_STREET))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.postCode").value(DEFAULT_POST_CODE))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING.doubleValue()))
            .andExpect(jsonPath("$.distance").value(DEFAULT_DISTANCE.doubleValue()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingShop() throws Exception {
        // Get the shop
        restShopMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingShop() throws Exception {
        // Initialize the database
        shopRepository.saveAndFlush(shop);

        int databaseSizeBeforeUpdate = shopRepository.findAll().size();

        // Update the shop
        Shop updatedShop = shopRepository.findById(shop.getId()).get();
        // Disconnect from session so that the updates on updatedShop are not directly saved in db
        em.detach(updatedShop);
        updatedShop
            .shopName(UPDATED_SHOP_NAME)
            .contactNum(UPDATED_CONTACT_NUM)
            .shopEmail(UPDATED_SHOP_EMAIL)
            .charityShopId(UPDATED_CHARITY_SHOP_ID)
            .openHoursWeekdays(UPDATED_OPEN_HOURS_WEEKDAYS)
            .openHoursWeekends(UPDATED_OPEN_HOURS_WEEKENDS)
            .openHoursHolidays(UPDATED_OPEN_HOURS_HOLIDAYS)
            .street(UPDATED_STREET)
            .city(UPDATED_CITY)
            .postCode(UPDATED_POST_CODE)
            .country(UPDATED_COUNTRY)
            .creationDate(UPDATED_CREATION_DATE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .rating(UPDATED_RATING)
            .distance(UPDATED_DISTANCE)
            .duration(UPDATED_DURATION);

        restShopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShop.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShop))
            )
            .andExpect(status().isOk());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
        Shop testShop = shopList.get(shopList.size() - 1);
        assertThat(testShop.getShopName()).isEqualTo(UPDATED_SHOP_NAME);
        assertThat(testShop.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testShop.getShopEmail()).isEqualTo(UPDATED_SHOP_EMAIL);
        assertThat(testShop.getCharityShopId()).isEqualTo(UPDATED_CHARITY_SHOP_ID);
        assertThat(testShop.getOpenHoursWeekdays()).isEqualTo(UPDATED_OPEN_HOURS_WEEKDAYS);
        assertThat(testShop.getOpenHoursWeekends()).isEqualTo(UPDATED_OPEN_HOURS_WEEKENDS);
        assertThat(testShop.getOpenHoursHolidays()).isEqualTo(UPDATED_OPEN_HOURS_HOLIDAYS);
        assertThat(testShop.getStreet()).isEqualTo(UPDATED_STREET);
        assertThat(testShop.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testShop.getPostCode()).isEqualTo(UPDATED_POST_CODE);
        assertThat(testShop.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testShop.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testShop.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testShop.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testShop.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testShop.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testShop.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void putNonExistingShop() throws Exception {
        int databaseSizeBeforeUpdate = shopRepository.findAll().size();
        shop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shop.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShop() throws Exception {
        int databaseSizeBeforeUpdate = shopRepository.findAll().size();
        shop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShop() throws Exception {
        int databaseSizeBeforeUpdate = shopRepository.findAll().size();
        shop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shop)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShopWithPatch() throws Exception {
        // Initialize the database
        shopRepository.saveAndFlush(shop);

        int databaseSizeBeforeUpdate = shopRepository.findAll().size();

        // Update the shop using partial update
        Shop partialUpdatedShop = new Shop();
        partialUpdatedShop.setId(shop.getId());

        partialUpdatedShop
            .shopEmail(UPDATED_SHOP_EMAIL)
            .charityShopId(UPDATED_CHARITY_SHOP_ID)
            .openHoursWeekends(UPDATED_OPEN_HOURS_WEEKENDS)
            .city(UPDATED_CITY)
            .postCode(UPDATED_POST_CODE)
            .creationDate(UPDATED_CREATION_DATE)
            .rating(UPDATED_RATING)
            .distance(UPDATED_DISTANCE);

        restShopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShop))
            )
            .andExpect(status().isOk());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
        Shop testShop = shopList.get(shopList.size() - 1);
        assertThat(testShop.getShopName()).isEqualTo(DEFAULT_SHOP_NAME);
        assertThat(testShop.getContactNum()).isEqualTo(DEFAULT_CONTACT_NUM);
        assertThat(testShop.getShopEmail()).isEqualTo(UPDATED_SHOP_EMAIL);
        assertThat(testShop.getCharityShopId()).isEqualTo(UPDATED_CHARITY_SHOP_ID);
        assertThat(testShop.getOpenHoursWeekdays()).isEqualTo(DEFAULT_OPEN_HOURS_WEEKDAYS);
        assertThat(testShop.getOpenHoursWeekends()).isEqualTo(UPDATED_OPEN_HOURS_WEEKENDS);
        assertThat(testShop.getOpenHoursHolidays()).isEqualTo(DEFAULT_OPEN_HOURS_HOLIDAYS);
        assertThat(testShop.getStreet()).isEqualTo(DEFAULT_STREET);
        assertThat(testShop.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testShop.getPostCode()).isEqualTo(UPDATED_POST_CODE);
        assertThat(testShop.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testShop.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testShop.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testShop.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testShop.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testShop.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testShop.getDuration()).isEqualTo(DEFAULT_DURATION);
    }

    @Test
    @Transactional
    void fullUpdateShopWithPatch() throws Exception {
        // Initialize the database
        shopRepository.saveAndFlush(shop);

        int databaseSizeBeforeUpdate = shopRepository.findAll().size();

        // Update the shop using partial update
        Shop partialUpdatedShop = new Shop();
        partialUpdatedShop.setId(shop.getId());

        partialUpdatedShop
            .shopName(UPDATED_SHOP_NAME)
            .contactNum(UPDATED_CONTACT_NUM)
            .shopEmail(UPDATED_SHOP_EMAIL)
            .charityShopId(UPDATED_CHARITY_SHOP_ID)
            .openHoursWeekdays(UPDATED_OPEN_HOURS_WEEKDAYS)
            .openHoursWeekends(UPDATED_OPEN_HOURS_WEEKENDS)
            .openHoursHolidays(UPDATED_OPEN_HOURS_HOLIDAYS)
            .street(UPDATED_STREET)
            .city(UPDATED_CITY)
            .postCode(UPDATED_POST_CODE)
            .country(UPDATED_COUNTRY)
            .creationDate(UPDATED_CREATION_DATE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .rating(UPDATED_RATING)
            .distance(UPDATED_DISTANCE)
            .duration(UPDATED_DURATION);

        restShopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShop))
            )
            .andExpect(status().isOk());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
        Shop testShop = shopList.get(shopList.size() - 1);
        assertThat(testShop.getShopName()).isEqualTo(UPDATED_SHOP_NAME);
        assertThat(testShop.getContactNum()).isEqualTo(UPDATED_CONTACT_NUM);
        assertThat(testShop.getShopEmail()).isEqualTo(UPDATED_SHOP_EMAIL);
        assertThat(testShop.getCharityShopId()).isEqualTo(UPDATED_CHARITY_SHOP_ID);
        assertThat(testShop.getOpenHoursWeekdays()).isEqualTo(UPDATED_OPEN_HOURS_WEEKDAYS);
        assertThat(testShop.getOpenHoursWeekends()).isEqualTo(UPDATED_OPEN_HOURS_WEEKENDS);
        assertThat(testShop.getOpenHoursHolidays()).isEqualTo(UPDATED_OPEN_HOURS_HOLIDAYS);
        assertThat(testShop.getStreet()).isEqualTo(UPDATED_STREET);
        assertThat(testShop.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testShop.getPostCode()).isEqualTo(UPDATED_POST_CODE);
        assertThat(testShop.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testShop.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testShop.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testShop.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testShop.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testShop.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testShop.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void patchNonExistingShop() throws Exception {
        int databaseSizeBeforeUpdate = shopRepository.findAll().size();
        shop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShop() throws Exception {
        int databaseSizeBeforeUpdate = shopRepository.findAll().size();
        shop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShop() throws Exception {
        int databaseSizeBeforeUpdate = shopRepository.findAll().size();
        shop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShopMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(shop)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shop in the database
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShop() throws Exception {
        // Initialize the database
        shopRepository.saveAndFlush(shop);

        int databaseSizeBeforeDelete = shopRepository.findAll().size();

        // Delete the shop
        restShopMockMvc
            .perform(delete(ENTITY_API_URL_ID, shop.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Shop> shopList = shopRepository.findAll();
        assertThat(shopList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
