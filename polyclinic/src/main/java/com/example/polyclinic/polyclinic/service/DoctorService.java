package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.DoctorCreateDTO;
import com.example.polyclinic.polyclinic.dto.DoctorDTO;
import com.example.polyclinic.polyclinic.dto.DoctorEditDTO;
import com.example.polyclinic.polyclinic.entity.Department;
import com.example.polyclinic.polyclinic.entity.Doctor;
import com.example.polyclinic.polyclinic.entity.UserData;
import com.example.polyclinic.polyclinic.repository.DepartmentRepository;
import com.example.polyclinic.polyclinic.repository.DoctorRepository;
import com.example.polyclinic.polyclinic.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository,
                         DepartmentRepository departmentRepository,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Метод для очистки текста от HTML
    private String sanitize(String input) {
        if (input == null) return null;
        return HtmlUtils.htmlEscape(input).trim();
    }

    // Метод для очистки email
    private String sanitizeEmail(String email) {
        if (email == null) return null;
        return email.replaceAll("[^a-zA-Z0-9@._-]", "").toLowerCase().trim();
    }

    // Метод для очистки телефона
    private String sanitizePhone(String phone) {
        if (phone == null) return null;
        return phone.replaceAll("[^0-9+\\s()-]", "").trim();
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAllWithUserAndDepartment().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<DoctorDTO> getAllDoctorsPaged(Pageable pageable) {
        return doctorRepository.findAll(pageable).map(this::convertToDTO);
    }

    public List<DoctorDTO> getActiveDoctors() {
        return doctorRepository.findAllActiveWithUserAndDepartment().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getDoctorsByDepartmentId(Integer departmentId) {
        return doctorRepository.findByDepartmentId(departmentId).stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsActive()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DoctorEditDTO getDoctorForEdit(Integer id) {
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor == null) return null;

        return new DoctorEditDTO(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getSpecialization(),
                doctor.getDepartment() != null ? doctor.getDepartment().getId() : null,
                doctor.getIsActive()
        );
    }

    @Transactional
    public void createDoctor(DoctorCreateDTO dto) {
        // Санитизация
        String fullName = sanitize(dto.getFullName());
        String email = sanitizeEmail(dto.getEmail());
        String phone = sanitizePhone(dto.getPhone());
        String specialization = sanitize(dto.getSpecialization());

        // Проверка email
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        // Проверка отделения
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Отделение не найдено"));

        // Создаём пользователя для врача
        UserData user = new UserData();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setIsAdmin(false);
        userRepository.save(user);

        // Создаём врача
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setDepartment(department);
        doctor.setSpecialization(specialization);
        doctor.setHireDate(LocalDate.now());
        doctor.setIsActive(true);

        doctorRepository.save(doctor);
    }

    @Transactional
    public void updateDoctor(Integer id, DoctorEditDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Врач не найден"));

        // Санитизация
        String fullName = sanitize(dto.getFullName());
        String specialization = sanitize(dto.getSpecialization());

        doctor.setSpecialization(specialization);

        if (dto.getIsActive() != null) {
            doctor.setIsActive(dto.getIsActive());
        }

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Отделение не найдено"));
            doctor.setDepartment(department);
        }

        // Обновляем ФИО в связанном UserData
        if (doctor.getUser() != null && fullName != null) {
            doctor.getUser().setFullName(fullName);
        }

        doctorRepository.save(doctor);
    }

    @Transactional
    public void toggleActive(Integer id) {
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor != null) {
            doctor.setIsActive(!Boolean.TRUE.equals(doctor.getIsActive()));
            doctorRepository.save(doctor);
        }
    }

    @Transactional
    public void deleteDoctor(Integer id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Врач не найден"));
        doctorRepository.delete(doctor);
    }

    public long count() {
        return doctorRepository.count();
    }


    public Page<DoctorDTO> getDoctorsFiltered(Integer departmentId, Boolean isActive, Pageable pageable) {
        return doctorRepository.findAllFiltered(departmentId, isActive, pageable)
                .map(this::convertToDTO);
    }
    private DoctorDTO convertToDTO(Doctor doctor) {
        String email = null;
        String phone = null;

        if (doctor.getUser() != null) {
            email = doctor.getUser().getEmail();
            phone = doctor.getUser().getPhone();
        }

        Integer departmentId = null;
        if (doctor.getDepartment() != null) {
            departmentId = doctor.getDepartment().getId();
        }

        return new DoctorDTO(
                doctor.getId(),
                doctor.getFullName(),
                email,
                phone,
                doctor.getSpecialization(),
                doctor.getDepartmentName(),
                departmentId,
                doctor.getIsActive() != null && doctor.getIsActive()
        );
    }
}