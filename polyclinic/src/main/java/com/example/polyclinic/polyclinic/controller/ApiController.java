package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.DepartmentDTO;
import com.example.polyclinic.polyclinic.dto.DoctorDTO;
import com.example.polyclinic.polyclinic.dto.ServiceDTO;
import com.example.polyclinic.polyclinic.service.DepartmentService;
import com.example.polyclinic.polyclinic.service.DoctorService;
import com.example.polyclinic.polyclinic.service.ServiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final DepartmentService departmentService;
    private final DoctorService doctorService;
    private final ServiceService serviceService;

    public ApiController(DepartmentService departmentService,
                         DoctorService doctorService,
                         ServiceService serviceService) {
        this.departmentService = departmentService;
        this.doctorService = doctorService;
        this.serviceService = serviceService;
    }

    @GetMapping("/departments")
    public List<DepartmentDTO> getDepartments() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/doctors")
    public List<DoctorDTO> getDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/doctors/active")
    public List<DoctorDTO> getActiveDoctors() {
        return doctorService.getActiveDoctors();
    }

    @GetMapping("/doctors/department/{departmentId}")
    public List<DoctorDTO> getDoctorsByDepartment(@PathVariable Integer departmentId) {
        return doctorService.getDoctorsByDepartmentId(departmentId);
    }

    @GetMapping("/services")
    public List<ServiceDTO> getServices() {
        return serviceService.getAllServices();
    }

    @GetMapping("/services/department/{departmentName}")
    public List<ServiceDTO> getServicesByDepartment(@PathVariable String departmentName) {
        return serviceService.getServicesByDepartment(departmentName);
    }

    @GetMapping("/services/department-id/{departmentId}")
    public List<ServiceDTO> getServicesByDepartmentId(@PathVariable Integer departmentId) {
        return serviceService.getServicesByDepartmentId(departmentId);
    }
}