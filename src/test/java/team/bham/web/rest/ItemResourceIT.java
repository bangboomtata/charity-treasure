package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static team.bham.web.rest.TestUtil.sameInstant;
import static team.bham.web.rest.TestUtil.sameNumber;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
import team.bham.domain.Item;
import team.bham.domain.enumeration.Condition;
import team.bham.domain.enumeration.Gender;
import team.bham.domain.enumeration.ItemType;
import team.bham.repository.ItemRepository;

/**
 * Integration tests for the {@link ItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemResourceIT {

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final Boolean DEFAULT_SALE_FLAG = false;
    private static final Boolean UPDATED_SALE_FLAG = true;

    private static final Integer DEFAULT_SALE_AMOUNT = 10;
    private static final Integer UPDATED_SALE_AMOUNT = 11;

    private static final String DEFAULT_SHOWN_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_SHOWN_PRICE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_SALE_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_SALE_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_ITEM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ITEM_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ITEM_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_ITEM_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ITEM_AVAILABILITY = false;
    private static final Boolean UPDATED_ITEM_AVAILABILITY = true;

    private static final byte[] DEFAULT_ITEM_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ITEM_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ITEM_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ITEM_IMAGE_CONTENT_TYPE = "image/png";

    private static final Boolean DEFAULT_RESERVE_FLAG = false;
    private static final Boolean UPDATED_RESERVE_FLAG = true;

    private static final Gender DEFAULT_GENDER = Gender.MALE;
    private static final Gender UPDATED_GENDER = Gender.FEMALE;

    private static final Condition DEFAULT_CONDITION = Condition.VERYGOOD;
    private static final Condition UPDATED_CONDITION = Condition.GOOD;

    private static final ItemType DEFAULT_ITEM_TYPE = ItemType.CLOTHING;
    private static final ItemType UPDATED_ITEM_TYPE = ItemType.BOOK;

    private static final String DEFAULT_SUB_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_SUB_CATEGORY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemMockMvc;

    private Item item;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Item createEntity(EntityManager em) {
        Item item = new Item()
            .price(DEFAULT_PRICE)
            .saleFlag(DEFAULT_SALE_FLAG)
            .saleAmount(DEFAULT_SALE_AMOUNT)
            .shownPrice(DEFAULT_SHOWN_PRICE)
            .saleEndTime(DEFAULT_SALE_END_TIME)
            .itemName(DEFAULT_ITEM_NAME)
            .itemDescription(DEFAULT_ITEM_DESCRIPTION)
            .itemAvailability(DEFAULT_ITEM_AVAILABILITY)
            .itemImage(DEFAULT_ITEM_IMAGE)
            .itemImageContentType(DEFAULT_ITEM_IMAGE_CONTENT_TYPE)
            .reserveFlag(DEFAULT_RESERVE_FLAG)
            .gender(DEFAULT_GENDER)
            .condition(DEFAULT_CONDITION)
            .itemType(DEFAULT_ITEM_TYPE)
            .subCategory(DEFAULT_SUB_CATEGORY);
        return item;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Item createUpdatedEntity(EntityManager em) {
        Item item = new Item()
            .price(UPDATED_PRICE)
            .saleFlag(UPDATED_SALE_FLAG)
            .saleAmount(UPDATED_SALE_AMOUNT)
            .shownPrice(UPDATED_SHOWN_PRICE)
            .saleEndTime(UPDATED_SALE_END_TIME)
            .itemName(UPDATED_ITEM_NAME)
            .itemDescription(UPDATED_ITEM_DESCRIPTION)
            .itemAvailability(UPDATED_ITEM_AVAILABILITY)
            .itemImage(UPDATED_ITEM_IMAGE)
            .itemImageContentType(UPDATED_ITEM_IMAGE_CONTENT_TYPE)
            .reserveFlag(UPDATED_RESERVE_FLAG)
            .gender(UPDATED_GENDER)
            .condition(UPDATED_CONDITION)
            .itemType(UPDATED_ITEM_TYPE)
            .subCategory(UPDATED_SUB_CATEGORY);
        return item;
    }

    @BeforeEach
    public void initTest() {
        item = createEntity(em);
    }

    @Test
    @Transactional
    void createItem() throws Exception {
        int databaseSizeBeforeCreate = itemRepository.findAll().size();
        // Create the Item
        restItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isCreated());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeCreate + 1);
        Item testItem = itemList.get(itemList.size() - 1);
        assertThat(testItem.getPrice()).isEqualByComparingTo(DEFAULT_PRICE);
        assertThat(testItem.getSaleFlag()).isEqualTo(DEFAULT_SALE_FLAG);
        assertThat(testItem.getSaleAmount()).isEqualTo(DEFAULT_SALE_AMOUNT);
        assertThat(testItem.getShownPrice()).isEqualTo(DEFAULT_SHOWN_PRICE);
        assertThat(testItem.getSaleEndTime()).isEqualTo(DEFAULT_SALE_END_TIME);
        assertThat(testItem.getItemName()).isEqualTo(DEFAULT_ITEM_NAME);
        assertThat(testItem.getItemDescription()).isEqualTo(DEFAULT_ITEM_DESCRIPTION);
        assertThat(testItem.getItemAvailability()).isEqualTo(DEFAULT_ITEM_AVAILABILITY);
        assertThat(testItem.getItemImage()).isEqualTo(DEFAULT_ITEM_IMAGE);
        assertThat(testItem.getItemImageContentType()).isEqualTo(DEFAULT_ITEM_IMAGE_CONTENT_TYPE);
        assertThat(testItem.getReserveFlag()).isEqualTo(DEFAULT_RESERVE_FLAG);
        assertThat(testItem.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testItem.getCondition()).isEqualTo(DEFAULT_CONDITION);
        assertThat(testItem.getItemType()).isEqualTo(DEFAULT_ITEM_TYPE);
        assertThat(testItem.getSubCategory()).isEqualTo(DEFAULT_SUB_CATEGORY);
    }

    @Test
    @Transactional
    void createItemWithExistingId() throws Exception {
        // Create the Item with an existing ID
        item.setId(1L);

        int databaseSizeBeforeCreate = itemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isBadRequest());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = itemRepository.findAll().size();
        // set the field null
        item.setPrice(null);

        // Create the Item, which fails.

        restItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isBadRequest());

        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkItemNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = itemRepository.findAll().size();
        // set the field null
        item.setItemName(null);

        // Create the Item, which fails.

        restItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isBadRequest());

        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkConditionIsRequired() throws Exception {
        int databaseSizeBeforeTest = itemRepository.findAll().size();
        // set the field null
        item.setCondition(null);

        // Create the Item, which fails.

        restItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isBadRequest());

        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkItemTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = itemRepository.findAll().size();
        // set the field null
        item.setItemType(null);

        // Create the Item, which fails.

        restItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isBadRequest());

        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSubCategoryIsRequired() throws Exception {
        int databaseSizeBeforeTest = itemRepository.findAll().size();
        // set the field null
        item.setSubCategory(null);

        // Create the Item, which fails.

        restItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isBadRequest());

        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllItems() throws Exception {
        // Initialize the database
        itemRepository.saveAndFlush(item);

        // Get all the itemList
        restItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(item.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))))
            .andExpect(jsonPath("$.[*].saleFlag").value(hasItem(DEFAULT_SALE_FLAG.booleanValue())))
            .andExpect(jsonPath("$.[*].saleAmount").value(hasItem(DEFAULT_SALE_AMOUNT)))
            .andExpect(jsonPath("$.[*].shownPrice").value(hasItem(DEFAULT_SHOWN_PRICE)))
            .andExpect(jsonPath("$.[*].saleEndTime").value(hasItem(sameInstant(DEFAULT_SALE_END_TIME))))
            .andExpect(jsonPath("$.[*].itemName").value(hasItem(DEFAULT_ITEM_NAME)))
            .andExpect(jsonPath("$.[*].itemDescription").value(hasItem(DEFAULT_ITEM_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].itemAvailability").value(hasItem(DEFAULT_ITEM_AVAILABILITY.booleanValue())))
            .andExpect(jsonPath("$.[*].itemImageContentType").value(hasItem(DEFAULT_ITEM_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].itemImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_ITEM_IMAGE))))
            .andExpect(jsonPath("$.[*].reserveFlag").value(hasItem(DEFAULT_RESERVE_FLAG.booleanValue())))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())))
            .andExpect(jsonPath("$.[*].condition").value(hasItem(DEFAULT_CONDITION.toString())))
            .andExpect(jsonPath("$.[*].itemType").value(hasItem(DEFAULT_ITEM_TYPE.toString())))
            .andExpect(jsonPath("$.[*].subCategory").value(hasItem(DEFAULT_SUB_CATEGORY)));
    }

    @Test
    @Transactional
    void getItem() throws Exception {
        // Initialize the database
        itemRepository.saveAndFlush(item);

        // Get the item
        restItemMockMvc
            .perform(get(ENTITY_API_URL_ID, item.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(item.getId().intValue()))
            .andExpect(jsonPath("$.price").value(sameNumber(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.saleFlag").value(DEFAULT_SALE_FLAG.booleanValue()))
            .andExpect(jsonPath("$.saleAmount").value(DEFAULT_SALE_AMOUNT))
            .andExpect(jsonPath("$.shownPrice").value(DEFAULT_SHOWN_PRICE))
            .andExpect(jsonPath("$.saleEndTime").value(sameInstant(DEFAULT_SALE_END_TIME)))
            .andExpect(jsonPath("$.itemName").value(DEFAULT_ITEM_NAME))
            .andExpect(jsonPath("$.itemDescription").value(DEFAULT_ITEM_DESCRIPTION))
            .andExpect(jsonPath("$.itemAvailability").value(DEFAULT_ITEM_AVAILABILITY.booleanValue()))
            .andExpect(jsonPath("$.itemImageContentType").value(DEFAULT_ITEM_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.itemImage").value(Base64Utils.encodeToString(DEFAULT_ITEM_IMAGE)))
            .andExpect(jsonPath("$.reserveFlag").value(DEFAULT_RESERVE_FLAG.booleanValue()))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()))
            .andExpect(jsonPath("$.condition").value(DEFAULT_CONDITION.toString()))
            .andExpect(jsonPath("$.itemType").value(DEFAULT_ITEM_TYPE.toString()))
            .andExpect(jsonPath("$.subCategory").value(DEFAULT_SUB_CATEGORY));
    }

    @Test
    @Transactional
    void getNonExistingItem() throws Exception {
        // Get the item
        restItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItem() throws Exception {
        // Initialize the database
        itemRepository.saveAndFlush(item);

        int databaseSizeBeforeUpdate = itemRepository.findAll().size();

        // Update the item
        Item updatedItem = itemRepository.findById(item.getId()).get();
        // Disconnect from session so that the updates on updatedItem are not directly saved in db
        em.detach(updatedItem);
        updatedItem
            .price(UPDATED_PRICE)
            .saleFlag(UPDATED_SALE_FLAG)
            .saleAmount(UPDATED_SALE_AMOUNT)
            .shownPrice(UPDATED_SHOWN_PRICE)
            .saleEndTime(UPDATED_SALE_END_TIME)
            .itemName(UPDATED_ITEM_NAME)
            .itemDescription(UPDATED_ITEM_DESCRIPTION)
            .itemAvailability(UPDATED_ITEM_AVAILABILITY)
            .itemImage(UPDATED_ITEM_IMAGE)
            .itemImageContentType(UPDATED_ITEM_IMAGE_CONTENT_TYPE)
            .reserveFlag(UPDATED_RESERVE_FLAG)
            .gender(UPDATED_GENDER)
            .condition(UPDATED_CONDITION)
            .itemType(UPDATED_ITEM_TYPE)
            .subCategory(UPDATED_SUB_CATEGORY);

        restItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItem))
            )
            .andExpect(status().isOk());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
        Item testItem = itemList.get(itemList.size() - 1);
        assertThat(testItem.getPrice()).isEqualByComparingTo(UPDATED_PRICE);
        assertThat(testItem.getSaleFlag()).isEqualTo(UPDATED_SALE_FLAG);
        assertThat(testItem.getSaleAmount()).isEqualTo(UPDATED_SALE_AMOUNT);
        assertThat(testItem.getShownPrice()).isEqualTo(UPDATED_SHOWN_PRICE);
        assertThat(testItem.getSaleEndTime()).isEqualTo(UPDATED_SALE_END_TIME);
        assertThat(testItem.getItemName()).isEqualTo(UPDATED_ITEM_NAME);
        assertThat(testItem.getItemDescription()).isEqualTo(UPDATED_ITEM_DESCRIPTION);
        assertThat(testItem.getItemAvailability()).isEqualTo(UPDATED_ITEM_AVAILABILITY);
        assertThat(testItem.getItemImage()).isEqualTo(UPDATED_ITEM_IMAGE);
        assertThat(testItem.getItemImageContentType()).isEqualTo(UPDATED_ITEM_IMAGE_CONTENT_TYPE);
        assertThat(testItem.getReserveFlag()).isEqualTo(UPDATED_RESERVE_FLAG);
        assertThat(testItem.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testItem.getCondition()).isEqualTo(UPDATED_CONDITION);
        assertThat(testItem.getItemType()).isEqualTo(UPDATED_ITEM_TYPE);
        assertThat(testItem.getSubCategory()).isEqualTo(UPDATED_SUB_CATEGORY);
    }

    @Test
    @Transactional
    void putNonExistingItem() throws Exception {
        int databaseSizeBeforeUpdate = itemRepository.findAll().size();
        item.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, item.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(item))
            )
            .andExpect(status().isBadRequest());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItem() throws Exception {
        int databaseSizeBeforeUpdate = itemRepository.findAll().size();
        item.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(item))
            )
            .andExpect(status().isBadRequest());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItem() throws Exception {
        int databaseSizeBeforeUpdate = itemRepository.findAll().size();
        item.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemWithPatch() throws Exception {
        // Initialize the database
        itemRepository.saveAndFlush(item);

        int databaseSizeBeforeUpdate = itemRepository.findAll().size();

        // Update the item using partial update
        Item partialUpdatedItem = new Item();
        partialUpdatedItem.setId(item.getId());

        partialUpdatedItem
            .shownPrice(UPDATED_SHOWN_PRICE)
            .itemAvailability(UPDATED_ITEM_AVAILABILITY)
            .itemImage(UPDATED_ITEM_IMAGE)
            .itemImageContentType(UPDATED_ITEM_IMAGE_CONTENT_TYPE)
            .reserveFlag(UPDATED_RESERVE_FLAG)
            .gender(UPDATED_GENDER)
            .condition(UPDATED_CONDITION)
            .subCategory(UPDATED_SUB_CATEGORY);

        restItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItem))
            )
            .andExpect(status().isOk());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
        Item testItem = itemList.get(itemList.size() - 1);
        assertThat(testItem.getPrice()).isEqualByComparingTo(DEFAULT_PRICE);
        assertThat(testItem.getSaleFlag()).isEqualTo(DEFAULT_SALE_FLAG);
        assertThat(testItem.getSaleAmount()).isEqualTo(DEFAULT_SALE_AMOUNT);
        assertThat(testItem.getShownPrice()).isEqualTo(UPDATED_SHOWN_PRICE);
        assertThat(testItem.getSaleEndTime()).isEqualTo(DEFAULT_SALE_END_TIME);
        assertThat(testItem.getItemName()).isEqualTo(DEFAULT_ITEM_NAME);
        assertThat(testItem.getItemDescription()).isEqualTo(DEFAULT_ITEM_DESCRIPTION);
        assertThat(testItem.getItemAvailability()).isEqualTo(UPDATED_ITEM_AVAILABILITY);
        assertThat(testItem.getItemImage()).isEqualTo(UPDATED_ITEM_IMAGE);
        assertThat(testItem.getItemImageContentType()).isEqualTo(UPDATED_ITEM_IMAGE_CONTENT_TYPE);
        assertThat(testItem.getReserveFlag()).isEqualTo(UPDATED_RESERVE_FLAG);
        assertThat(testItem.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testItem.getCondition()).isEqualTo(UPDATED_CONDITION);
        assertThat(testItem.getItemType()).isEqualTo(DEFAULT_ITEM_TYPE);
        assertThat(testItem.getSubCategory()).isEqualTo(UPDATED_SUB_CATEGORY);
    }

    @Test
    @Transactional
    void fullUpdateItemWithPatch() throws Exception {
        // Initialize the database
        itemRepository.saveAndFlush(item);

        int databaseSizeBeforeUpdate = itemRepository.findAll().size();

        // Update the item using partial update
        Item partialUpdatedItem = new Item();
        partialUpdatedItem.setId(item.getId());

        partialUpdatedItem
            .price(UPDATED_PRICE)
            .saleFlag(UPDATED_SALE_FLAG)
            .saleAmount(UPDATED_SALE_AMOUNT)
            .shownPrice(UPDATED_SHOWN_PRICE)
            .saleEndTime(UPDATED_SALE_END_TIME)
            .itemName(UPDATED_ITEM_NAME)
            .itemDescription(UPDATED_ITEM_DESCRIPTION)
            .itemAvailability(UPDATED_ITEM_AVAILABILITY)
            .itemImage(UPDATED_ITEM_IMAGE)
            .itemImageContentType(UPDATED_ITEM_IMAGE_CONTENT_TYPE)
            .reserveFlag(UPDATED_RESERVE_FLAG)
            .gender(UPDATED_GENDER)
            .condition(UPDATED_CONDITION)
            .itemType(UPDATED_ITEM_TYPE)
            .subCategory(UPDATED_SUB_CATEGORY);

        restItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItem))
            )
            .andExpect(status().isOk());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
        Item testItem = itemList.get(itemList.size() - 1);
        assertThat(testItem.getPrice()).isEqualByComparingTo(UPDATED_PRICE);
        assertThat(testItem.getSaleFlag()).isEqualTo(UPDATED_SALE_FLAG);
        assertThat(testItem.getSaleAmount()).isEqualTo(UPDATED_SALE_AMOUNT);
        assertThat(testItem.getShownPrice()).isEqualTo(UPDATED_SHOWN_PRICE);
        assertThat(testItem.getSaleEndTime()).isEqualTo(UPDATED_SALE_END_TIME);
        assertThat(testItem.getItemName()).isEqualTo(UPDATED_ITEM_NAME);
        assertThat(testItem.getItemDescription()).isEqualTo(UPDATED_ITEM_DESCRIPTION);
        assertThat(testItem.getItemAvailability()).isEqualTo(UPDATED_ITEM_AVAILABILITY);
        assertThat(testItem.getItemImage()).isEqualTo(UPDATED_ITEM_IMAGE);
        assertThat(testItem.getItemImageContentType()).isEqualTo(UPDATED_ITEM_IMAGE_CONTENT_TYPE);
        assertThat(testItem.getReserveFlag()).isEqualTo(UPDATED_RESERVE_FLAG);
        assertThat(testItem.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testItem.getCondition()).isEqualTo(UPDATED_CONDITION);
        assertThat(testItem.getItemType()).isEqualTo(UPDATED_ITEM_TYPE);
        assertThat(testItem.getSubCategory()).isEqualTo(UPDATED_SUB_CATEGORY);
    }

    @Test
    @Transactional
    void patchNonExistingItem() throws Exception {
        int databaseSizeBeforeUpdate = itemRepository.findAll().size();
        item.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, item.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(item))
            )
            .andExpect(status().isBadRequest());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItem() throws Exception {
        int databaseSizeBeforeUpdate = itemRepository.findAll().size();
        item.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(item))
            )
            .andExpect(status().isBadRequest());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItem() throws Exception {
        int databaseSizeBeforeUpdate = itemRepository.findAll().size();
        item.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(item)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Item in the database
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItem() throws Exception {
        // Initialize the database
        itemRepository.saveAndFlush(item);

        int databaseSizeBeforeDelete = itemRepository.findAll().size();

        // Delete the item
        restItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, item.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Item> itemList = itemRepository.findAll();
        assertThat(itemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
