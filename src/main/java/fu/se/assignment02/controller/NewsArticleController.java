// Võ Quốc An - ce190460
package fu.se.assignment02.controller;

import fu.se.assignment02.dto.NewsArticleDTO;
import fu.se.assignment02.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsArticleController {

    private final NewsArticleService newsService;

    public NewsArticleController(NewsArticleService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsArticleDTO>> getAllNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Short categoryId,
            @RequestParam(required = false) Boolean status) {
        return ResponseEntity.ok(newsService.getAllNews(keyword, categoryId, status));
    }

    // Public active news (without authentication)
    @GetMapping("/public")
    public ResponseEntity<List<NewsArticleDTO>> getPublicActiveNews() {
        return ResponseEntity.ok(newsService.getPublicActiveNews());
    }

    // View news history created by him/her
    @GetMapping("/history/{accountId}")
    public ResponseEntity<List<NewsArticleDTO>> getNewsHistory(@PathVariable Integer accountId) {
        return ResponseEntity.ok(newsService.getNewsHistory(accountId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> getNewsById(@PathVariable String id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PostMapping
    public ResponseEntity<NewsArticleDTO> createNews(@Valid @RequestBody NewsArticleDTO dto) {
        NewsArticleDTO created = newsService.createNews(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> updateNews(@PathVariable String id, @Valid @RequestBody NewsArticleDTO dto) {
        NewsArticleDTO updated = newsService.updateNews(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNews(@PathVariable String id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok(Map.of("message", "News article deleted successfully"));
    }
}
