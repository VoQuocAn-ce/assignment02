// Võ Quốc An - ce190460
package fu.se.assignment02.dto;

public class AccountDTO {

    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private Integer role;
    private Integer status = 1;
    private String password;

    public AccountDTO() {
    }

    public AccountDTO(Integer id, String username, String fullName, String email, Integer role, Integer status, String password) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.password = password;
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Aliases for entity property matching
    public String getAccountName() {
        return username != null ? username : fullName;
    }

    public void setAccountName(String accountName) {
        this.username = accountName;
        if (this.fullName == null) {
            this.fullName = accountName;
        }
    }

    public String getAccountEmail() {
        return email;
    }

    public void setAccountEmail(String accountEmail) {
        this.email = accountEmail;
    }

    public Integer getAccountRole() {
        return role;
    }

    public void setAccountRole(Integer accountRole) {
        this.role = accountRole;
    }

    public String getAccountPassword() {
        return password;
    }

    public void setAccountPassword(String accountPassword) {
        this.password = accountPassword;
    }
}
