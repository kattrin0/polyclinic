//package com.example.polyclinic.polyclinic.controller;
//
//import com.example.polyclinic.polyclinic.dto.AppointmentDTO;
//import com.example.polyclinic.polyclinic.dto.UserDTO;
//import com.example.polyclinic.polyclinic.dto.UserEditDTO;
//import com.example.polyclinic.polyclinic.service.AppointmentService;
//import com.example.polyclinic.polyclinic.service.UserService;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.mvc.support.RedirectAttributes;
//
//import java.security.Principal;
//import java.util.List;
//
//@Controller
//@RequestMapping("/profile")
//public class ProfileController {
//
//    private final UserService userService;
//    private final AppointmentService appointmentService;
//
//    public ProfileController(UserService userService, AppointmentService appointmentService) {
//        this.userService = userService;
//        this.appointmentService = appointmentService;
//    }
//
//    @GetMapping
//    public String profilePage(Model model, Principal principal) {
//        UserDTO currentUser = userService.getUserDTO(principal.getName());
//        model.addAttribute("currentUser", currentUser);
//        return "profile/index";
//    }
//
//    @PostMapping("/update")
//    public String updateProfile(@RequestParam String fullName,
//                                @RequestParam String email,
//                                @RequestParam(required = false) String phone,
//                                @RequestParam(required = false) String password,
//                                Principal principal,
//                                RedirectAttributes redirectAttributes) {
//        try {
//            UserDTO currentUser = userService.getUserDTO(principal.getName());
//
//            UserEditDTO dto = new UserEditDTO();
//            dto.setFullName(fullName);
//            dto.setEmail(email);
//            dto.setPhone(phone);
//            dto.setPassword(password);
//
//            userService.updateUser(currentUser.getId(), dto);
//            redirectAttributes.addFlashAttribute("success", "Профиль успешно обновлён");
//        } catch (Exception e) {
//            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
//        }
//        return "redirect:/profile";
//    }
//
//    @GetMapping("/appointments")
//    public String myAppointments(Model model, Principal principal) {
//        UserDTO currentUser = userService.getUserDTO(principal.getName());
//        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByUserEmail(principal.getName());
//
//        model.addAttribute("currentUser", currentUser);
//        model.addAttribute("appointments", appointments);
//        return "profile/appointments";
//    }
//
//    @PostMapping("/appointments/{id}/cancel")
//    public String cancelAppointment(@PathVariable Integer id,
//                                    Principal principal,
//                                    RedirectAttributes redirectAttributes) {
//        try {
//            appointmentService.cancelAppointment(id, principal.getName());
//            redirectAttributes.addFlashAttribute("success", "Запись отменена");
//        } catch (Exception e) {
//            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
//        }
//        return "redirect:/profile/appointments";
//    }
//}