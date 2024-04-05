package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.ReservationStatus;

/**
 * A Reservation.
 */
@Entity
@Table(name = "reservation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "reserved_time", nullable = false)
    private ZonedDateTime reservedTime;

    @NotNull
    @Column(name = "reserved_expiry", nullable = false)
    private ZonedDateTime reservedExpiry;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReservationStatus status;

    @JsonIgnoreProperties(value = { "shop", "reservedBy" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Item item;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "emails", "apps", "interestedEvents" }, allowSetters = true)
    private Customer customer;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "reservations", "volunteerPosts", "items", "events", "feedbacks" }, allowSetters = true)
    private Shop shop;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reservation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getReservedTime() {
        return this.reservedTime;
    }

    public Reservation reservedTime(ZonedDateTime reservedTime) {
        this.setReservedTime(reservedTime);
        return this;
    }

    public void setReservedTime(ZonedDateTime reservedTime) {
        this.reservedTime = reservedTime;
    }

    public ZonedDateTime getReservedExpiry() {
        return this.reservedExpiry;
    }

    public Reservation reservedExpiry(ZonedDateTime reservedExpiry) {
        this.setReservedExpiry(reservedExpiry);
        return this;
    }

    public void setReservedExpiry(ZonedDateTime reservedExpiry) {
        this.reservedExpiry = reservedExpiry;
    }

    public ReservationStatus getStatus() {
        return this.status;
    }

    public Reservation status(ReservationStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public Item getItem() {
        return this.item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Reservation item(Item item) {
        this.setItem(item);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Reservation customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Reservation shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reservation)) {
            return false;
        }
        return id != null && id.equals(((Reservation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reservation{" +
            "id=" + getId() +
            ", reservedTime='" + getReservedTime() + "'" +
            ", reservedExpiry='" + getReservedExpiry() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
