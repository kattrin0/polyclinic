package com.example.polyclinic.polyclinic.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // маршруты Router

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/services",
            "/doctors",
            "/contacts",
            "/profile",
            "/my-appointments",
            "/book-appointment"
    })
    public String index() {
        return "forward:/index.html";
    }

    // aдминские маршруты
    @GetMapping(value = {
            "/admin",
            "/admin/users",
            "/admin/doctors",
            "/admin/services",
            "/admin/departments",
            "/admin/appointments"
    })
    public String admin() {
        return "forward:/index.html";
    }
}