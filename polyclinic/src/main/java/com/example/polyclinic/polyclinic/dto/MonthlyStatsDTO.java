package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;

public class MonthlyStatsDTO {
    private Integer year;
    private Integer month;
    private String monthName;
    private Long appointmentsCount;
    private Long completedCount;
    private Long cancelledCount;
    private BigDecimal totalRevenue;

    public MonthlyStatsDTO() {}

    public MonthlyStatsDTO(Integer year, Integer month, String monthName,
                           Long appointmentsCount, Long completedCount,
                           Long cancelledCount, BigDecimal totalRevenue) {
        this.year = year;
        this.month = month;
        this.monthName = monthName;
        this.appointmentsCount = appointmentsCount;
        this.completedCount = completedCount;
        this.cancelledCount = cancelledCount;
        this.totalRevenue = totalRevenue;
    }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public Long getAppointmentsCount() { return appointmentsCount; }
    public void setAppointmentsCount(Long appointmentsCount) { this.appointmentsCount = appointmentsCount; }

    public Long getCompletedCount() { return completedCount; }
    public void setCompletedCount(Long completedCount) { this.completedCount = completedCount; }

    public Long getCancelledCount() { return cancelledCount; }
    public void setCancelledCount(Long cancelledCount) { this.cancelledCount = cancelledCount; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}