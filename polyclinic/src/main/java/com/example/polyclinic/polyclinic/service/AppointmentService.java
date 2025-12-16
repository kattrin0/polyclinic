package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.AppointmentDTO;
import com.example.polyclinic.polyclinic.entity.Appointment;
import com.example.polyclinic.polyclinic.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void updateStatus(Integer id, String status) {
        Appointment appointment = appointmentRepository.findById(id).orElse(null);
        if (appointment != null) {
            appointment.setStatus(status);
            appointmentRepository.save(appointment);
        }
    }

    private AppointmentDTO convertToDTO(Appointment a) {
        return new AppointmentDTO(
                a.getId(),
                a.getPatient() != null ? a.getPatient().getFullName() : "Неизвестно",
                a.getDoctor() != null ? a.getDoctor().getFullName() : "Неизвестно",
                a.getService() != null ? a.getService().getName() : "Неизвестно",
                a.getAppointmentDate(),
                a.getStatus(),
                a.getPrice()
        );
    }
}