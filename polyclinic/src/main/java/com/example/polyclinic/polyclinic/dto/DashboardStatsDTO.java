package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDTO {
    private Long usersCount;
    private Long doctorsCount;
    private Long servicesCount;
    private Long departmentsCount;
    private Long appointmentsCount;
    private Long appointmentsThisMonth;
    private BigDecimal revenueThisMonth;
    private List<PopularServiceDTO> popularServices;
    private List<PopularDoctorDTO> popularDoctors;
    private List<MonthlyStatsDTO> monthlyStats;
    private List<DepartmentStatsDTO> departmentStats;

    public DashboardStatsDTO() {}

    // Геттеры и сеттеры
    public Long getUsersCount() { return usersCount; }
    public void setUsersCount(Long usersCount) { this.usersCount = usersCount; }

    public Long getDoctorsCount() { return doctorsCount; }
    public void setDoctorsCount(Long doctorsCount) { this.doctorsCount = doctorsCount; }

    public Long getServicesCount() { return servicesCount; }
    public void setServicesCount(Long servicesCount) { this.servicesCount = servicesCount; }

    public Long getDepartmentsCount() { return departmentsCount; }
    public void setDepartmentsCount(Long departmentsCount) { this.departmentsCount = departmentsCount; }

    public Long getAppointmentsCount() { return appointmentsCount; }
    public void setAppointmentsCount(Long appointmentsCount) { this.appointmentsCount = appointmentsCount; }

    public Long getAppointmentsThisMonth() { return appointmentsThisMonth; }
    public void setAppointmentsThisMonth(Long appointmentsThisMonth) { this.appointmentsThisMonth = appointmentsThisMonth; }

    public BigDecimal getRevenueThisMonth() { return revenueThisMonth; }
    public void setRevenueThisMonth(BigDecimal revenueThisMonth) { this.revenueThisMonth = revenueThisMonth; }

    public List<PopularServiceDTO> getPopularServices() { return popularServices; }
    public void setPopularServices(List<PopularServiceDTO> popularServices) { this.popularServices = popularServices; }

    public List<PopularDoctorDTO> getPopularDoctors() { return popularDoctors; }
    public void setPopularDoctors(List<PopularDoctorDTO> popularDoctors) { this.popularDoctors = popularDoctors; }

    public List<MonthlyStatsDTO> getMonthlyStats() { return monthlyStats; }
    public void setMonthlyStats(List<MonthlyStatsDTO> monthlyStats) { this.monthlyStats = monthlyStats; }

    public List<DepartmentStatsDTO> getDepartmentStats() { return departmentStats; }
    public void setDepartmentStats(List<DepartmentStatsDTO> departmentStats) { this.departmentStats = departmentStats; }
}