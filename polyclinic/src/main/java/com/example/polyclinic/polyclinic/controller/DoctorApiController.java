package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.DoctorCreateDTO;
import com.example.polyclinic.polyclinic.dto.DoctorDTO;
import com.example.polyclinic.polyclinic.dto.DoctorEditDTO;
import com.example.polyclinic.polyclinic.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorApiController {

    private final DoctorService doctorService;

    public DoctorApiController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // Получить всех врачей
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Integer departmentId) {

        if (Boolean.TRUE.equals(active)) {
            return ResponseEntity.ok(doctorService.getActiveDoctors());
        }
        if (departmentId != null) {
            return ResponseEntity.ok(doctorService.getDoctorsByDepartmentId(departmentId));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // Получить врача по ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Integer id) {
        DoctorEditDTO doctor = doctorService.getDoctorForEdit(id);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(doctor);
    }

    // Создать врача
    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody DoctorCreateDTO dto) {
        try {
            doctorService.createDoctor(dto);
            return ResponseEntity.ok(Map.of("message", "Врач добавлен"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Обновить врача
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Integer id, @RequestBody DoctorEditDTO dto) {
        try {
            doctorService.updateDoctor(id, dto);
            return ResponseEntity.ok(Map.of("message", "Врач обновлён"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Переключить статус активности
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleActive(@PathVariable Integer id) {
        try {
            doctorService.toggleActive(id);
            return ResponseEntity.ok(Map.of("message", "Статус изменён"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Удалить врача
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Integer id) {
        try {
            doctorService.deleteDoctor(id);
            return ResponseEntity.ok(Map.of("message", "Врач удалён"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}