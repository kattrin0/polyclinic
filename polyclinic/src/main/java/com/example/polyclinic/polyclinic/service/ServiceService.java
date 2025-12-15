package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.ServiceDTO;
import com.example.polyclinic.polyclinic.entity.Service;
import com.example.polyclinic.polyclinic.repository.ServiceRepository;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAllWithDepartment().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ServiceDTO> getServicesByDepartment(String departmentName) {
        return serviceRepository.findByDepartmentName(departmentName).stream()
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