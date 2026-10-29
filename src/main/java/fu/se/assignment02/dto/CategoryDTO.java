// Võ Quốc An - ce190460
package fu.se.assignment02.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDTO {
    private Short id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;
    private Short parentCategoryId;
    private Integer status = 1; // 1 = Active, 0 = Inactive

    public CategoryDTO() {
    }

    public CategoryDTO(Short id, String name, String description, Short parentCategoryId, Integer status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.parentCategoryId = parentCategoryId;
        this.status = status;
    }

    public Short getId() {
        return id;
    }

    public void setId(Short id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Short getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(Short parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
