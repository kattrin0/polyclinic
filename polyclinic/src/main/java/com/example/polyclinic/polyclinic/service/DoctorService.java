package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.DoctorDTO;
import com.example.polyclinic.polyclinic.dto.DoctorEditDTO;
import com.example.polyclinic.polyclinic.entity.Department;
import com.example.polyclinic.polyclinic.entity.Doctor;
import com.example.polyclinic.polyclinic.repository.DepartmentRepository;
import com.example.polyclinic.polyclinic.repository.DoctorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    public DoctorService(DoctorRepository doctorRepository,
                         DepartmentRepository departmentRepository) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
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
    public void updateDoctor(Integer id, DoctorEditDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Врач не найден"));

        doctor.setSpecialization(dto.getSpecialization());

        if (dto.getIsActive() != null) {
            doctor.setIsActive(dto.getIsActive());
        }

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Отделение не найдено"));
            doctor.setDepartment(department);
        }

        // Обновляем ФИО в связанном UserData
        if (doctor.getUser() != null && dto.getFullName() != null) {
            doctor.getUser().setFullName(dto.getFullName());
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

    public long count() {
        return doctorRepository.count();
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        return new DoctorDTO(
                doctor.getId(),
                doctor.getFullName(),
                doctor.getSpecialization(),
                doctor.getDepartmentName(),
                "https://via.placeholder.com/150?text=" + doctor.getId(),
                doctor.getIsActive() != null && doctor.getIsActive()
        );
    }
}