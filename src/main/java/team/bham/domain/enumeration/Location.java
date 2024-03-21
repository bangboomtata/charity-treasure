package team.bham.domain.enumeration;

/**
 * The Location enumeration.
 */
public enum Location {
    SCOTLAND("Scotland"),
    NORTHEAST("NorthEast"),
    NORTHWEST("NorthWest"),
    YORKSHIRE("Yorkshire"),
    EASTMIDLANDS("EastMidlands"),
    WESTMIDLANDS("WestMidlands"),
    EASTANGLIA("EastAnglia"),
    LONDON("London"),
    SOUTHEAST("SouthEast"),
    SOUTHWEST("SouthWest"),
    NORTHWALES("NorthWales"),
    SOUTHWALES("SouthWales"),
    IRELAND("Ireland");

    private final String value;

    Location(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
