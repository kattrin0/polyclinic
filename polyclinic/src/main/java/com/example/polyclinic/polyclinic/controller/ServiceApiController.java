package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.ServiceDTO;
import com.example.polyclinic.polyclinic.dto.ServiceEditDTO;
import com.example.polyclinic.polyclinic.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class ServiceApiController {

    private final ServiceService serviceService;

    public ServiceApiController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // Получить все услуги
    @GetMapping
    public ResponseEntity<List<ServiceDTO>> getAllServices(
            @RequestParam(required = false) Integer departmentId) {

        if (departmentId != null) {
            return ResponseEntity.ok(serviceService.getServicesByDepartmentId(departmentId));
        }
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    // Получить услугу по ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Integer id) {
        ServiceEditDTO service = serviceService.getServiceForEdit(id);
        if (service == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service);
    }

    // Создать услугу
    @PostMapping
    public ResponseEntity<?> createService(@RequestBody ServiceEditDTO dto) {
        try {
            serviceService.createService(dto);
            return ResponseEntity.ok(Map.of("message", "Услуга создана"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Обновить услугу
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Integer id, @RequestBody ServiceEditDTO dto) {
        try {
            serviceService.updateService(id, dto);
            return ResponseEntity.ok(Map.of("message", "Услуга обновлена"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Удалить услугу
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Integer id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.ok(Map.of("message", "Услуга удалена"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}