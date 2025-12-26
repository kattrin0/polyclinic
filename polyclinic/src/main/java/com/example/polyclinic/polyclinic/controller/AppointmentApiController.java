package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.AppointmentCreateDTO;
import com.example.polyclinic.polyclinic.dto.AppointmentDTO;
import com.example.polyclinic.polyclinic.service.AppointmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentApiController {

    private final AppointmentService appointmentService;

    public AppointmentApiController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<Page<AppointmentDTO>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer doctorId,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, 20, sort);

        return ResponseEntity.ok(appointmentService.getAppointmentsFiltered(status, doctorId, pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Не авторизован"));
        }
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByUserEmail(principal.getName());
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentCreateDTO dto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Не авторизован"));
        }

        try {
            if (dto.getAppointmentDate() != null && dto.getAppointmentDate().contains("T")) {
                String[] parts = dto.getAppointmentDate().split("T");
                dto.setAppointmentDate(parts[0]);
                if (parts.length > 1) {
                    dto.setAppointmentTime(parts[1].substring(0, 5));
                }
            }

            appointmentService.createAppointment(dto, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Запись создана успешно"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Не авторизован"));
        }

        try {
            appointmentService.cancelAppointment(id, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Запись отменена"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            appointmentService.updateStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Статус обновлён"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Integer id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok(Map.of("message", "Запись удалена"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}