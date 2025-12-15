package com.example.polyclinic.polyclinic.dto;

public class DoctorDTO {
    private Integer id;
    private String fullName;
    private String specialization;
    private String departmentName;
    private String photoUrl;
    private boolean active;

    public DoctorDTO() {}

    public DoctorDTO(Integer id, String fullName, String specialization,
                     String departmentName, String photoUrl, boolean active) {
        this.id = id;
        this.fullName = fullName;
        this.specialization = specialization;
        this.departmentName = departmentName;
        this.photoUrl = photoUrl;
        this.active = active;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}