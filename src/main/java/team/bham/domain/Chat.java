package team.bham.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.GroupChatName;

/**
 * A Chat.
 */
@Entity
@Table(name = "chat")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Chat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "sender_login", nullable = false)
    private String senderLogin;

    @Enumerated(EnumType.STRING)
    @Column(name = "group_chat")
    private GroupChatName groupChat;

    @Column(name = "message")
    private String message;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private ZonedDateTime timestamp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chat id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSenderLogin() {
        return this.senderLogin;
    }

    public Chat senderLogin(String senderLogin) {
        this.setSenderLogin(senderLogin);
        return this;
    }

    public void setSenderLogin(String senderLogin) {
        this.senderLogin = senderLogin;
    }

    public GroupChatName getGroupChat() {
        return this.groupChat;
    }

    public Chat groupChat(GroupChatName groupChat) {
        this.setGroupChat(groupChat);
        return this;
    }

    public void setGroupChat(GroupChatName groupChat) {
        this.groupChat = groupChat;
    }

    public String getMessage() {
        return this.message;
    }

    public Chat message(String message) {
        this.setMessage(message);
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Chat image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Chat imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public ZonedDateTime getTimestamp() {
        return this.timestamp;
    }

    public Chat timestamp(ZonedDateTime timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chat)) {
            return false;
        }
        return id != null && id.equals(((Chat) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chat{" +
            "id=" + getId() +
            ", senderLogin='" + getSenderLogin() + "'" +
            ", groupChat='" + getGroupChat() + "'" +
            ", message='" + getMessage() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
