package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.DepartmentDTO;
import com.example.polyclinic.polyclinic.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")
public class DepartmentApiController {

    private final DepartmentService departmentService;

    public DepartmentApiController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Получить все отделения
    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // Получить отделение по ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartmentById(@PathVariable Integer id) {
        DepartmentDTO dept = departmentService.getDepartmentById(id);
        if (dept == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dept);
    }

    // Создать отделение
    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentDTO dto) {
        try {
            departmentService.createDepartment(dto);
            return ResponseEntity.ok(Map.of("message", "Отделение создано"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Обновить отделение
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Integer id, @RequestBody DepartmentDTO dto) {
        try {
            departmentService.updateDepartment(id, dto);
            return ResponseEntity.ok(Map.of("message", "Отделение обновлено"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Удалить отделение
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Integer id) {
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok(Map.of("message", "Отделение удалено"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}