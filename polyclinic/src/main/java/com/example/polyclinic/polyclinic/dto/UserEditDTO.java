package com.example.polyclinic.polyclinic.dto;

public class UserEditDTO {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String password; // Новый пароль (опционально)
    private Boolean isAdmin;

    public UserEditDTO() {}

    public UserEditDTO(Integer id, String fullName, String email, String phone, Boolean isAdmin) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.isAdmin = isAdmin;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
}