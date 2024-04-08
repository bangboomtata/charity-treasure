package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Status;

/**
 * The VolunteerPost entity.\n@author A true hipster
 */
@Schema(description = "The VolunteerPost entity.\n@author A true hipster")
@Entity
@Table(name = "customer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    // @JsonIgnoreProperties(value = { "customer" }, allowSetters = true)
    private Set<CustomerEmails> emails = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    // @JsonIgnoreProperties(value = { "post", "customer" }, allowSetters = true)
    private Set<Application> apps = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "event" }, allowSetters = true)
    private Set<InterestedEvents> interestedEvents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Customer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return this.status;
    }

    public Customer status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Customer user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<CustomerEmails> getEmails() {
        return this.emails;
    }

    public void setEmails(Set<CustomerEmails> customerEmails) {
        if (this.emails != null) {
            this.emails.forEach(i -> i.setCustomer(null));
        }
        if (customerEmails != null) {
            customerEmails.forEach(i -> i.setCustomer(this));
        }
        this.emails = customerEmails;
    }

    public Customer emails(Set<CustomerEmails> customerEmails) {
        this.setEmails(customerEmails);
        return this;
    }

    public Customer addEmail(CustomerEmails customerEmails) {
        this.emails.add(customerEmails);
        customerEmails.setCustomer(this);
        return this;
    }

    public Customer removeEmail(CustomerEmails customerEmails) {
        this.emails.remove(customerEmails);
        customerEmails.setCustomer(null);
        return this;
    }

    public Set<Application> getApps() {
        return this.apps;
    }

    public void setApps(Set<Application> applications) {
        if (this.apps != null) {
            this.apps.forEach(i -> i.setCustomer(null));
        }
        if (applications != null) {
            applications.forEach(i -> i.setCustomer(this));
        }
        this.apps = applications;
    }

    public Customer apps(Set<Application> applications) {
        this.setApps(applications);
        return this;
    }

    public Customer addApp(Application application) {
        this.apps.add(application);
        application.setCustomer(this);
        return this;
    }

    public Customer removeApp(Application application) {
        this.apps.remove(application);
        application.setCustomer(null);
        return this;
    }

    public Set<InterestedEvents> getInterestedEvents() {
        return this.interestedEvents;
    }

    public void setInterestedEvents(Set<InterestedEvents> interestedEvents) {
        if (this.interestedEvents != null) {
            this.interestedEvents.forEach(i -> i.setUser(null));
        }
        if (interestedEvents != null) {
            interestedEvents.forEach(i -> i.setUser(this));
        }
        this.interestedEvents = interestedEvents;
    }

    public Customer interestedEvents(Set<InterestedEvents> interestedEvents) {
        this.setInterestedEvents(interestedEvents);
        return this;
    }

    public Customer addInterestedEvents(InterestedEvents interestedEvents) {
        this.interestedEvents.add(interestedEvents);
        interestedEvents.setUser(this);
        return this;
    }

    public Customer removeInterestedEvents(InterestedEvents interestedEvents) {
        this.interestedEvents.remove(interestedEvents);
        interestedEvents.setUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
