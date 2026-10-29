// Võ Quốc An - ce190460
package fu.se.assignment02.service.impl;

import fu.se.assignment02.dto.AccountDTO;
import fu.se.assignment02.dto.LoginRequest;
import fu.se.assignment02.dto.LoginResponse;
import fu.se.assignment02.dto.UserSessionDTO;
import fu.se.assignment02.entity.SystemAccount;
import fu.se.assignment02.exception.BadRequestException;
import fu.se.assignment02.exception.ResourceNotFoundException;
import fu.se.assignment02.repository.NewsArticleRepository;
import fu.se.assignment02.repository.SystemAccountRepository;
import fu.se.assignment02.service.SystemAccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SystemAccountServiceImpl implements SystemAccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    public SystemAccountServiceImpl(SystemAccountRepository accountRepository, NewsArticleRepository newsArticleRepository) {
        this.accountRepository = accountRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String identifier = request.getEmail() != null && !request.getEmail().trim().isEmpty() 
                ? request.getEmail().trim() 
                : (request.getUsername() != null ? request.getUsername().trim() : "");
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        if (identifier.isEmpty() || password.isEmpty()) {
            return LoginResponse.failure("Please enter credentials and password.");
        }

        Optional<SystemAccount> userOpt = accountRepository.findByAccountEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = accountRepository.findByAccountName(identifier);
        }

        if (userOpt.isEmpty()) {
            return LoginResponse.failure("Invalid email/username or password.");
        }

        SystemAccount account = userOpt.get();
        if (!password.equals(account.getAccountPassword())) {
            return LoginResponse.failure("Invalid email/username or password.");
        }

        UserSessionDTO session = new UserSessionDTO(
                account.getAccountID(),
                account.getAccountName(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole(),
                LocalDateTime.now()
        );

        return LoginResponse.success("Login successful", session);
    }

    @Override
    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO getAccountById(Integer id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));
        return toDTO(account);
    }

    @Override
    public AccountDTO createAccount(AccountDTO dto) {
        String name = dto.getAccountName() != null ? dto.getAccountName().trim() : "";
        String email = dto.getAccountEmail() != null ? dto.getAccountEmail().trim() : "";

        if (accountRepository.existsByAccountEmail(email)) {
            throw new BadRequestException("Email \"" + email + "\" is already registered.");
        }
        if (accountRepository.existsByAccountName(name)) {
            throw new BadRequestException("Username \"" + name + "\" is already taken.");
        }

        SystemAccount account = new SystemAccount();
        account.setAccountName(name);
        account.setAccountEmail(email);
        account.setAccountRole((dto.getAccountRole() != null) ? dto.getAccountRole() : 2);
        account.setAccountPassword(dto.getAccountPassword() != null && !dto.getAccountPassword().trim().isEmpty()
                ? dto.getAccountPassword().trim()
                : "123456");

        SystemAccount saved = accountRepository.save(account);
        return toDTO(saved);
    }

    @Override
    public AccountDTO updateAccount(Integer id, AccountDTO dto) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        String email = dto.getAccountEmail() != null ? dto.getAccountEmail().trim() : "";
        if (!email.equalsIgnoreCase(account.getAccountEmail()) && accountRepository.existsByAccountEmail(email)) {
            throw new BadRequestException("Email \"" + email + "\" is already used by another account.");
        }

        if (dto.getAccountName() != null && !dto.getAccountName().trim().isEmpty()) {
            String name = dto.getAccountName().trim();
            if (!name.equalsIgnoreCase(account.getAccountName()) && accountRepository.existsByAccountName(name)) {
                throw new BadRequestException("Username \"" + name + "\" is already taken.");
            }
            account.setAccountName(name);
        }

        account.setAccountEmail(email);
        if (dto.getAccountRole() != null) {
            account.setAccountRole(dto.getAccountRole());
        }
        if (dto.getAccountPassword() != null && !dto.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(dto.getAccountPassword().trim());
        }

        SystemAccount updated = accountRepository.save(account);
        return toDTO(updated);
    }

    @Override
    public void deleteAccount(Integer id, Integer currentUserId) {
        if (currentUserId != null && currentUserId.equals(id)) {
            throw new BadRequestException("You cannot delete your own currently logged-in account.");
        }

        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        // Rubric rule: "the delete action will delete an account in the case this account is not belong to any news articles (created), if the account is already created any news article, cannot delete."
        if (newsArticleRepository.existsByCreatedBy_AccountID(id)) {
            throw new BadRequestException("Cannot delete this account because it has created news articles in the system.");
        }

        accountRepository.delete(account);
    }

    private AccountDTO toDTO(SystemAccount account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getAccountID());
        dto.setUsername(account.getAccountName());
        dto.setFullName(account.getAccountName());
        dto.setEmail(account.getAccountEmail());
        dto.setRole(account.getAccountRole());
        dto.setStatus(1); // active
        dto.setPassword(account.getAccountPassword());
        return dto;
    }
}
