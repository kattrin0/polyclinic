package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.ServiceDTO;
import com.example.polyclinic.polyclinic.dto.ServiceEditDTO;
import com.example.polyclinic.polyclinic.service.ServiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @GetMapping
    public ResponseEntity<?> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "false") boolean paginated) {

        // Без пагинации - для публичных страниц
        if (!paginated) {
            if (departmentId != null) {
                return ResponseEntity.ok(serviceService.getServicesByDepartmentId(departmentId));
            }
            return ResponseEntity.ok(serviceService.getAllServices());
        }

        // С пагинацией - для админки
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, 20, sort);

        return ResponseEntity.ok(serviceService.getServicesFiltered(departmentId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Integer id) {
        ServiceEditDTO service = serviceService.getServiceForEdit(id);
        if (service == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service);
    }

    @PostMapping
    public ResponseEntity<?> createService(@RequestBody ServiceEditDTO dto) {
        try {
            serviceService.createService(dto);
            return ResponseEntity.ok(Map.of("message", "Услуга создана"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Integer id, @RequestBody ServiceEditDTO dto) {
        try {
            serviceService.updateService(id, dto);
            return ResponseEntity.ok(Map.of("message", "Услуга обновлена"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

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