package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.DepartmentDTO;
import com.example.polyclinic.polyclinic.entity.Department;
import com.example.polyclinic.polyclinic.repository.DepartmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<DepartmentDTO> getAllDepartmentsPaged(Pageable pageable) {
        return departmentRepository.findAll(pageable).map(this::convertToDTO);
    }

    public DepartmentDTO getDepartmentById(Integer id) {
        return departmentRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional
    public void updateDepartment(Integer id, DepartmentDTO dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Отделение не найдено"));

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());

        departmentRepository.save(department);
    }

    @Transactional
    public void createDepartment(DepartmentDTO dto) {
        Department department = new Department(dto.getName(), dto.getDescription());
        departmentRepository.save(department);
    }

    @Transactional
    public void deleteDepartment(Integer id) {
        departmentRepository.deleteById(id);
    }

    public long count() {
        return departmentRepository.count();
    }

    private DepartmentDTO convertToDTO(Department department) {
        return new DepartmentDTO(
                department.getId(),
                department.getName(),
                department.getDescription()
        );
    }
}