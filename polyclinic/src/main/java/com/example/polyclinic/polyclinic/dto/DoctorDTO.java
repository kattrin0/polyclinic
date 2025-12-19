package com.example.polyclinic.polyclinic.dto;

public class DoctorDTO {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String specialization;
    private String departmentName;
    private Integer departmentId;
    private boolean active;

    public DoctorDTO() {}

    public DoctorDTO(Integer id, String fullName, String email, String phone,
                     String specialization, String departmentName,
                     Integer departmentId, boolean active) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
        this.departmentName = departmentName;
        this.departmentId = departmentId;
        this.active = active;
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

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}