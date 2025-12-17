package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.AppointmentCreateDTO;
import com.example.polyclinic.polyclinic.dto.AppointmentDTO;
import com.example.polyclinic.polyclinic.entity.*;
import com.example.polyclinic.polyclinic.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    // Статусы согласно CHECK constraint в БД
    public static final String STATUS_SCHEDULED = "Запланирован";
    public static final String STATUS_COMPLETED = "Завершен";
    public static final String STATUS_CANCELLED = "Отменен";
    public static final String STATUS_RESCHEDULED = "Перенесен";

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository,
                              ServiceRepository serviceRepository,
                              UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<AppointmentDTO> getAllAppointmentsPaged(Pageable pageable) {
        return appointmentRepository.findAll(pageable).map(this::convertToDTO);
    }

    public List<AppointmentDTO> getAppointmentsByUserEmail(String email) {
        UserData user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return List.of();

        Patient patient = patientRepository.findByUserId(user.getId()).orElse(null);
        if (patient == null) return List.of();

        return appointmentRepository.findByPatientId(patient.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createAppointment(AppointmentCreateDTO dto, String userEmail) {
        UserData user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Получаем или создаём пациента
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Patient newPatient = new Patient();
                    newPatient.setUser(user);
                    newPatient.setSnils("000-000-000 00");
                    newPatient.setAddress("Не указан");
                    return patientRepository.save(newPatient);
                });

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Врач не найден"));

        com.example.polyclinic.polyclinic.entity.Service service =
                serviceRepository.findById(dto.getServiceId())
                        .orElseThrow(() -> new RuntimeException("Услуга не найдена"));

        // Парсим дату и время
        LocalDate date = LocalDate.parse(dto.getAppointmentDate());
        LocalTime time = LocalTime.parse(dto.getAppointmentTime());
        LocalDateTime appointmentDateTime = LocalDateTime.of(date, time);

        // Проверяем, что дата в будущем
        if (appointmentDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Нельзя записаться на прошедшую дату");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setService(service);
        appointment.setAppointmentDate(appointmentDateTime);
        appointment.setPrice(service.getPrice());
        appointment.setStatus(STATUS_SCHEDULED); // "Запланирован"

        // Notes может быть null
        String notes = dto.getNotes();
        if (notes != null && !notes.trim().isEmpty()) {
            appointment.setNotes(notes.trim());
        }

        appointmentRepository.save(appointment);
    }

    @Transactional
    public void cancelAppointment(Integer id, String userEmail) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

        UserData user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Пациент не найден"));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Вы не можете отменить чужую запись");
        }

        appointment.setStatus(STATUS_CANCELLED); // "Отменен"
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void updateStatus(Integer id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

        // Проверяем допустимость статуса
        if (!isValidStatus(status)) {
            throw new RuntimeException("Недопустимый статус: " + status);
        }

        appointment.setStatus(status);
        appointmentRepository.save(appointment);
    }

    private boolean isValidStatus(String status) {
        return STATUS_SCHEDULED.equals(status) ||
                STATUS_COMPLETED.equals(status) ||
                STATUS_CANCELLED.equals(status) ||
                STATUS_RESCHEDULED.equals(status);
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