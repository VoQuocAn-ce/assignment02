// Võ Quốc An - ce190460
package fu.se.assignment02.service.impl;

import fu.se.assignment02.dto.CategoryDTO;
import fu.se.assignment02.entity.Category;
import fu.se.assignment02.exception.BadRequestException;
import fu.se.assignment02.exception.ResourceNotFoundException;
import fu.se.assignment02.repository.CategoryRepository;
import fu.se.assignment02.repository.NewsArticleRepository;
import fu.se.assignment02.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, NewsArticleRepository newsArticleRepository) {
        this.categoryRepository = categoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryDTO> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getCategoryById(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return toDTO(category);
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) {
        String name = dto.getName() != null ? dto.getName().trim() : "";
        if (categoryRepository.existsByCategoryNameIgnoreCase(name)) {
            throw new BadRequestException("Category \"" + name + "\" already exists.");
        }

        Category category = new Category();
        category.setCategoryName(name);
        category.setCategoryDesciption(dto.getDescription() != null ? dto.getDescription().trim() : "");
        category.setParentCategoryID(dto.getParentCategoryId());
        category.setIsActive(dto.getStatus() == null || dto.getStatus() == 1);

        Category saved = categoryRepository.save(category);
        return toDTO(saved);
    }

    @Override
    public CategoryDTO updateCategory(Short id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        String name = dto.getName() != null ? dto.getName().trim() : "";
        if (!name.equalsIgnoreCase(category.getCategoryName()) && categoryRepository.existsByCategoryNameIgnoreCase(name)) {
            throw new BadRequestException("Another category named \"" + name + "\" already exists.");
        }

        category.setCategoryName(name);
        category.setCategoryDesciption(dto.getDescription() != null ? dto.getDescription().trim() : "");
        if (dto.getParentCategoryId() != null) {
            category.setParentCategoryID(dto.getParentCategoryId());
        }
        if (dto.getStatus() != null) {
            category.setIsActive(dto.getStatus() == 1);
        }

        Category updated = categoryRepository.save(category);
        return toDTO(updated);
    }

    @Override
    public void deleteCategory(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        // Rubric rule: "The delete action will delete an item in the case this item is not belong to any news articles. If the item is already stored in a news article cannot delete."
        if (newsArticleRepository.existsByCategory_CategoryID(id)) {
            throw new BadRequestException("Cannot delete this category because it is currently assigned to one or more news articles.");
        }

        categoryRepository.delete(category);
    }

    private CategoryDTO toDTO(Category category) {
        return new CategoryDTO(
                category.getCategoryID(),
                category.getCategoryName(),
                category.getCategoryDesciption(),
                category.getParentCategoryID(),
                Boolean.TRUE.equals(category.getIsActive()) ? 1 : 0
        );
    }
}
