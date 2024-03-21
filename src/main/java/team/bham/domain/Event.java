package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import team.bham.domain.enumeration.Location;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "event_name", nullable = false)
    private String eventName;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "event_description", nullable = false)
    private String eventDescription;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "event_address", nullable = false)
    private String eventAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_location")
    private Location eventLocation;

    @NotNull
    @Column(name = "event_city", nullable = false)
    private String eventCity;

    @Column(name = "event_time")
    private String eventTime;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "event_email")
    private String eventEmail;

    @Lob
    @Column(name = "event_image")
    private byte[] eventImage;

    @Column(name = "event_image_content_type")
    private String eventImageContentType;

    @Column(name = "event_end_date")
    private LocalDate eventEndDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "reservations", "volunteerPosts", "items", "events", "feedbacks" }, allowSetters = true)
    private Shop shop;

    @OneToMany(mappedBy = "event")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "event" }, allowSetters = true)
    private Set<InterestedEvents> interestedEvents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Event id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return this.eventName;
    }

    public Event eventName(String eventName) {
        this.setEventName(eventName);
        return this;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDate getEventDate() {
        return this.eventDate;
    }

    public Event eventDate(LocalDate eventDate) {
        this.setEventDate(eventDate);
        return this;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventDescription() {
        return this.eventDescription;
    }

    public Event eventDescription(String eventDescription) {
        this.setEventDescription(eventDescription);
        return this;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public String getEventAddress() {
        return this.eventAddress;
    }

    public Event eventAddress(String eventAddress) {
        this.setEventAddress(eventAddress);
        return this;
    }

    public void setEventAddress(String eventAddress) {
        this.eventAddress = eventAddress;
    }

    public Location getEventLocation() {
        return this.eventLocation;
    }

    public Event eventLocation(Location eventLocation) {
        this.setEventLocation(eventLocation);
        return this;
    }

    public void setEventLocation(Location eventLocation) {
        this.eventLocation = eventLocation;
    }

    public String getEventCity() {
        return this.eventCity;
    }

    public Event eventCity(String eventCity) {
        this.setEventCity(eventCity);
        return this;
    }

    public void setEventCity(String eventCity) {
        this.eventCity = eventCity;
    }

    public String getEventTime() {
        return this.eventTime;
    }

    public Event eventTime(String eventTime) {
        this.setEventTime(eventTime);
        return this;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getContactNumber() {
        return this.contactNumber;
    }

    public Event contactNumber(String contactNumber) {
        this.setContactNumber(contactNumber);
        return this;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEventEmail() {
        return this.eventEmail;
    }

    public Event eventEmail(String eventEmail) {
        this.setEventEmail(eventEmail);
        return this;
    }

    public void setEventEmail(String eventEmail) {
        this.eventEmail = eventEmail;
    }

    public byte[] getEventImage() {
        return this.eventImage;
    }

    public Event eventImage(byte[] eventImage) {
        this.setEventImage(eventImage);
        return this;
    }

    public void setEventImage(byte[] eventImage) {
        this.eventImage = eventImage;
    }

    public String getEventImageContentType() {
        return this.eventImageContentType;
    }

    public Event eventImageContentType(String eventImageContentType) {
        this.eventImageContentType = eventImageContentType;
        return this;
    }

    public void setEventImageContentType(String eventImageContentType) {
        this.eventImageContentType = eventImageContentType;
    }

    public LocalDate getEventEndDate() {
        return this.eventEndDate;
    }

    public Event eventEndDate(LocalDate eventEndDate) {
        this.setEventEndDate(eventEndDate);
        return this;
    }

    public void setEventEndDate(LocalDate eventEndDate) {
        this.eventEndDate = eventEndDate;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Event shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    public Set<InterestedEvents> getInterestedEvents() {
        return this.interestedEvents;
    }

    public void setInterestedEvents(Set<InterestedEvents> interestedEvents) {
        if (this.interestedEvents != null) {
            this.interestedEvents.forEach(i -> i.setEvent(null));
        }
        if (interestedEvents != null) {
            interestedEvents.forEach(i -> i.setEvent(this));
        }
        this.interestedEvents = interestedEvents;
    }

    public Event interestedEvents(Set<InterestedEvents> interestedEvents) {
        this.setInterestedEvents(interestedEvents);
        return this;
    }

    public Event addInterestedEvents(InterestedEvents interestedEvents) {
        this.interestedEvents.add(interestedEvents);
        interestedEvents.setEvent(this);
        return this;
    }

    public Event removeInterestedEvents(InterestedEvents interestedEvents) {
        this.interestedEvents.remove(interestedEvents);
        interestedEvents.setEvent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", eventName='" + getEventName() + "'" +
            ", eventDate='" + getEventDate() + "'" +
            ", eventDescription='" + getEventDescription() + "'" +
            ", eventAddress='" + getEventAddress() + "'" +
            ", eventLocation='" + getEventLocation() + "'" +
            ", eventCity='" + getEventCity() + "'" +
            ", eventTime='" + getEventTime() + "'" +
            ", contactNumber='" + getContactNumber() + "'" +
            ", eventEmail='" + getEventEmail() + "'" +
            ", eventImage='" + getEventImage() + "'" +
            ", eventImageContentType='" + getEventImageContentType() + "'" +
            ", eventEndDate='" + getEventEndDate() + "'" +
            "}";
    }
}
