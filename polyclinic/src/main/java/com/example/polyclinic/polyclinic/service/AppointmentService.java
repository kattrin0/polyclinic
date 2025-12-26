package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.AppointmentCreateDTO;
import com.example.polyclinic.polyclinic.dto.AppointmentDTO;
import com.example.polyclinic.polyclinic.entity.*;
import com.example.polyclinic.polyclinic.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

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

    // ================== ПОЛУЧЕНИЕ ЗАПИСЕЙ ==================

    /**
     * Получить все записи с пагинацией
     */
    public Page<AppointmentDTO> getAllAppointmentsPaged(Pageable pageable) {
        return appointmentRepository.findAll(pageable).map(this::convertToDTO);
    }

    /**
     * Получить записи с фильтрацией
     */
    public Page<AppointmentDTO> getAppointmentsFiltered(String status, Integer doctorId, Pageable pageable) {
        return appointmentRepository.findAllFiltered(status, doctorId, pageable)
                .map(this::convertToDTO);
    }

    /**
     * Получить записи пользователя по email
     */
    public List<AppointmentDTO> getAppointmentsByUserEmail(String email) {
        if (email == null || email.isEmpty()) {
            return new ArrayList<>();
        }

        // Находим пользователя по email
        UserData user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return new ArrayList<>();
        }

        // Находим пациента по user_id
        Patient patient = patientRepository.findByUserId(user.getId()).orElse(null);
        if (patient == null) {
            return new ArrayList<>();
        }

        // Получаем записи пациента
        List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());

        return appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ================== СОЗДАНИЕ ЗАПИСИ ==================

    @Transactional
    public void createAppointment(AppointmentCreateDTO dto, String userEmail) {
        // Находим пользователя
        UserData user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Получаем или создаём пациента
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseGet(() -> createPatient(user));

        // Находим врача
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Врач не найден"));

        // Находим услугу
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

        // Создаём запись
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setService(service);
        appointment.setAppointmentDate(appointmentDateTime);
        appointment.setPrice(service.getPrice());
        appointment.setStatus(STATUS_SCHEDULED);

        if (dto.getNotes() != null && !dto.getNotes().trim().isEmpty()) {
            appointment.setNotes(dto.getNotes().trim());
        }

        appointmentRepository.save(appointment);
    }

    /**
     * Создание пациента для нового пользователя
     */
    private Patient createPatient(UserData user) {
        Patient newPatient = new Patient();
        newPatient.setUser(user);
        newPatient.setSnils(generateUniqueSnils(user.getId()));
        newPatient.setAddress("-");
        newPatient.setGender(null);
        return patientRepository.save(newPatient);
    }

    /**
     * Генерация уникального SNILS
     */
    private String generateUniqueSnils(Integer userId) {
        long timestamp = System.currentTimeMillis() % 1000000000L;
        long combined = userId * 1000000L + timestamp % 1000000L;
        String digits = String.format("%09d", combined % 1000000000L);
        String checksum = String.format("%02d", (userId + (int)(timestamp % 100)) % 100);
        return String.format("%s-%s-%s %s",
                digits.substring(0, 3),
                digits.substring(3, 6),
                digits.substring(6, 9),
                checksum);
    }

    // ================== ОТМЕНА ЗАПИСИ ==================

    @Transactional
    public void cancelAppointment(Integer id, String userEmail) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

        UserData user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Пациент не найден"));

        // Проверяем, что это запись текущего пользователя
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Вы не можете отменить чужую запись");
        }

        appointment.setStatus(STATUS_CANCELLED);
        appointmentRepository.save(appointment);
    }

    // ================== ОБНОВЛЕНИЕ СТАТУСА ==================

    @Transactional
    public void updateStatus(Integer id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

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

    // ================== УДАЛЕНИЕ ==================

    @Transactional
    public void deleteAppointment(Integer id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Запись не найдена");
        }
        appointmentRepository.deleteById(id);
    }

    // ================== СТАТИСТИКА ==================

    public long count() {
        return appointmentRepository.count();
    }

    // ================== КОНВЕРТАЦИЯ ==================

    private AppointmentDTO convertToDTO(Appointment a) {
        String patientName = "Неизвестно";
        String doctorName = "Неизвестно";
        String serviceName = "Неизвестно";
        BigDecimal price = BigDecimal.ZERO;

        if (a.getPatient() != null && a.getPatient().getUser() != null) {
            patientName = a.getPatient().getUser().getFullName();
        }

        if (a.getDoctor() != null && a.getDoctor().getUser() != null) {
            doctorName = a.getDoctor().getUser().getFullName();
        }

        if (a.getService() != null) {
            serviceName = a.getService().getName();
        }

        if (a.getPrice() != null) {
            price = a.getPrice();
        }

        return new AppointmentDTO(
                a.getId(),
                patientName,
                doctorName,
                serviceName,
                a.getAppointmentDate(),
                a.getStatus(),
                price
        );
    }
}