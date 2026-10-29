// Võ Quốc An - ce190460
package fu.se.assignment02.config;

import fu.se.assignment02.entity.Category;
import fu.se.assignment02.entity.NewsArticle;
import fu.se.assignment02.entity.SystemAccount;
import fu.se.assignment02.entity.Tag;
import fu.se.assignment02.repository.CategoryRepository;
import fu.se.assignment02.repository.NewsArticleRepository;
import fu.se.assignment02.repository.SystemAccountRepository;
import fu.se.assignment02.repository.TagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Set;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final SystemAccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final NewsArticleRepository newsRepository;

    public DataInitializer(SystemAccountRepository accountRepository,
                           CategoryRepository categoryRepository,
                           TagRepository tagRepository,
                           NewsArticleRepository newsRepository) {
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.newsRepository = newsRepository;
    }

    @Override
    public void run(String... args) {
        // Seed default accounts if empty
        if (accountRepository.count() == 0) {
            SystemAccount admin = new SystemAccount();
            admin.setAccountName("Admin");
            admin.setAccountEmail("admin@fu.edu.vn");
            admin.setAccountRole(1); // Admin
            admin.setAccountPassword("Admin");
            accountRepository.save(admin);

            SystemAccount staff1 = new SystemAccount();
            staff1.setAccountName("staff1");
            staff1.setAccountEmail("anv@fu.edu.vn");
            staff1.setAccountRole(2); // Staff
            staff1.setAccountPassword("123456");
            accountRepository.save(staff1);

            SystemAccount staff2 = new SystemAccount();
            staff2.setAccountName("staff2");
            staff2.setAccountEmail("btt@fu.edu.vn");
            staff2.setAccountRole(2); // Staff
            staff2.setAccountPassword("123456");
            accountRepository.save(staff2);
        }

        // Seed default categories if empty
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category(null, "Technology", "Tech news, software engineering & AI advances", null, true));
            categoryRepository.save(new Category(null, "Education", "Academic curriculum, exams and learning resources", null, true));
            categoryRepository.save(new Category(null, "Campus Life", "Student activities, club events and campus facilities", null, true));
            categoryRepository.save(new Category(null, "Sports & Wellness", "Tournaments, sports clubs and student fitness", null, true));
            categoryRepository.save(new Category(null, "Archived Announcements", "Old news notices and historical archives", null, false));
        }

        // Seed default tags if empty
        if (tagRepository.count() == 0) {
            tagRepository.save(new Tag(null, "AI", "Artificial Intelligence"));
            tagRepository.save(new Tag(null, "Technology", "Tech trends"));
            tagRepository.save(new Tag(null, "Research", "Scientific research"));
            tagRepository.save(new Tag(null, "React", "Frontend framework"));
            tagRepository.save(new Tag(null, "SpringBoot", "Backend framework"));
            tagRepository.save(new Tag(null, "Exam", "Examinations"));
            tagRepository.save(new Tag(null, "Sports", "Athletic events"));
        }

        // Seed default news if empty
        if (newsRepository.count() == 0) {
            SystemAccount creator = accountRepository.findAll().stream().findFirst().orElse(null);
            Category techCat = categoryRepository.findByCategoryNameIgnoreCase("Technology").orElse(null);
            Category eduCat = categoryRepository.findByCategoryNameIgnoreCase("Education").orElse(null);
            Category sportsCat = categoryRepository.findByCategoryNameIgnoreCase("Sports & Wellness").orElse(null);

            Tag aiTag = tagRepository.findByTagNameIgnoreCase("AI").orElse(null);
            Tag techTag = tagRepository.findByTagNameIgnoreCase("Technology").orElse(null);
            Tag reactTag = tagRepository.findByTagNameIgnoreCase("React").orElse(null);
            Tag sbTag = tagRepository.findByTagNameIgnoreCase("SpringBoot").orElse(null);

            if (creator != null && techCat != null) {
                NewsArticle n1 = new NewsArticle();
                n1.setNewsArticleID("1");
                n1.setNewsTitle("FPT University Launches Next-Gen AI & Robotics Laboratory");
                n1.setHeadline("State-of-the-art AI infrastructure launched at FU");
                n1.setNewsContent("The new laboratory features high-performance GPU computing clusters, cutting-edge edge IoT kits, and humanoid robotics workstations for students and researchers.");
                n1.setNewsSource("FU Newsroom");
                n1.setCategory(techCat);
                n1.setCreatedBy(creator);
                n1.setCreatedDate(LocalDateTime.now().minusDays(10));
                n1.setNewsStatus(true);
                if (aiTag != null && techTag != null) {
                    n1.setTags(Set.of(aiTag, techTag));
                }
                newsRepository.save(n1);

                NewsArticle n2 = new NewsArticle();
                n2.setNewsArticleID("2");
                n2.setNewsTitle("React 19 Integration with Spring Boot 3 in Modern Enterprise Apps");
                n2.setHeadline("Decoupled single page applications architecture");
                n2.setNewsContent("A comprehensive study on building reactive and decoupled single page applications using React 19 frontend and Spring Boot microservices backend.");
                n2.setNewsSource("Tech Community");
                n2.setCategory(techCat);
                n2.setCreatedBy(creator);
                n2.setCreatedDate(LocalDateTime.now().minusDays(7));
                n2.setNewsStatus(true);
                if (reactTag != null && sbTag != null) {
                    n2.setTags(Set.of(reactTag, sbTag));
                }
                newsRepository.save(n2);
            }

            if (creator != null && eduCat != null) {
                NewsArticle n3 = new NewsArticle();
                n3.setNewsArticleID("3");
                n3.setNewsTitle("Final Examination Schedule for Fall 2026 Semester Released");
                n3.setHeadline("Official exam schedule and integrity guidelines");
                n3.setNewsContent("Academic affairs has published the official exam timetable. Students must bring their student ID cards and comply with exam hall integrity guidelines.");
                n3.setNewsSource("Academic Affairs Office");
                n3.setCategory(eduCat);
                n3.setCreatedBy(creator);
                n3.setCreatedDate(LocalDateTime.now().minusDays(5));
                n3.setNewsStatus(true);
                newsRepository.save(n3);
            }

            if (creator != null && sportsCat != null) {
                NewsArticle n4 = new NewsArticle();
                n4.setNewsArticleID("4");
                n4.setNewsTitle("Annual FU Campus Sports Festival: Football & Badminton Registrations Open");
                n4.setHeadline("Registrations open for students and faculty");
                n4.setNewsContent("Registration is now open for inter-cohort championships. Join clubs and compete for prestigious regional medals and scholarships.");
                n4.setNewsSource("FU Sports Club");
                n4.setCategory(sportsCat);
                n4.setCreatedBy(creator);
                n4.setCreatedDate(LocalDateTime.now().minusDays(3));
                n4.setNewsStatus(true);
                newsRepository.save(n4);
            }
        }
    }
}
