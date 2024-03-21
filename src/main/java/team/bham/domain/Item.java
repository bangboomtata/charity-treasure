package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Condition;
import team.bham.domain.enumeration.Gender;
import team.bham.domain.enumeration.ItemType;

/**
 * A Item.
 */
@Entity
@Table(name = "item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "sale_flag")
    private Boolean saleFlag;

    @Min(value = 10)
    @Max(value = 90)
    @Column(name = "sale_amount")
    private Integer saleAmount;

    @Column(name = "shown_price")
    private String shownPrice;

    @Column(name = "sale_end_time")
    private ZonedDateTime saleEndTime;

    @NotNull
    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_description")
    private String itemDescription;

    @Column(name = "item_availability")
    private Boolean itemAvailability;

    @Lob
    @Column(name = "item_image", nullable = false)
    private byte[] itemImage;

    @NotNull
    @Column(name = "item_image_content_type", nullable = false)
    private String itemImageContentType;

    @Column(name = "reserve_flag")
    private Boolean reserveFlag;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    private Condition condition;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ItemType itemType;

    @NotNull
    @Column(name = "sub_category", nullable = false)
    private String subCategory;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "reservations", "volunteerPosts", "items", "events", "feedbacks" }, allowSetters = true)
    private Shop shop;

    @JsonIgnoreProperties(value = { "item", "customer", "shop" }, allowSetters = true)
    @OneToOne(mappedBy = "item")
    private Reservation reservedBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Item id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Item price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Boolean getSaleFlag() {
        return this.saleFlag;
    }

    public Item saleFlag(Boolean saleFlag) {
        this.setSaleFlag(saleFlag);
        return this;
    }

    public void setSaleFlag(Boolean saleFlag) {
        this.saleFlag = saleFlag;
    }

    public Integer getSaleAmount() {
        return this.saleAmount;
    }

    public Item saleAmount(Integer saleAmount) {
        this.setSaleAmount(saleAmount);
        return this;
    }

    public void setSaleAmount(Integer saleAmount) {
        this.saleAmount = saleAmount;
    }

    public String getShownPrice() {
        return this.shownPrice;
    }

    public Item shownPrice(String shownPrice) {
        this.setShownPrice(shownPrice);
        return this;
    }

    public void setShownPrice(String shownPrice) {
        this.shownPrice = shownPrice;
    }

    public ZonedDateTime getSaleEndTime() {
        return this.saleEndTime;
    }

    public Item saleEndTime(ZonedDateTime saleEndTime) {
        this.setSaleEndTime(saleEndTime);
        return this;
    }

    public void setSaleEndTime(ZonedDateTime saleEndTime) {
        this.saleEndTime = saleEndTime;
    }

    public String getItemName() {
        return this.itemName;
    }

    public Item itemName(String itemName) {
        this.setItemName(itemName);
        return this;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemDescription() {
        return this.itemDescription;
    }

    public Item itemDescription(String itemDescription) {
        this.setItemDescription(itemDescription);
        return this;
    }

    public void setItemDescription(String itemDescription) {
        this.itemDescription = itemDescription;
    }

    public Boolean getItemAvailability() {
        return this.itemAvailability;
    }

    public Item itemAvailability(Boolean itemAvailability) {
        this.setItemAvailability(itemAvailability);
        return this;
    }

    public void setItemAvailability(Boolean itemAvailability) {
        this.itemAvailability = itemAvailability;
    }

    public byte[] getItemImage() {
        return this.itemImage;
    }

    public Item itemImage(byte[] itemImage) {
        this.setItemImage(itemImage);
        return this;
    }

    public void setItemImage(byte[] itemImage) {
        this.itemImage = itemImage;
    }

    public String getItemImageContentType() {
        return this.itemImageContentType;
    }

    public Item itemImageContentType(String itemImageContentType) {
        this.itemImageContentType = itemImageContentType;
        return this;
    }

    public void setItemImageContentType(String itemImageContentType) {
        this.itemImageContentType = itemImageContentType;
    }

    public Boolean getReserveFlag() {
        return this.reserveFlag;
    }

    public Item reserveFlag(Boolean reserveFlag) {
        this.setReserveFlag(reserveFlag);
        return this;
    }

    public void setReserveFlag(Boolean reserveFlag) {
        this.reserveFlag = reserveFlag;
    }

    public Gender getGender() {
        return this.gender;
    }

    public Item gender(Gender gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Condition getCondition() {
        return this.condition;
    }

    public Item condition(Condition condition) {
        this.setCondition(condition);
        return this;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    public ItemType getItemType() {
        return this.itemType;
    }

    public Item itemType(ItemType itemType) {
        this.setItemType(itemType);
        return this;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public String getSubCategory() {
        return this.subCategory;
    }

    public Item subCategory(String subCategory) {
        this.setSubCategory(subCategory);
        return this;
    }

    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Item shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    public Reservation getReservedBy() {
        return this.reservedBy;
    }

    public void setReservedBy(Reservation reservation) {
        if (this.reservedBy != null) {
            this.reservedBy.setItem(null);
        }
        if (reservation != null) {
            reservation.setItem(this);
        }
        this.reservedBy = reservation;
    }

    public Item reservedBy(Reservation reservation) {
        this.setReservedBy(reservation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Item)) {
            return false;
        }
        return id != null && id.equals(((Item) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Item{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", saleFlag='" + getSaleFlag() + "'" +
            ", saleAmount=" + getSaleAmount() +
            ", shownPrice='" + getShownPrice() + "'" +
            ", saleEndTime='" + getSaleEndTime() + "'" +
            ", itemName='" + getItemName() + "'" +
            ", itemDescription='" + getItemDescription() + "'" +
            ", itemAvailability='" + getItemAvailability() + "'" +
            ", itemImage='" + getItemImage() + "'" +
            ", itemImageContentType='" + getItemImageContentType() + "'" +
            ", reserveFlag='" + getReserveFlag() + "'" +
            ", gender='" + getGender() + "'" +
            ", condition='" + getCondition() + "'" +
            ", itemType='" + getItemType() + "'" +
            ", subCategory='" + getSubCategory() + "'" +
            "}";
    }
}
