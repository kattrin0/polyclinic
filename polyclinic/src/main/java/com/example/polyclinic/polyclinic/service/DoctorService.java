package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.DoctorDTO;
import com.example.polyclinic.polyclinic.entity.Doctor;
import com.example.polyclinic.polyclinic.repository.DoctorRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAllWithUserAndDepartment().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getActiveDoctors() {
        return doctorRepository.findAllActiveWithUserAndDepartment().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
    @Transactional
    public void toggleActive(Integer id) {
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor != null) {
            doctor.setIsActive(!Boolean.TRUE.equals(doctor.getIsActive()));
            doctorRepository.save(doctor);
        }
    }
}