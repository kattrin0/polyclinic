package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;

public class DoctorStatsDTO {
    private Integer id;
    private String fullName;
    private String specialization;
    private Long appointmentsCount;
    private BigDecimal totalRevenue;

    public DoctorStatsDTO() {}

    public DoctorStatsDTO(Integer id, String fullName, String specialization,
                          Long appointmentsCount, BigDecimal totalRevenue) {
        this.id = id;
        this.fullName = fullName;
        this.specialization = specialization;
        this.appointmentsCount = appointmentsCount;
        this.totalRevenue = totalRevenue;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Long getAppointmentsCount() { return appointmentsCount; }
    public void setAppointmentsCount(Long appointmentsCount) { this.appointmentsCount = appointmentsCount; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}