// Võ Quốc An - ce190460
package fu.se.assignment02.controller;

import fu.se.assignment02.dto.LoginRequest;
import fu.se.assignment02.dto.LoginResponse;
import fu.se.assignment02.service.SystemAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SystemAccountService accountService;

    public AuthController(SystemAccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = accountService.login(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
