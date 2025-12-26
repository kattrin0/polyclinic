package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;

public class PopularDoctorDTO {
    private Integer id;
    private String fullName;
    private String specialization;
    private String departmentName;
    private Long appointmentsCount;
    private Long completedCount;
    private BigDecimal totalRevenue;

    public PopularDoctorDTO() {}

    public PopularDoctorDTO(Integer id, String fullName, String specialization,
                            String departmentName, Long appointmentsCount,
                            Long completedCount, BigDecimal totalRevenue) {
        this.id = id;
        this.fullName = fullName;
        this.specialization = specialization;
        this.departmentName = departmentName;
        this.appointmentsCount = appointmentsCount;
        this.completedCount = completedCount;
        this.totalRevenue = totalRevenue;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getAppointmentsCount() { return appointmentsCount; }
    public void setAppointmentsCount(Long appointmentsCount) { this.appointmentsCount = appointmentsCount; }

    public Long getCompletedCount() { return completedCount; }
    public void setCompletedCount(Long completedCount) { this.completedCount = completedCount; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}