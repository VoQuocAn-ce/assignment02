// Võ Quốc An - ce190460
package fu.se.assignment02.service;

import fu.se.assignment02.dto.NewsArticleDTO;

import java.util.List;

public interface NewsArticleService {
    List<NewsArticleDTO> getAllNews(String keyword, Short categoryId, Boolean status);
    List<NewsArticleDTO> getPublicActiveNews();
    List<NewsArticleDTO> getNewsHistory(Integer accountId);
    NewsArticleDTO getNewsById(String id);
    NewsArticleDTO createNews(NewsArticleDTO dto);
    NewsArticleDTO updateNews(String id, NewsArticleDTO dto);
    void deleteNews(String id);
}
