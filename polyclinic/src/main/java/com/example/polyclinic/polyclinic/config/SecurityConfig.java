package com.example.polyclinic.polyclinic.config;

import com.example.polyclinic.polyclinic.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ВАЖНО: Статические ресурсы в первую очередь!
                        .requestMatchers("/css/**", "/js/**", "/img/**", "/images/**", "/fonts/**").permitAll()
                        .requestMatchers("/index.html", "/favicon.ico").permitAll()

                        // SPA маршруты
                        .requestMatchers("/", "/login", "/register", "/services", "/doctors", "/contacts").permitAll()
                        .requestMatchers("/profile", "/profile/**", "/my-appointments", "/book-appointment").permitAll()
                        .requestMatchers("/admin", "/admin/**").permitAll()

                        // Публичные API
                        .requestMatchers("/api/departments/**").permitAll()
                        .requestMatchers("/api/doctors/**").permitAll()
                        .requestMatchers("/api/services/**").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                        // API требующие авторизации
                        .requestMatchers("/api/auth/me", "/api/auth/profile", "/api/auth/logout").authenticated()
                        .requestMatchers("/api/appointments/my").authenticated()
                        .requestMatchers("/api/appointments/**").authenticated()

                        // Админские API
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/stats/**").hasRole("ADMIN")

                        .anyRequest().permitAll()
                )
                .userDetailsService(userDetailsService)
                .formLogin(form -> form.disable())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.setStatus(401);
                            response.getWriter().write("{\"message\": \"Не авторизован\"}");
                        })
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.getWriter().write("{\"message\": \"Выход выполнен\"}");
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        return http.build();
    }
}