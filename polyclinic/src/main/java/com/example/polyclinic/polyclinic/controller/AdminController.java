package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.UserDTO;
import com.example.polyclinic.polyclinic.service.DepartmentService;
import com.example.polyclinic.polyclinic.service.DoctorService;
import com.example.polyclinic.polyclinic.service.ServiceService;
import com.example.polyclinic.polyclinic.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final DepartmentService departmentService;
    private final DoctorService doctorService;
    private final ServiceService serviceService;

    public AdminController(UserService userService,
                           DepartmentService departmentService,
                           DoctorService doctorService,
                           ServiceService serviceService) {
        this.userService = userService;
        this.departmentService = departmentService;
        this.doctorService = doctorService;
        this.serviceService = serviceService;
    }

    @GetMapping
    public String adminDashboard(Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        List<UserDTO> users = userService.getAllUsers();

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", users);
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        model.addAttribute("services", serviceService.getAllServices());

        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String usersPage(Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        List<UserDTO> users = userService.getAllUsers();

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", users);

        return "admin/users";
    }
}