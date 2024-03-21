package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import team.bham.domain.enumeration.ApplicationStatus;

/**
 * A Application.
 */
@Entity
@Table(name = "application")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Application implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "contact_num", nullable = false)
    private String contactNum;

    @Column(name = "email")
    private String email;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "commitment_duration")
    private String commitmentDuration;

    @Column(name = "volunteer_experience")
    private String volunteerExperience;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "relevant_skills")
    private String relevantSkills;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "motivation")
    private String motivation;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status")
    private ApplicationStatus applicationStatus;

    @Column(name = "applied_monday")
    private Boolean appliedMonday;

    @Column(name = "applied_tuesday")
    private Boolean appliedTuesday;

    @Column(name = "applied_wednesday")
    private Boolean appliedWednesday;

    @Column(name = "applied_thursday")
    private Boolean appliedThursday;

    @Column(name = "applied_friday")
    private Boolean appliedFriday;

    @Column(name = "applied_saturday")
    private Boolean appliedSaturday;

    @Column(name = "applied_sunday")
    private Boolean appliedSunday;

    @Column(name = "applied_morning")
    private Boolean appliedMorning;

    @Column(name = "applied_afternoon")
    private Boolean appliedAfternoon;

    @Column(name = "applied_evening")
    private Boolean appliedEvening;

    @ManyToOne
    @JsonIgnoreProperties(value = { "shop", "apps" }, allowSetters = true)
    private VolunteerPost post;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "apps", "interestedEvents" }, allowSetters = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Application id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Application firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Application lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getContactNum() {
        return this.contactNum;
    }

    public Application contactNum(String contactNum) {
        this.setContactNum(contactNum);
        return this;
    }

    public void setContactNum(String contactNum) {
        this.contactNum = contactNum;
    }

    public String getEmail() {
        return this.email;
    }

    public Application email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDateOfBirth() {
        return this.dateOfBirth;
    }

    public Application dateOfBirth(LocalDate dateOfBirth) {
        this.setDateOfBirth(dateOfBirth);
        return this;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getCommitmentDuration() {
        return this.commitmentDuration;
    }

    public Application commitmentDuration(String commitmentDuration) {
        this.setCommitmentDuration(commitmentDuration);
        return this;
    }

    public void setCommitmentDuration(String commitmentDuration) {
        this.commitmentDuration = commitmentDuration;
    }

    public String getVolunteerExperience() {
        return this.volunteerExperience;
    }

    public Application volunteerExperience(String volunteerExperience) {
        this.setVolunteerExperience(volunteerExperience);
        return this;
    }

    public void setVolunteerExperience(String volunteerExperience) {
        this.volunteerExperience = volunteerExperience;
    }

    public String getRelevantSkills() {
        return this.relevantSkills;
    }

    public Application relevantSkills(String relevantSkills) {
        this.setRelevantSkills(relevantSkills);
        return this;
    }

    public void setRelevantSkills(String relevantSkills) {
        this.relevantSkills = relevantSkills;
    }

    public String getMotivation() {
        return this.motivation;
    }

    public Application motivation(String motivation) {
        this.setMotivation(motivation);
        return this;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public LocalDate getApplicationDate() {
        return this.applicationDate;
    }

    public Application applicationDate(LocalDate applicationDate) {
        this.setApplicationDate(applicationDate);
        return this;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public ApplicationStatus getApplicationStatus() {
        return this.applicationStatus;
    }

    public Application applicationStatus(ApplicationStatus applicationStatus) {
        this.setApplicationStatus(applicationStatus);
        return this;
    }

    public void setApplicationStatus(ApplicationStatus applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public Boolean getAppliedMonday() {
        return this.appliedMonday;
    }

    public Application appliedMonday(Boolean appliedMonday) {
        this.setAppliedMonday(appliedMonday);
        return this;
    }

    public void setAppliedMonday(Boolean appliedMonday) {
        this.appliedMonday = appliedMonday;
    }

    public Boolean getAppliedTuesday() {
        return this.appliedTuesday;
    }

    public Application appliedTuesday(Boolean appliedTuesday) {
        this.setAppliedTuesday(appliedTuesday);
        return this;
    }

    public void setAppliedTuesday(Boolean appliedTuesday) {
        this.appliedTuesday = appliedTuesday;
    }

    public Boolean getAppliedWednesday() {
        return this.appliedWednesday;
    }

    public Application appliedWednesday(Boolean appliedWednesday) {
        this.setAppliedWednesday(appliedWednesday);
        return this;
    }

    public void setAppliedWednesday(Boolean appliedWednesday) {
        this.appliedWednesday = appliedWednesday;
    }

    public Boolean getAppliedThursday() {
        return this.appliedThursday;
    }

    public Application appliedThursday(Boolean appliedThursday) {
        this.setAppliedThursday(appliedThursday);
        return this;
    }

    public void setAppliedThursday(Boolean appliedThursday) {
        this.appliedThursday = appliedThursday;
    }

    public Boolean getAppliedFriday() {
        return this.appliedFriday;
    }

    public Application appliedFriday(Boolean appliedFriday) {
        this.setAppliedFriday(appliedFriday);
        return this;
    }

    public void setAppliedFriday(Boolean appliedFriday) {
        this.appliedFriday = appliedFriday;
    }

    public Boolean getAppliedSaturday() {
        return this.appliedSaturday;
    }

    public Application appliedSaturday(Boolean appliedSaturday) {
        this.setAppliedSaturday(appliedSaturday);
        return this;
    }

    public void setAppliedSaturday(Boolean appliedSaturday) {
        this.appliedSaturday = appliedSaturday;
    }

    public Boolean getAppliedSunday() {
        return this.appliedSunday;
    }

    public Application appliedSunday(Boolean appliedSunday) {
        this.setAppliedSunday(appliedSunday);
        return this;
    }

    public void setAppliedSunday(Boolean appliedSunday) {
        this.appliedSunday = appliedSunday;
    }

    public Boolean getAppliedMorning() {
        return this.appliedMorning;
    }

    public Application appliedMorning(Boolean appliedMorning) {
        this.setAppliedMorning(appliedMorning);
        return this;
    }

    public void setAppliedMorning(Boolean appliedMorning) {
        this.appliedMorning = appliedMorning;
    }

    public Boolean getAppliedAfternoon() {
        return this.appliedAfternoon;
    }

    public Application appliedAfternoon(Boolean appliedAfternoon) {
        this.setAppliedAfternoon(appliedAfternoon);
        return this;
    }

    public void setAppliedAfternoon(Boolean appliedAfternoon) {
        this.appliedAfternoon = appliedAfternoon;
    }

    public Boolean getAppliedEvening() {
        return this.appliedEvening;
    }

    public Application appliedEvening(Boolean appliedEvening) {
        this.setAppliedEvening(appliedEvening);
        return this;
    }

    public void setAppliedEvening(Boolean appliedEvening) {
        this.appliedEvening = appliedEvening;
    }

    public VolunteerPost getPost() {
        return this.post;
    }

    public void setPost(VolunteerPost volunteerPost) {
        this.post = volunteerPost;
    }

    public Application post(VolunteerPost volunteerPost) {
        this.setPost(volunteerPost);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Application customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Application)) {
            return false;
        }
        return id != null && id.equals(((Application) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Application{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", email='" + getEmail() + "'" +
            ", dateOfBirth='" + getDateOfBirth() + "'" +
            ", commitmentDuration='" + getCommitmentDuration() + "'" +
            ", volunteerExperience='" + getVolunteerExperience() + "'" +
            ", relevantSkills='" + getRelevantSkills() + "'" +
            ", motivation='" + getMotivation() + "'" +
            ", applicationDate='" + getApplicationDate() + "'" +
            ", applicationStatus='" + getApplicationStatus() + "'" +
            ", appliedMonday='" + getAppliedMonday() + "'" +
            ", appliedTuesday='" + getAppliedTuesday() + "'" +
            ", appliedWednesday='" + getAppliedWednesday() + "'" +
            ", appliedThursday='" + getAppliedThursday() + "'" +
            ", appliedFriday='" + getAppliedFriday() + "'" +
            ", appliedSaturday='" + getAppliedSaturday() + "'" +
            ", appliedSunday='" + getAppliedSunday() + "'" +
            ", appliedMorning='" + getAppliedMorning() + "'" +
            ", appliedAfternoon='" + getAppliedAfternoon() + "'" +
            ", appliedEvening='" + getAppliedEvening() + "'" +
            "}";
    }
}
