//package com.example.polyclinic.polyclinic.controller;
//
//import com.example.polyclinic.polyclinic.dto.*;
//import com.example.polyclinic.polyclinic.service.*;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.mvc.support.RedirectAttributes;
//
//import java.security.Principal;
//
//@Controller
//@RequestMapping("/appointment")
//public class AppointmentController {
//
//    private final ServiceService serviceService;
//    private final DoctorService doctorService;
//    private final DepartmentService departmentService;
//    private final AppointmentService appointmentService;
//    private final UserService userService;
//
//    public AppointmentController(ServiceService serviceService,
//                                 DoctorService doctorService,
//                                 DepartmentService departmentService,
//                                 AppointmentService appointmentService,
//                                 UserService userService) {
//        this.serviceService = serviceService;
//        this.doctorService = doctorService;
//        this.departmentService = departmentService;
//        this.appointmentService = appointmentService;
//        this.userService = userService;
//    }
//
//    @GetMapping("/book")
//    public String bookingPage(@RequestParam(required = false) Integer serviceId,
//                              @RequestParam(required = false) Integer doctorId,
//                              Model model, Principal principal) {
//        UserDTO currentUser = userService.getUserDTO(principal.getName());
//
//        model.addAttribute("currentUser", currentUser);
//        model.addAttribute("departments", departmentService.getAllDepartments());
//        model.addAttribute("services", serviceService.getAllServices());
//        model.addAttribute("doctors", doctorService.getActiveDoctors());
//        model.addAttribute("selectedServiceId", serviceId);
//        model.addAttribute("selectedDoctorId", doctorId);
//
//        return "appointment/book";
//    }
//
//    @PostMapping("/book")
//    public String createAppointment(@RequestParam Integer serviceId,
//                                    @RequestParam Integer doctorId,
//                                    @RequestParam String appointmentDate,
//                                    @RequestParam String appointmentTime,
//                                    @RequestParam(required = false) String notes,
//                                    Principal principal,
//                                    RedirectAttributes redirectAttributes) {
//        try {
//            AppointmentCreateDTO dto = new AppointmentCreateDTO();
//            dto.setServiceId(serviceId);
//            dto.setDoctorId(doctorId);
//            dto.setAppointmentDate(appointmentDate);
//            dto.setAppointmentTime(appointmentTime);
//            dto.setNotes(notes);
//
//            appointmentService.createAppointment(dto, principal.getName());
//            redirectAttributes.addFlashAttribute("success", "Вы успешно записались на приём!");
//            return "redirect:/profile/appointments";
//        } catch (Exception e) {
//            redirectAttributes.addFlashAttribute("error", "Ошибка: " + e.getMessage());
//            return "redirect:/appointment/book";
//        }
//    }
//}