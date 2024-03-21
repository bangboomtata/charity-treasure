package team.bham.domain.enumeration;

/**
 * The Status enumeration.
 */
public enum Status {
    ONLINE("Online"),
    OFFLINE("Offline");

    private final String value;

    Status(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
