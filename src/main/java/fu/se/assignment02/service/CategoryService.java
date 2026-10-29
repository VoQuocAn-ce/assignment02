// Võ Quốc An - ce190460
package fu.se.assignment02.service;

import fu.se.assignment02.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    public List<CategoryDTO> getAllCategories();
    public List<CategoryDTO> getActiveCategories();
    public CategoryDTO getCategoryById(Short id);
    public CategoryDTO createCategory(CategoryDTO dto);
    public CategoryDTO updateCategory(Short id, CategoryDTO dto);
    public void deleteCategory(Short id);

}