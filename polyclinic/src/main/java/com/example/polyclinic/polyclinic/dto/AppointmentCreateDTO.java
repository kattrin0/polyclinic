package com.example.polyclinic.polyclinic.dto;

import java.time.LocalDateTime;

public class AppointmentCreateDTO {
    private Integer serviceId;
    private Integer doctorId;
    private String appointmentDate;
    private String appointmentTime;
    private String notes;

    public AppointmentCreateDTO() {}

    // Геттеры и сеттеры
    public Integer getServiceId() { return serviceId; }
    public void setServiceId(Integer serviceId) { this.serviceId = serviceId; }

    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}