package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Shop.
 */
@Entity
@Table(name = "shop")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Shop implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @NotNull
    @Column(name = "contact_num", nullable = false)
    private String contactNum;

    @Column(name = "shop_email")
    private String shopEmail;

    @NotNull
    @Column(name = "charity_shop_id", nullable = false)
    private String charityShopId;

    @Column(name = "open_hours_weekdays")
    private String openHoursWeekdays;

    @Column(name = "open_hours_weekends")
    private String openHoursWeekends;

    @Column(name = "open_hours_holidays")
    private String openHoursHolidays;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "post_code")
    private String postCode;

    @Column(name = "country")
    private String country;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "distance")
    private Double distance;

    @Column(name = "duration")
    private Duration duration;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "item", "customer", "shop" }, allowSetters = true)
    private Set<Reservation> reservations = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shop", "apps" }, allowSetters = true)
    private Set<VolunteerPost> volunteerPosts = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shop", "reservedBy" }, allowSetters = true)
    private Set<Item> items = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shop", "interestedEvents" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @OneToMany(mappedBy = "shop")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "customer", "shop" }, allowSetters = true)
    private Set<Feedback> feedbacks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Shop id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShopName() {
        return this.shopName;
    }

    public Shop shopName(String shopName) {
        this.setShopName(shopName);
        return this;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getContactNum() {
        return this.contactNum;
    }

    public Shop contactNum(String contactNum) {
        this.setContactNum(contactNum);
        return this;
    }

    public void setContactNum(String contactNum) {
        this.contactNum = contactNum;
    }

    public String getShopEmail() {
        return this.shopEmail;
    }

    public Shop shopEmail(String shopEmail) {
        this.setShopEmail(shopEmail);
        return this;
    }

    public void setShopEmail(String shopEmail) {
        this.shopEmail = shopEmail;
    }

    public String getCharityShopId() {
        return this.charityShopId;
    }

    public Shop charityShopId(String charityShopId) {
        this.setCharityShopId(charityShopId);
        return this;
    }

    public void setCharityShopId(String charityShopId) {
        this.charityShopId = charityShopId;
    }

    public String getOpenHoursWeekdays() {
        return this.openHoursWeekdays;
    }

    public Shop openHoursWeekdays(String openHoursWeekdays) {
        this.setOpenHoursWeekdays(openHoursWeekdays);
        return this;
    }

    public void setOpenHoursWeekdays(String openHoursWeekdays) {
        this.openHoursWeekdays = openHoursWeekdays;
    }

    public String getOpenHoursWeekends() {
        return this.openHoursWeekends;
    }

    public Shop openHoursWeekends(String openHoursWeekends) {
        this.setOpenHoursWeekends(openHoursWeekends);
        return this;
    }

    public void setOpenHoursWeekends(String openHoursWeekends) {
        this.openHoursWeekends = openHoursWeekends;
    }

    public String getOpenHoursHolidays() {
        return this.openHoursHolidays;
    }

    public Shop openHoursHolidays(String openHoursHolidays) {
        this.setOpenHoursHolidays(openHoursHolidays);
        return this;
    }

    public void setOpenHoursHolidays(String openHoursHolidays) {
        this.openHoursHolidays = openHoursHolidays;
    }

    public String getStreet() {
        return this.street;
    }

    public Shop street(String street) {
        this.setStreet(street);
        return this;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return this.city;
    }

    public Shop city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostCode() {
        return this.postCode;
    }

    public Shop postCode(String postCode) {
        this.setPostCode(postCode);
        return this;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public String getCountry() {
        return this.country;
    }

    public Shop country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public Shop creationDate(LocalDate creationDate) {
        this.setCreationDate(creationDate);
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public Shop logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public Shop logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public Double getRating() {
        return this.rating;
    }

    public Shop rating(Double rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getDistance() {
        return this.distance;
    }

    public Shop distance(Double distance) {
        this.setDistance(distance);
        return this;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Duration getDuration() {
        return this.duration;
    }

    public Shop duration(Duration duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Shop user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Reservation> getReservations() {
        return this.reservations;
    }

    public void setReservations(Set<Reservation> reservations) {
        if (this.reservations != null) {
            this.reservations.forEach(i -> i.setShop(null));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.setShop(this));
        }
        this.reservations = reservations;
    }

    public Shop reservations(Set<Reservation> reservations) {
        this.setReservations(reservations);
        return this;
    }

    public Shop addReservations(Reservation reservation) {
        this.reservations.add(reservation);
        reservation.setShop(this);
        return this;
    }

    public Shop removeReservations(Reservation reservation) {
        this.reservations.remove(reservation);
        reservation.setShop(null);
        return this;
    }

    public Set<VolunteerPost> getVolunteerPosts() {
        return this.volunteerPosts;
    }

    public void setVolunteerPosts(Set<VolunteerPost> volunteerPosts) {
        if (this.volunteerPosts != null) {
            this.volunteerPosts.forEach(i -> i.setShop(null));
        }
        if (volunteerPosts != null) {
            volunteerPosts.forEach(i -> i.setShop(this));
        }
        this.volunteerPosts = volunteerPosts;
    }

    public Shop volunteerPosts(Set<VolunteerPost> volunteerPosts) {
        this.setVolunteerPosts(volunteerPosts);
        return this;
    }

    public Shop addVolunteerPost(VolunteerPost volunteerPost) {
        this.volunteerPosts.add(volunteerPost);
        volunteerPost.setShop(this);
        return this;
    }

    public Shop removeVolunteerPost(VolunteerPost volunteerPost) {
        this.volunteerPosts.remove(volunteerPost);
        volunteerPost.setShop(null);
        return this;
    }

    public Set<Item> getItems() {
        return this.items;
    }

    public void setItems(Set<Item> items) {
        if (this.items != null) {
            this.items.forEach(i -> i.setShop(null));
        }
        if (items != null) {
            items.forEach(i -> i.setShop(this));
        }
        this.items = items;
    }

    public Shop items(Set<Item> items) {
        this.setItems(items);
        return this;
    }

    public Shop addItem(Item item) {
        this.items.add(item);
        item.setShop(this);
        return this;
    }

    public Shop removeItem(Item item) {
        this.items.remove(item);
        item.setShop(null);
        return this;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.setShop(null));
        }
        if (events != null) {
            events.forEach(i -> i.setShop(this));
        }
        this.events = events;
    }

    public Shop events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public Shop addEvent(Event event) {
        this.events.add(event);
        event.setShop(this);
        return this;
    }

    public Shop removeEvent(Event event) {
        this.events.remove(event);
        event.setShop(null);
        return this;
    }

    public Set<Feedback> getFeedbacks() {
        return this.feedbacks;
    }

    public void setFeedbacks(Set<Feedback> feedbacks) {
        if (this.feedbacks != null) {
            this.feedbacks.forEach(i -> i.setShop(null));
        }
        if (feedbacks != null) {
            feedbacks.forEach(i -> i.setShop(this));
        }
        this.feedbacks = feedbacks;
    }

    public Shop feedbacks(Set<Feedback> feedbacks) {
        this.setFeedbacks(feedbacks);
        return this;
    }

    public Shop addFeedback(Feedback feedback) {
        this.feedbacks.add(feedback);
        feedback.setShop(this);
        return this;
    }

    public Shop removeFeedback(Feedback feedback) {
        this.feedbacks.remove(feedback);
        feedback.setShop(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Shop)) {
            return false;
        }
        return id != null && id.equals(((Shop) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Shop{" +
            "id=" + getId() +
            ", shopName='" + getShopName() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", shopEmail='" + getShopEmail() + "'" +
            ", charityShopId='" + getCharityShopId() + "'" +
            ", openHoursWeekdays='" + getOpenHoursWeekdays() + "'" +
            ", openHoursWeekends='" + getOpenHoursWeekends() + "'" +
            ", openHoursHolidays='" + getOpenHoursHolidays() + "'" +
            ", street='" + getStreet() + "'" +
            ", city='" + getCity() + "'" +
            ", postCode='" + getPostCode() + "'" +
            ", country='" + getCountry() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", rating=" + getRating() +
            ", distance=" + getDistance() +
            ", duration='" + getDuration() + "'" +
            "}";
    }
}
