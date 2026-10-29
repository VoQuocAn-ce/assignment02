// Võ Quốc An - ce190460
package fu.se.assignment02.repository;

import fu.se.assignment02.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Integer> {
    Optional<SystemAccount> findByAccountEmail(String accountEmail);
    Optional<SystemAccount> findByAccountName(String accountName);
    Optional<SystemAccount> findByAccountEmailOrAccountName(String email, String name);
    boolean existsByAccountEmail(String accountEmail);
    boolean existsByAccountName(String accountName);
}
