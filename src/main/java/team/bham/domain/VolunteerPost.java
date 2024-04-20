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
import team.bham.domain.enumeration.ActiveStatus;

/**
 * A VolunteerPost.
 */
@Entity
@Table(name = "volunteer_post")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VolunteerPost implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "post_title", nullable = false)
    private String postTitle;

    @Column(name = "location_address")
    private String locationAddress;

    @Column(name = "contact_num")
    private String contactNum;

    @Column(name = "email")
    private String email;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "about_us")
    private String aboutUs;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "about_role")
    private String aboutRole;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "benefits")
    private String benefits;

    @Lob
    @Column(name = "img")
    private byte[] img;

    @Column(name = "img_content_type")
    private String imgContentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "active_status")
    private ActiveStatus activeStatus;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "monday")
    private Boolean monday;

    @Column(name = "tuesday")
    private Boolean tuesday;

    @Column(name = "wednesday")
    private Boolean wednesday;

    @Column(name = "thursday")
    private Boolean thursday;

    @Column(name = "friday")
    private Boolean friday;

    @Column(name = "saturday")
    private Boolean saturday;

    @Column(name = "sunday")
    private Boolean sunday;

    @Column(name = "morning")
    private Boolean morning;

    @Column(name = "afternoon")
    private Boolean afternoon;

    @Column(name = "evening")
    private Boolean evening;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "reservations", "volunteerPosts", "items", "events", "feedbacks" }, allowSetters = true)
    private Shop shop;

    @OneToMany(mappedBy = "post", orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "post", "customer" }, allowSetters = true)
    private Set<Application> apps = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VolunteerPost id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPostTitle() {
        return this.postTitle;
    }

    public VolunteerPost postTitle(String postTitle) {
        this.setPostTitle(postTitle);
        return this;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public String getLocationAddress() {
        return this.locationAddress;
    }

    public VolunteerPost locationAddress(String locationAddress) {
        this.setLocationAddress(locationAddress);
        return this;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }

    public String getContactNum() {
        return this.contactNum;
    }

    public VolunteerPost contactNum(String contactNum) {
        this.setContactNum(contactNum);
        return this;
    }

    public void setContactNum(String contactNum) {
        this.contactNum = contactNum;
    }

    public String getEmail() {
        return this.email;
    }

    public VolunteerPost email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAboutUs() {
        return this.aboutUs;
    }

    public VolunteerPost aboutUs(String aboutUs) {
        this.setAboutUs(aboutUs);
        return this;
    }

    public void setAboutUs(String aboutUs) {
        this.aboutUs = aboutUs;
    }

    public String getAboutRole() {
        return this.aboutRole;
    }

    public VolunteerPost aboutRole(String aboutRole) {
        this.setAboutRole(aboutRole);
        return this;
    }

    public void setAboutRole(String aboutRole) {
        this.aboutRole = aboutRole;
    }

    public String getBenefits() {
        return this.benefits;
    }

    public VolunteerPost benefits(String benefits) {
        this.setBenefits(benefits);
        return this;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public byte[] getImg() {
        return this.img;
    }

    public VolunteerPost img(byte[] img) {
        this.setImg(img);
        return this;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

    public String getImgContentType() {
        return this.imgContentType;
    }

    public VolunteerPost imgContentType(String imgContentType) {
        this.imgContentType = imgContentType;
        return this;
    }

    public void setImgContentType(String imgContentType) {
        this.imgContentType = imgContentType;
    }

    public ActiveStatus getActiveStatus() {
        return this.activeStatus;
    }

    public VolunteerPost activeStatus(ActiveStatus activeStatus) {
        this.setActiveStatus(activeStatus);
        return this;
    }

    public void setActiveStatus(ActiveStatus activeStatus) {
        this.activeStatus = activeStatus;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public VolunteerPost startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Boolean getMonday() {
        return this.monday;
    }

    public VolunteerPost monday(Boolean monday) {
        this.setMonday(monday);
        return this;
    }

    public void setMonday(Boolean monday) {
        this.monday = monday;
    }

    public Boolean getTuesday() {
        return this.tuesday;
    }

    public VolunteerPost tuesday(Boolean tuesday) {
        this.setTuesday(tuesday);
        return this;
    }

    public void setTuesday(Boolean tuesday) {
        this.tuesday = tuesday;
    }

    public Boolean getWednesday() {
        return this.wednesday;
    }

    public VolunteerPost wednesday(Boolean wednesday) {
        this.setWednesday(wednesday);
        return this;
    }

    public void setWednesday(Boolean wednesday) {
        this.wednesday = wednesday;
    }

    public Boolean getThursday() {
        return this.thursday;
    }

    public VolunteerPost thursday(Boolean thursday) {
        this.setThursday(thursday);
        return this;
    }

    public void setThursday(Boolean thursday) {
        this.thursday = thursday;
    }

    public Boolean getFriday() {
        return this.friday;
    }

    public VolunteerPost friday(Boolean friday) {
        this.setFriday(friday);
        return this;
    }

    public void setFriday(Boolean friday) {
        this.friday = friday;
    }

    public Boolean getSaturday() {
        return this.saturday;
    }

    public VolunteerPost saturday(Boolean saturday) {
        this.setSaturday(saturday);
        return this;
    }

    public void setSaturday(Boolean saturday) {
        this.saturday = saturday;
    }

    public Boolean getSunday() {
        return this.sunday;
    }

    public VolunteerPost sunday(Boolean sunday) {
        this.setSunday(sunday);
        return this;
    }

    public void setSunday(Boolean sunday) {
        this.sunday = sunday;
    }

    public Boolean getMorning() {
        return this.morning;
    }

    public VolunteerPost morning(Boolean morning) {
        this.setMorning(morning);
        return this;
    }

    public void setMorning(Boolean morning) {
        this.morning = morning;
    }

    public Boolean getAfternoon() {
        return this.afternoon;
    }

    public VolunteerPost afternoon(Boolean afternoon) {
        this.setAfternoon(afternoon);
        return this;
    }

    public void setAfternoon(Boolean afternoon) {
        this.afternoon = afternoon;
    }

    public Boolean getEvening() {
        return this.evening;
    }

    public VolunteerPost evening(Boolean evening) {
        this.setEvening(evening);
        return this;
    }

    public void setEvening(Boolean evening) {
        this.evening = evening;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public VolunteerPost shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    public Set<Application> getApps() {
        return this.apps;
    }

    public void setApps(Set<Application> applications) {
        if (this.apps != null) {
            this.apps.forEach(i -> i.setPost(null));
        }
        if (applications != null) {
            applications.forEach(i -> i.setPost(this));
        }
        this.apps = applications;
    }

    public VolunteerPost apps(Set<Application> applications) {
        this.setApps(applications);
        return this;
    }

    public VolunteerPost addApp(Application application) {
        this.apps.add(application);
        application.setPost(this);
        return this;
    }

    public VolunteerPost removeApp(Application application) {
        this.apps.remove(application);
        application.setPost(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VolunteerPost)) {
            return false;
        }
        return id != null && id.equals(((VolunteerPost) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VolunteerPost{" +
            "id=" + getId() +
            ", postTitle='" + getPostTitle() + "'" +
            ", locationAddress='" + getLocationAddress() + "'" +
            ", contactNum='" + getContactNum() + "'" +
            ", email='" + getEmail() + "'" +
            ", aboutUs='" + getAboutUs() + "'" +
            ", aboutRole='" + getAboutRole() + "'" +
            ", benefits='" + getBenefits() + "'" +
            ", img='" + getImg() + "'" +
            ", imgContentType='" + getImgContentType() + "'" +
            ", activeStatus='" + getActiveStatus() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", monday='" + getMonday() + "'" +
            ", tuesday='" + getTuesday() + "'" +
            ", wednesday='" + getWednesday() + "'" +
            ", thursday='" + getThursday() + "'" +
            ", friday='" + getFriday() + "'" +
            ", saturday='" + getSaturday() + "'" +
            ", sunday='" + getSunday() + "'" +
            ", morning='" + getMorning() + "'" +
            ", afternoon='" + getAfternoon() + "'" +
            ", evening='" + getEvening() + "'" +
            "}";
    }
}
