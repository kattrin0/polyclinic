package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.DoctorCreateDTO;
import com.example.polyclinic.polyclinic.dto.DoctorDTO;
import com.example.polyclinic.polyclinic.dto.DoctorEditDTO;
import com.example.polyclinic.polyclinic.service.DoctorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @GetMapping
    public ResponseEntity<?> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "false") boolean paginated) {

        // Без пагинации - для публичных страниц
        if (!paginated) {
            if (Boolean.TRUE.equals(active)) {
                return ResponseEntity.ok(doctorService.getActiveDoctors());
            }
            if (departmentId != null) {
                return ResponseEntity.ok(doctorService.getDoctorsByDepartmentId(departmentId));
            }
            return ResponseEntity.ok(doctorService.getAllDoctors());
        }

        // С пагинацией - для админки
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, 20, sort);

        return ResponseEntity.ok(doctorService.getDoctorsFiltered(departmentId, active, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Integer id) {
        DoctorEditDTO doctor = doctorService.getDoctorForEdit(id);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(doctor);
    }

    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody DoctorCreateDTO dto) {
        try {
            doctorService.createDoctor(dto);
            return ResponseEntity.ok(Map.of("message", "Врач добавлен"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Integer id, @RequestBody DoctorEditDTO dto) {
        try {
            doctorService.updateDoctor(id, dto);
            return ResponseEntity.ok(Map.of("message", "Врач обновлён"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleActive(@PathVariable Integer id) {
        try {
            doctorService.toggleActive(id);
            return ResponseEntity.ok(Map.of("message", "Статус изменён"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

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