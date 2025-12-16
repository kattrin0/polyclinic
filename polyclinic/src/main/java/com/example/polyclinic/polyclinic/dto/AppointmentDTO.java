package com.example.polyclinic.polyclinic.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AppointmentDTO {
    private Integer id;
    private String patientName;
    private String doctorName;
    private String serviceName;
    private LocalDateTime appointmentDate;
    private String status;
    private BigDecimal price;

    public AppointmentDTO() {}

    public AppointmentDTO(Integer id, String patientName, String doctorName,
                          String serviceName, LocalDateTime appointmentDate,
                          String status, BigDecimal price) {
        this.id = id;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.serviceName = serviceName;
        this.appointmentDate = appointmentDate;
        this.status = status;
        this.price = price;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}