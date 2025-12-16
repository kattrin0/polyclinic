package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.AppointmentDTO;
import com.example.polyclinic.polyclinic.entity.Appointment;
import com.example.polyclinic.polyclinic.repository.AppointmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Page<AppointmentDTO> getAllAppointmentsPaged(Pageable pageable) {
        return appointmentRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    public void updateStatus(Integer id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void deleteAppointment(Integer id) {
        appointmentRepository.deleteById(id);
    }

    public long count() {
        return appointmentRepository.count();
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