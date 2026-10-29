// Võ Quốc An - ce190460
package fu.se.assignment02.repository;

import fu.se.assignment02.entity.Category;
import fu.se.assignment02.entity.NewsArticle;
import fu.se.assignment02.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {
    
    // Check if any news article belongs to a category
    boolean existsByCategory(Category category);
    boolean existsByCategory_CategoryID(Short categoryID);

    // Check if an account created any news article
    boolean existsByCreatedBy(SystemAccount createdBy);
    boolean existsByCreatedBy_AccountID(Integer accountID);

    // Public active news
    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    // News history created by an account
    List<NewsArticle> findByCreatedBy_AccountIDOrderByCreatedDateDesc(Integer accountID);

    // All news ordered
    List<NewsArticle> findAllByOrderByCreatedDateDesc();

    // Search query
    @Query("SELECT n FROM NewsArticle n WHERE " +
           "(:keyword IS NULL OR LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR n.category.categoryID = :categoryId) AND " +
           "(:status IS NULL OR n.newsStatus = :status)")
    List<NewsArticle> searchNews(
        @Param("keyword") String keyword,
        @Param("categoryId") Short categoryId,
        @Param("status") Boolean status
    );
}
