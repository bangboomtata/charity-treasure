package team.bham.web.rest;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
import team.bham.domain.Item;
import team.bham.repository.ItemRepository;
import team.bham.service.MailService;
import team.bham.service.dto.SaleDTO;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Item}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItemResource {

    private final Logger log = LoggerFactory.getLogger(ItemResource.class);

    private static final String ENTITY_NAME = "item";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemRepository itemRepository;

    private final MailService mailService;

    public ItemResource(ItemRepository itemRepository, MailService mailService) {
        this.itemRepository = itemRepository;
        this.mailService = mailService;
    }

    /**
     * {@code POST  /items} : Create a new item.
     *
     * @param item the item to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new item, or with status {@code 400 (Bad Request)} if the item has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/items")
    public ResponseEntity<Item> createItem(@Valid @RequestBody Item item) throws URISyntaxException {
        log.debug("REST request to save Item : {}", item);
        if (item.getId() != null) {
            throw new BadRequestAlertException("A new item cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Item result = itemRepository.save(item);
        return ResponseEntity
            .created(new URI("/api/items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /items/:id} : Updates an existing item.
     *
     * @param id the id of the item to save.
     * @param item the item to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated item,
     * or with status {@code 400 (Bad Request)} if the item is not valid,
     * or with status {@code 500 (Internal Server Error)} if the item couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/items/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Item item)
        throws URISyntaxException {
        log.debug("REST request to update Item : {}, {}", id, item);
        if (item.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, item.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Item result = itemRepository.save(item);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, item.getId().toString()))
            .body(result);
    }

    @PatchMapping("/items/sale")
    public ResponseEntity<Boolean> createSale(@RequestBody SaleDTO sale) {
        log.debug("Applying sale to items based on saleDTO");
        log.debug("CHECKING SALE {}", sale.getSaleAmount());
        for (String subCategory : sale.getSubCategory()) {
            List<Item> items = itemRepository.findAllBySubCategory(subCategory);
            log.debug("Found {} items for subCategory '{}'", items.size(), subCategory);

            for (Item item : items) {
                BigDecimal originalPrice = item.getPrice();
                int saleAmountInt = sale.getSaleAmount();
                long hundredd = 100;
                BigDecimal saleAmount = BigDecimal.valueOf((long) saleAmountInt);
                BigDecimal hundred = BigDecimal.valueOf(hundredd);
                BigDecimal discountRate = saleAmount.divide(hundred);
                BigDecimal discountAmount = originalPrice.multiply(discountRate);
                BigDecimal discountedPrice = originalPrice.subtract(discountAmount);

                item.setSaleFlag(true);
                ZonedDateTime currentTime = ZonedDateTime.now();
                if (sale.getTimeDays() == null) {
                    currentTime = currentTime.plusHours(sale.getTimeHours());
                } else {
                    currentTime = currentTime.plusDays(sale.getTimeDays()).plusHours(sale.getTimeHours());
                }
                item.setSaleEndTime(currentTime);
                item.setSaleAmount(sale.getSaleAmount());
                item.setPrice(discountedPrice);
                String formattedOriginalPrice = originalPrice.setScale(2, BigDecimal.ROUND_HALF_UP).toString();
                String formattedDiscountedPrice = discountedPrice.setScale(2, BigDecimal.ROUND_HALF_UP).toString();
                String formattedPrice = String.format(
                    "£%s £%s (-%s%%)",
                    formattedOriginalPrice,
                    formattedDiscountedPrice,
                    String.valueOf(saleAmountInt)
                );
                item.setShownPrice(formattedPrice);
                itemRepository.save(item);
            }
        }
        if (sale.getEmailA()) {}
        return ResponseEntity.ok().body(true);
    }

    /**
     * {@code PATCH  /items/:id} : Partial updates given fields of an existing item, field will ignore if it is null
     *
     * @param id the id of the item to save.
     * @param item the item to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated item,
     * or with status {@code 400 (Bad Request)} if the item is not valid,
     * or with status {@code 404 (Not Found)} if the item is not found,
     * or with status {@code 500 (Internal Server Error)} if the item couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Item> partialUpdateItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Item item
    ) throws URISyntaxException {
        log.debug("REST request to partial update Item partially : {}, {}", id, item);
        if (item.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, item.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Item> result = itemRepository
            .findById(item.getId())
            .map(existingItem -> {
                if (item.getPrice() != null) {
                    existingItem.setPrice(item.getPrice());
                }
                if (item.getSaleFlag() != null) {
                    existingItem.setSaleFlag(item.getSaleFlag());
                }
                if (item.getSaleAmount() != null) {
                    existingItem.setSaleAmount(item.getSaleAmount());
                }
                if (item.getShownPrice() != null) {
                    existingItem.setShownPrice(item.getShownPrice());
                }
                if (item.getSaleEndTime() != null) {
                    existingItem.setSaleEndTime(item.getSaleEndTime());
                }
                if (item.getItemName() != null) {
                    existingItem.setItemName(item.getItemName());
                }
                if (item.getItemDescription() != null) {
                    existingItem.setItemDescription(item.getItemDescription());
                }
                if (item.getItemAvailability() != null) {
                    existingItem.setItemAvailability(item.getItemAvailability());
                }
                if (item.getItemImage() != null) {
                    existingItem.setItemImage(item.getItemImage());
                }
                if (item.getItemImageContentType() != null) {
                    existingItem.setItemImageContentType(item.getItemImageContentType());
                }
                if (item.getReserveFlag() != null) {
                    existingItem.setReserveFlag(item.getReserveFlag());
                }
                if (item.getGender() != null) {
                    existingItem.setGender(item.getGender());
                }
                if (item.getCondition() != null) {
                    existingItem.setCondition(item.getCondition());
                }
                if (item.getItemType() != null) {
                    existingItem.setItemType(item.getItemType());
                }
                if (item.getSubCategory() != null) {
                    existingItem.setSubCategory(item.getSubCategory());
                }

                return existingItem;
            })
            .map(itemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, item.getId().toString())
        );
    }

    /**
     * {@code GET  /items} : get all the items.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of items in body.
     */
    @GetMapping("/items")
    public ResponseEntity<List<Item>> getAllItems(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("reservedby-is-null".equals(filter)) {
            log.debug("REST request to get all Items where reservedBy is null");
            return new ResponseEntity<>(
                StreamSupport
                    .stream(itemRepository.findAll().spliterator(), false)
                    .filter(item -> item.getReservedBy() == null)
                    .collect(Collectors.toList()),
                HttpStatus.OK
            );
        }
        log.debug("REST request to get a page of Items");
        Page<Item> page = itemRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /items/:id} : get the "id" item.
     *
     * @param id the id of the item to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the item, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/items/{id}")
    public ResponseEntity<Item> getItem(@PathVariable Long id) {
        log.debug("REST request to get Item : {}", id);
        Optional<Item> item = itemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(item);
    }

    /**
     * {@code DELETE  /items/:id} : delete the "id" item.
     *
     * @param id the id of the item to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        log.debug("REST request to delete Item : {}", id);
        itemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
