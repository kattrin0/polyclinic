package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;
import java.util.List;

public class DepartmentStatsDTO {
    private Integer id;
    private String name;
    private Long doctorsCount;
    private Long servicesCount;
    private Long appointmentsCount;
    private Long completedCount;
    private BigDecimal totalRevenue;
    private List<DoctorStatsDTO> topDoctors;

    public DepartmentStatsDTO() {}

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getDoctorsCount() { return doctorsCount; }
    public void setDoctorsCount(Long doctorsCount) { this.doctorsCount = doctorsCount; }

    public Long getServicesCount() { return servicesCount; }
    public void setServicesCount(Long servicesCount) { this.servicesCount = servicesCount; }

    public Long getAppointmentsCount() { return appointmentsCount; }
    public void setAppointmentsCount(Long appointmentsCount) { this.appointmentsCount = appointmentsCount; }

    public Long getCompletedCount() { return completedCount; }
    public void setCompletedCount(Long completedCount) { this.completedCount = completedCount; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<DoctorStatsDTO> getTopDoctors() { return topDoctors; }
    public void setTopDoctors(List<DoctorStatsDTO> topDoctors) { this.topDoctors = topDoctors; }
}