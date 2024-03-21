package team.bham.service.dto;

import java.io.Serializable;
import java.util.List;
import org.springframework.lang.Nullable;
import team.bham.domain.enumeration.Gender;
import team.bham.domain.enumeration.ItemType;

public class SaleDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Nullable
    private Boolean onlineA;

    @Nullable
    private Boolean emailA;

    @Nullable
    private String message;

    @Nullable
    private Integer timeDays;

    private Integer timeHours;

    private Integer saleAmount;

    private ItemType itemType;

    private List<String> subCategory;

    @Nullable
    private Gender gender;

    @Nullable
    private Long shopId;

    public SaleDTO() {}

    public Boolean getOnlineA() {
        return onlineA;
    }

    public void setOnlineA(Boolean onlineA) {
        this.onlineA = onlineA;
    }

    public Boolean getEmailA() {
        return emailA;
    }

    public void setEmailA(Boolean emailA) {
        this.emailA = emailA;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getTimeDays() {
        return timeDays;
    }

    public void setTimeDays(Integer timeDays) {
        this.timeDays = timeDays;
    }

    public Integer getTimeHours() {
        return timeHours;
    }

    public void setTimeHours(Integer timeHours) {
        this.timeHours = timeHours;
    }

    public Integer getSaleAmount() {
        return saleAmount;
    }

    public void setSaleAmount(Integer saleAmount) {
        this.saleAmount = saleAmount;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public List<String> getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(List<String> subCategory) {
        this.subCategory = subCategory;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long id) {
        this.shopId = id;
    }
}
