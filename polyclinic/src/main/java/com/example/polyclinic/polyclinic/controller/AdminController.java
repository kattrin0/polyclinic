package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.*;
import com.example.polyclinic.polyclinic.service.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final DepartmentService departmentService;
    private final DoctorService doctorService;
    private final ServiceService serviceService;
    private final AppointmentService appointmentService;

    public AdminController(UserService userService,
                           DepartmentService departmentService,
                           DoctorService doctorService,
                           ServiceService serviceService,
                           AppointmentService appointmentService) {
        this.userService = userService;
        this.departmentService = departmentService;
        this.doctorService = doctorService;
        this.serviceService = serviceService;
        this.appointmentService = appointmentService;
    }

    // ==================== ДАШБОРД ====================
    @GetMapping
    public String adminDashboard(Model model, Principal principal) {
        addCommonAttributes(model, principal);
        model.addAttribute("appointments", appointmentService.getAllAppointments());
        return "admin/dashboard";
    }

    // ==================== ПОЛЬЗОВАТЕЛИ ====================
    @GetMapping("/users")
    public String usersPage(Model model, Principal principal) {
        addCommonAttributes(model, principal);
        return "admin/users";
    }

    @PostMapping("/users/{id}/toggle-admin")
    public String toggleAdmin(@PathVariable Integer id) {
        userService.toggleAdmin(id);
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return "redirect:/admin/users";
    }

    // ==================== ВРАЧИ ====================
    @GetMapping("/doctors")
    public String doctorsPage(Model model, Principal principal) {
        addCommonAttributes(model, principal);
        return "admin/doctors";
    }

    @PostMapping("/doctors/{id}/toggle-active")
    public String toggleDoctorActive(@PathVariable Integer id) {
        doctorService.toggleActive(id);
        return "redirect:/admin/doctors";
    }

    // ==================== УСЛУГИ ====================
    @GetMapping("/services")
    public String servicesPage(Model model, Principal principal) {
        addCommonAttributes(model, principal);
        return "admin/services";
    }

    // ==================== ОТДЕЛЕНИЯ ====================
    @GetMapping("/departments")
    public String departmentsPage(Model model, Principal principal) {
        addCommonAttributes(model, principal);
        return "admin/departments";
    }

    // ==================== ЗАПИСИ ====================
    @GetMapping("/appointments")
    public String appointmentsPage(Model model, Principal principal) {
        addCommonAttributes(model, principal);
        model.addAttribute("appointments", appointmentService.getAllAppointments());
        return "admin/appointments";
    }

    // ==================== ОБЩИЕ АТРИБУТЫ ====================
    private void addCommonAttributes(Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        model.addAttribute("services", serviceService.getAllServices());
        model.addAttribute("departments", departmentService.getAllDepartments());
    }
}