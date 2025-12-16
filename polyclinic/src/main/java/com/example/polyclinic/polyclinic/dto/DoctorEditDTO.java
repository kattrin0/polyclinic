package com.example.polyclinic.polyclinic.dto;

public class DoctorEditDTO {
    private Integer id;
    private String fullName;
    private String specialization;
    private Integer departmentId;
    private Boolean isActive;

    public DoctorEditDTO() {}

    public DoctorEditDTO(Integer id, String fullName, String specialization,
                         Integer departmentId, Boolean isActive) {
        this.id = id;
        this.fullName = fullName;
        this.specialization = specialization;
        this.departmentId = departmentId;
        this.isActive = isActive;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}