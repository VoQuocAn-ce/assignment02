// Võ Quốc An - ce190460
package fu.se.assignment02.repository;

import fu.se.assignment02.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByTagNameIgnoreCase(String tagName);
    boolean existsByTagNameIgnoreCase(String tagName);
}
