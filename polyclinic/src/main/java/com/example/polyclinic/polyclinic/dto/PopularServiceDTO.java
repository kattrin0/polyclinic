package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;

public class PopularServiceDTO {
    private Integer id;
    private String name;
    private String departmentName;
    private Long appointmentsCount;
    private BigDecimal totalRevenue;

    public PopularServiceDTO() {}

    public PopularServiceDTO(Integer id, String name, String departmentName,
                             Long appointmentsCount, BigDecimal totalRevenue) {
        this.id = id;
        this.name = name;
        this.departmentName = departmentName;
        this.appointmentsCount = appointmentsCount;
        this.totalRevenue = totalRevenue;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getAppointmentsCount() { return appointmentsCount; }
    public void setAppointmentsCount(Long appointmentsCount) { this.appointmentsCount = appointmentsCount; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}