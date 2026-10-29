// Võ Quốc An - ce190460
package fu.se.assignment02.service.impl;

import fu.se.assignment02.dto.NewsArticleDTO;
import fu.se.assignment02.entity.Category;
import fu.se.assignment02.entity.NewsArticle;
import fu.se.assignment02.entity.SystemAccount;
import fu.se.assignment02.entity.Tag;
import fu.se.assignment02.exception.BadRequestException;
import fu.se.assignment02.exception.ResourceNotFoundException;
import fu.se.assignment02.repository.CategoryRepository;
import fu.se.assignment02.repository.NewsArticleRepository;
import fu.se.assignment02.repository.SystemAccountRepository;
import fu.se.assignment02.repository.TagRepository;
import fu.se.assignment02.service.NewsArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public NewsArticleServiceImpl(NewsArticleRepository newsRepository,
                                  CategoryRepository categoryRepository,
                                  SystemAccountRepository accountRepository,
                                  TagRepository tagRepository) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public List<NewsArticleDTO> getAllNews(String keyword, Short categoryId, Boolean status) {
        if ((keyword != null && !keyword.trim().isEmpty()) || categoryId != null || status != null) {
            String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
            return newsRepository.searchNews(kw, categoryId, status).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }
        return newsRepository.findAllByOrderByCreatedDateDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsArticleDTO> getPublicActiveNews() {
        return newsRepository.findByNewsStatusTrueOrderByCreatedDateDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsArticleDTO> getNewsHistory(Integer accountId) {
        return newsRepository.findByCreatedBy_AccountIDOrderByCreatedDateDesc(accountId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NewsArticleDTO getNewsById(String id) {
        NewsArticle news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        return toDTO(news);
    }

    @Override
    public NewsArticleDTO createNews(NewsArticleDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Category not found with ID: " + dto.getCategoryId()));

        SystemAccount creator = null;
        if (dto.getCreatedById() != null) {
            creator = accountRepository.findById(dto.getCreatedById()).orElse(null);
        }
        if (creator == null && dto.getCreatedBy() != null) {
            creator = accountRepository.findByAccountName(dto.getCreatedBy())
                    .orElse(accountRepository.findByAccountEmail(dto.getCreatedBy()).orElse(null));
        }
        if (creator == null) {
            // Fallback to first available account
            creator = accountRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new BadRequestException("No valid system account found to attribute creation to."));
        }

        NewsArticle news = new NewsArticle();
        String newsId = (dto.getId() != null && !dto.getId().trim().isEmpty()) 
                ? dto.getId().trim() 
                : generateNextNewsId();
        news.setNewsArticleID(newsId);
        news.setNewsTitle(dto.getTitle().trim());
        news.setHeadline(dto.getHeadline() != null ? dto.getHeadline().trim() : dto.getTitle().trim());
        news.setNewsContent(dto.getContent().trim());
        news.setNewsSource(dto.getNewsSource() != null ? dto.getNewsSource().trim() : "FU Newsroom");
        news.setCategory(category);
        news.setCreatedBy(creator);
        news.setCreatedDate(LocalDateTime.now());
        news.setNewsStatus(dto.getStatus() == null || dto.getStatus() == 1);
        news.setTags(resolveTags(dto.getTags()));

        NewsArticle saved = newsRepository.save(news);
        return toDTO(saved);
    }

    @Override
    public NewsArticleDTO updateNews(String id, NewsArticleDTO dto) {
        NewsArticle news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new BadRequestException("Category not found with ID: " + dto.getCategoryId()));
            news.setCategory(category);
        }

        if (dto.getTitle() != null && !dto.getTitle().trim().isEmpty()) {
            news.setNewsTitle(dto.getTitle().trim());
        }
        if (dto.getHeadline() != null) {
            news.setHeadline(dto.getHeadline().trim());
        }
        if (dto.getContent() != null && !dto.getContent().trim().isEmpty()) {
            news.setNewsContent(dto.getContent().trim());
        }
        if (dto.getNewsSource() != null) {
            news.setNewsSource(dto.getNewsSource().trim());
        }
        if (dto.getStatus() != null) {
            news.setNewsStatus(dto.getStatus() == 1);
        }
        if (dto.getTags() != null) {
            news.setTags(resolveTags(dto.getTags()));
        }

        if (dto.getCreatedById() != null) {
            accountRepository.findById(dto.getCreatedById()).ifPresent(news::setUpdatedBy);
        }

        news.setModifiedDate(LocalDateTime.now());
        NewsArticle updated = newsRepository.save(news);
        return toDTO(updated);
    }

    @Override
    public void deleteNews(String id) {
        NewsArticle news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        newsRepository.delete(news);
    }

    private synchronized String generateNextNewsId() {
        long count = newsRepository.count();
        long candidate = count + 1;
        while (newsRepository.existsById(String.valueOf(candidate))) {
            candidate++;
        }
        return String.valueOf(candidate);
    }

    private Set<Tag> resolveTags(String tagsString) {
        Set<Tag> tags = new HashSet<>();
        if (tagsString == null || tagsString.trim().isEmpty()) {
            return tags;
        }

        String[] parts = tagsString.split("[,;]");
        for (String part : parts) {
            String name = part.trim();
            if (!name.isEmpty()) {
                Tag tag = tagRepository.findByTagNameIgnoreCase(name)
                        .orElseGet(() -> {
                            Tag t = new Tag();
                            t.setTagName(name);
                            t.setNote("Auto-created from news article");
                            return tagRepository.save(t);
                        });
                tags.add(tag);
            }
        }
        return tags;
    }

    private NewsArticleDTO toDTO(NewsArticle news) {
        NewsArticleDTO dto = new NewsArticleDTO();
        dto.setId(news.getNewsArticleID());
        dto.setTitle(news.getNewsTitle());
        dto.setHeadline(news.getHeadline());
        dto.setContent(news.getNewsContent());
        dto.setNewsSource(news.getNewsSource());

        if (news.getCategory() != null) {
            dto.setCategoryId(news.getCategory().getCategoryID());
            dto.setCategoryName(news.getCategory().getCategoryName());
        }

        if (news.getCreatedBy() != null) {
            dto.setCreatedBy(news.getCreatedBy().getAccountName());
            dto.setCreatedById(news.getCreatedBy().getAccountID());
        }

        dto.setStatus(Boolean.TRUE.equals(news.getNewsStatus()) ? 1 : 0);

        if (news.getTags() != null && !news.getTags().isEmpty()) {
            String tagNames = news.getTags().stream()
                    .map(Tag::getTagName)
                    .collect(Collectors.joining(", "));
            dto.setTags(tagNames);
        } else {
            dto.setTags("");
        }

        if (news.getCreatedDate() != null) {
            dto.setCreatedAt(news.getCreatedDate().format(DATE_FORMATTER));
        }
        if (news.getModifiedDate() != null) {
            dto.setModifiedAt(news.getModifiedDate().format(DATE_FORMATTER));
        }

        return dto;
    }
}
