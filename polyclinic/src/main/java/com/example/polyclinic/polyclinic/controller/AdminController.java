package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.*;
import com.example.polyclinic.polyclinic.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private static final int PAGE_SIZE = 50;

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
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        model.addAttribute("currentUser", currentUser);

        model.addAttribute("usersCount", userService.count());
        model.addAttribute("doctorsCount", doctorService.count());
        model.addAttribute("servicesCount", serviceService.count());
        model.addAttribute("departmentsCount", departmentService.count());
        model.addAttribute("appointmentsCount", appointmentService.count());

        return "admin/dashboard";
    }

    // ==================== ПОЛЬЗОВАТЕЛИ ====================
    @GetMapping("/users")
    public String usersPage(@RequestParam(defaultValue = "0") int page,
                            Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("id").ascending());
        Page<UserDTO> usersPage = userService.getAllUsersPaged(pageable);

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", usersPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", usersPage.getTotalPages());
        model.addAttribute("totalItems", usersPage.getTotalElements());

        return "admin/users";
    }

    @PostMapping("/users/{id}/update")
    public String updateUser(@PathVariable Integer id,
                             @RequestParam String fullName,
                             @RequestParam String email,
                             @RequestParam(required = false) String phone,
                             @RequestParam(required = false) String password,
                             @RequestParam(required = false) Boolean isAdmin,
                             RedirectAttributes redirectAttributes) {
        try {
            UserEditDTO dto = new UserEditDTO();
            dto.setFullName(fullName);
            dto.setEmail(email);
            dto.setPhone(phone);
            dto.setPassword(password);
            dto.setIsAdmin(isAdmin != null && isAdmin);

            userService.updateUser(id, dto);
            redirectAttributes.addFlashAttribute("success", "Пользователь успешно обновлён");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/toggle-admin")
    public String toggleAdmin(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        try {
            userService.toggleAdmin(id);
            redirectAttributes.addFlashAttribute("success", "Роль пользователя изменена");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    @PostMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        try {
            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("success", "Пользователь удалён");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка удаления: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    // ==================== ВРАЧИ ====================
    @GetMapping("/doctors")
    public String doctorsPage(@RequestParam(defaultValue = "0") int page,
                              Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("id").ascending());
        Page<DoctorDTO> doctorsPage = doctorService.getAllDoctorsPaged(pageable);

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("doctors", doctorsPage.getContent());
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", doctorsPage.getTotalPages());
        model.addAttribute("totalItems", doctorsPage.getTotalElements());

        return "admin/doctors";
    }

    @PostMapping("/doctors/create")
    public String createDoctor(@RequestParam String fullName,
                               @RequestParam String email,
                               @RequestParam(required = false) String phone,
                               @RequestParam String password,
                               @RequestParam String specialization,
                               @RequestParam Integer departmentId,
                               RedirectAttributes redirectAttributes) {
        try {
            DoctorCreateDTO dto = new DoctorCreateDTO();
            dto.setFullName(fullName);
            dto.setEmail(email);
            dto.setPhone(phone);
            dto.setPassword(password);
            dto.setSpecialization(specialization);
            dto.setDepartmentId(departmentId);

            doctorService.createDoctor(dto);
            redirectAttributes.addFlashAttribute("success", "Врач успешно добавлен");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/doctors";
    }

    @PostMapping("/doctors/{id}/update")
    public String updateDoctor(@PathVariable Integer id,
                               @RequestParam String fullName,
                               @RequestParam String specialization,
                               @RequestParam Integer departmentId,
                               @RequestParam(required = false) Boolean isActive,
                               RedirectAttributes redirectAttributes) {
        try {
            DoctorEditDTO dto = new DoctorEditDTO();
            dto.setFullName(fullName);
            dto.setSpecialization(specialization);
            dto.setDepartmentId(departmentId);
            dto.setIsActive(isActive != null && isActive);

            doctorService.updateDoctor(id, dto);
            redirectAttributes.addFlashAttribute("success", "Врач успешно обновлён");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/doctors";
    }

    @PostMapping("/doctors/{id}/toggle-active")
    public String toggleDoctorActive(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        try {
            doctorService.toggleActive(id);
            redirectAttributes.addFlashAttribute("success", "Статус врача изменён");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/doctors";
    }

    @PostMapping("/doctors/{id}/delete")
    public String deleteDoctor(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        try {
            doctorService.deleteDoctor(id);
            redirectAttributes.addFlashAttribute("success", "Врач удалён");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/doctors";
    }
    // ==================== УСЛУГИ ====================
    @GetMapping("/services")
    public String servicesPage(@RequestParam(defaultValue = "0") int page,
                               Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("id").ascending());
        Page<ServiceDTO> servicesPage = serviceService.getAllServicesPaged(pageable);

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("services", servicesPage.getContent());
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", servicesPage.getTotalPages());
        model.addAttribute("totalItems", servicesPage.getTotalElements());

        return "admin/services";
    }

    @PostMapping("/services/{id}/update")
    public String updateService(@PathVariable Integer id,
                                @RequestParam String name,
                                @RequestParam(required = false) String description,
                                @RequestParam java.math.BigDecimal price,
                                @RequestParam Integer departmentId,
                                RedirectAttributes redirectAttributes) {
        try {
            ServiceEditDTO dto = new ServiceEditDTO();
            dto.setName(name);
            dto.setDescription(description);
            dto.setPrice(price);
            dto.setDepartmentId(departmentId);

            serviceService.updateService(id, dto);
            redirectAttributes.addFlashAttribute("success", "Услуга успешно обновлена");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/services";
    }

    @PostMapping("/services/{id}/delete")
    public String deleteService(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        try {
            serviceService.deleteService(id);
            redirectAttributes.addFlashAttribute("success", "Услуга удалена");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/services";
    }

    @PostMapping("/services/create")
    public String createService(@RequestParam String name,
                                @RequestParam(required = false) String description,
                                @RequestParam java.math.BigDecimal price,
                                @RequestParam Integer departmentId,
                                RedirectAttributes redirectAttributes) {
        try {
            ServiceEditDTO dto = new ServiceEditDTO();
            dto.setName(name);
            dto.setDescription(description);
            dto.setPrice(price);
            dto.setDepartmentId(departmentId);

            serviceService.createService(dto);
            redirectAttributes.addFlashAttribute("success", "Услуга создана");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/services";
    }

    // ==================== ОТДЕЛЕНИЯ ====================
    @GetMapping("/departments")
    public String departmentsPage(@RequestParam(defaultValue = "0") int page,
                                  Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("id").ascending());
        Page<DepartmentDTO> departmentsPage = departmentService.getAllDepartmentsPaged(pageable);

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("departments", departmentsPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", departmentsPage.getTotalPages());
        model.addAttribute("totalItems", departmentsPage.getTotalElements());

        return "admin/departments";
    }

    @PostMapping("/departments/{id}/update")
    public String updateDepartment(@PathVariable Integer id,
                                   @RequestParam String name,
                                   @RequestParam(required = false) String description,
                                   RedirectAttributes redirectAttributes) {
        try {
            DepartmentDTO dto = new DepartmentDTO();
            dto.setName(name);
            dto.setDescription(description);

            departmentService.updateDepartment(id, dto);
            redirectAttributes.addFlashAttribute("success", "Отделение обновлено");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/departments";
    }

    @PostMapping("/departments/create")
    public String createDepartment(@RequestParam String name,
                                   @RequestParam(required = false) String description,
                                   RedirectAttributes redirectAttributes) {
        try {
            DepartmentDTO dto = new DepartmentDTO();
            dto.setName(name);
            dto.setDescription(description);

            departmentService.createDepartment(dto);
            redirectAttributes.addFlashAttribute("success", "Отделение создано");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/departments";
    }

    @PostMapping("/departments/{id}/delete")
    public String deleteDepartment(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        try {
            departmentService.deleteDepartment(id);
            redirectAttributes.addFlashAttribute("success", "Отделение удалено");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/departments";
    }

    // ==================== ЗАПИСИ ====================
    @GetMapping("/appointments")
    public String appointmentsPage(@RequestParam(defaultValue = "0") int page,
                                   Model model, Principal principal) {
        UserDTO currentUser = userService.getUserDTO(principal.getName());
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("id").ascending());
        Page<AppointmentDTO> appointmentsPage = appointmentService.getAllAppointmentsPaged(pageable);

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("appointments", appointmentsPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", appointmentsPage.getTotalPages());
        model.addAttribute("totalItems", appointmentsPage.getTotalElements());

        return "admin/appointments";
    }

    @PostMapping("/appointments/{id}/update-status")
    public String updateAppointmentStatus(@PathVariable Integer id,
                                          @RequestParam String status,
                                          RedirectAttributes redirectAttributes) {
        try {
            appointmentService.updateStatus(id, status);
            redirectAttributes.addFlashAttribute("success", "Статус записи изменён");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/appointments";
    }

    @PostMapping("/appointments/{id}/delete")
    public String deleteAppointment(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        try {
            appointmentService.deleteAppointment(id);
            redirectAttributes.addFlashAttribute("success", "Запись удалена");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
        }
        return "redirect:/admin/appointments";
    }

}