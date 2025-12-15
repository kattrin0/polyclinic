package com.example.polyclinic.polyclinic.dto;

public class UserDTO {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private boolean isAdmin;

    public UserDTO() {}

    public UserDTO(Integer id, String fullName, String email, String phone, boolean isAdmin) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.isAdmin = isAdmin;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }
}