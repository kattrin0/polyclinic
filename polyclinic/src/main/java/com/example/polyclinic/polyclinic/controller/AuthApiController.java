package com.example.polyclinic.polyclinic.controller;

import com.example.polyclinic.polyclinic.dto.UserDTO;
import com.example.polyclinic.polyclinic.dto.UserEditDTO;
import com.example.polyclinic.polyclinic.dto.UserRegistrationDTO;
import com.example.polyclinic.polyclinic.entity.UserData;
import com.example.polyclinic.polyclinic.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private final UserService userService;

    public AuthApiController(UserService userService) {
        this.userService = userService;
    }

    // ЛОГИН
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {

            UserData user = userService.findByEmail(request.getEmail());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Неверный email или пароль"));
            }


            if (!userService.checkPassword(request.getEmail(), request.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Неверный email или пароль"));
            }


            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            if (Boolean.TRUE.equals(user.getIsAdmin())) {
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            }

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);


            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authToken);
            SecurityContextHolder.setContext(securityContext);


            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);


            UserDTO userDTO = new UserDTO(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getPhone(),
                    Boolean.TRUE.equals(user.getIsAdmin())
            );

            Map<String, Object> response = new HashMap<>();
            response.put("user", userDTO);
            response.put("message", "Успешный вход");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Ошибка авторизации: " + e.getMessage()));
        }
    }

    // РЕГИСТРАЦИЯ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDTO dto) {
        try {
            // Проверка обязательных полей
            if (dto.getFullName() == null || dto.getFullName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Введите ФИО"));
            }

            if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Введите email"));
            }

            if (dto.getPassword() == null || dto.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Пароль должен содержать минимум 6 символов"));
            }

            //  совпадение паролей
            if (dto.getConfirmPassword() == null || !dto.getPassword().equals(dto.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Пароли не совпадают"));
            }

            //  существование email
            if (userService.existsByEmail(dto.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Пользователь с таким email уже существует"));
            }

            // Регистрация
            userService.registerUser(dto);

            return ResponseEntity.ok(Map.of("message", "Регистрация успешна"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Ошибка регистрации: " + e.getMessage()));
        }
    }

    //ПОЛУЧИТЬ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Не авторизован"));
        }

        try {
            UserDTO user = userService.getUserDTO(principal.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Пользователь не найден"));
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Ошибка получения пользователя"));
        }
    }

    // ОБНОВИТЬ ПРОФИЛЬ
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserEditDTO dto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Не авторизован"));
        }

        try {
            UserDTO currentUser = userService.getUserDTO(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Пользователь не найден"));
            }

            userService.updateUser(currentUser.getId(), dto);

            // Возвращаем обновлённые данные
            String newEmail = dto.getEmail() != null && !dto.getEmail().isEmpty()
                    ? dto.getEmail()
                    : principal.getName();
            UserDTO updatedUser = userService.getUserDTO(newEmail);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    //  ВЫХОД
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(Map.of("message", "Выход выполнен"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("message", "Выход выполнен"));
        }
    }

    // DTO для логина
    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}