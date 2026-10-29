// Võ Quốc An - ce190460
package fu.se.assignment02.dto;

import java.time.LocalDateTime;

public class UserSessionDTO {

    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private Integer role;
    private LocalDateTime loginAt;

    public UserSessionDTO() {
    }

    public UserSessionDTO(Integer id, String username, String fullName, String email, Integer role, LocalDateTime loginAt) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.loginAt = loginAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public LocalDateTime getLoginAt() {
        return loginAt;
    }

    public void setLoginAt(LocalDateTime loginAt) {
        this.loginAt = loginAt;
    }
}
