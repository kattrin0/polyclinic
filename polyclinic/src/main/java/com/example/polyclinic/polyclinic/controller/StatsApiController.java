package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsApiController {

    private final UserService userService;
    private final DoctorService doctorService;
    private final ServiceService serviceService;
    private final DepartmentService departmentService;
    private final AppointmentService appointmentService;

    public StatsApiController(UserService userService,
                              DoctorService doctorService,
                              ServiceService serviceService,
                              DepartmentService departmentService,
                              AppointmentService appointmentService) {
        this.userService = userService;
        this.doctorService = doctorService;
        this.serviceService = serviceService;
        this.departmentService = departmentService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("usersCount", userService.count());
        stats.put("doctorsCount", doctorService.count());
        stats.put("servicesCount", serviceService.count());
        stats.put("departmentsCount", departmentService.count());
        stats.put("appointmentsCount", appointmentService.count());
        return ResponseEntity.ok(stats);
    }
}