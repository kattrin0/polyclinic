package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.ServiceDTO;
import com.example.polyclinic.polyclinic.dto.ServiceEditDTO;
import com.example.polyclinic.polyclinic.entity.Department;
import com.example.polyclinic.polyclinic.entity.Service;
import com.example.polyclinic.polyclinic.repository.DepartmentRepository;
import com.example.polyclinic.polyclinic.repository.ServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final DepartmentRepository departmentRepository;

    public ServiceService(ServiceRepository serviceRepository,
                          DepartmentRepository departmentRepository) {
        this.serviceRepository = serviceRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAllWithDepartment().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<ServiceDTO> getAllServicesPaged(Pageable pageable) {
        return serviceRepository.findAll(pageable).map(this::convertToDTO);
    }

    public List<ServiceDTO> getServicesByDepartment(String departmentName) {
        return serviceRepository.findByDepartmentName(departmentName).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public Page<ServiceDTO> getServicesFiltered(Integer departmentId, Pageable pageable) {
        return serviceRepository.findAllFiltered(departmentId, pageable)
                .map(this::convertToDTO);
    }


    public ServiceEditDTO getServiceForEdit(Integer id) {
        Service service = serviceRepository.findById(id).orElse(null);
        if (service == null) return null;

        return new ServiceEditDTO(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDepartment() != null ? service.getDepartment().getId() : null
        );
    }

    @Transactional
    public void updateService(Integer id, ServiceEditDTO dto) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Услуга не найдена"));

        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Отделение не найдено"));
            service.setDepartment(department);
        }

        serviceRepository.save(service);
    }

    @Transactional
    public void createService(ServiceEditDTO dto) {
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Отделение не найдено"));

        Service service = new Service(
                department,
                dto.getName(),
                dto.getDescription(),
                dto.getPrice()
        );

        serviceRepository.save(service);
    }

    @Transactional
    public void deleteService(Integer id) {
        serviceRepository.deleteById(id);
    }

    public long count() {
        return serviceRepository.count();
    }


    public List<ServiceDTO> getServicesByDepartmentId(Integer departmentId) {
        return serviceRepository.findByDepartmentId(departmentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    private ServiceDTO convertToDTO(Service service) {
        return new ServiceDTO(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDepartmentName()
        );
    }
}