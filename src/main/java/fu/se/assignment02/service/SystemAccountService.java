// Võ Quốc An - ce190460
package fu.se.assignment02.service;

import fu.se.assignment02.dto.AccountDTO;
import fu.se.assignment02.dto.LoginRequest;
import fu.se.assignment02.dto.LoginResponse;

import java.util.List;

public interface SystemAccountService {
    LoginResponse login(LoginRequest request);
    List<AccountDTO> getAllAccounts();
    AccountDTO getAccountById(Integer id);
    AccountDTO createAccount(AccountDTO dto);
    AccountDTO updateAccount(Integer id, AccountDTO dto);
    void deleteAccount(Integer id, Integer currentUserId);
}
