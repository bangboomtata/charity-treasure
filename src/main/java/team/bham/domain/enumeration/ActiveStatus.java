package team.bham.domain.enumeration;

/**
 * The ActiveStatus enumeration.
 */
public enum ActiveStatus {
    ACTIVE("Active"),
    EXPIRED("Expired");

    private final String value;

    ActiveStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
