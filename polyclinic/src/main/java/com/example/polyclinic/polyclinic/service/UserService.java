package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.UserDTO;
import com.example.polyclinic.polyclinic.dto.UserEditDTO;
import com.example.polyclinic.polyclinic.dto.UserRegistrationDTO;
import com.example.polyclinic.polyclinic.entity.UserData;
import com.example.polyclinic.polyclinic.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // для очистки текста от HTML
    private String sanitize(String input) {
        if (input == null) return null;
        return HtmlUtils.htmlEscape(input).trim();
    }

    //  для очистки email
    private String sanitizeEmail(String email) {
        if (email == null) return null;
        return email.replaceAll("[^a-zA-Z0-9@._-]", "").toLowerCase().trim();
    }

    //  для очистки телефона
    private String sanitizePhone(String phone) {
        if (phone == null) return null;
        return phone.replaceAll("[^0-9+\\s()-]", "").trim();
    }
    // для проверки пароля
    public boolean checkPassword(String email, String rawPassword) {
        UserData user = userRepository.findByEmail(sanitizeEmail(email)).orElse(null);
        if (user == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    // Добавьте в UserService метод с фильтрацией:



    public Page<UserDTO> getUsersFiltered(Boolean isAdmin, Pageable pageable) {
        Page<UserData> users;
        if (isAdmin == null) {
            users = userRepository.findAll(pageable);
        } else {
            users = userRepository.findByIsAdmin(isAdmin, pageable);
        }
        return users.map(this::convertToDTO);
    }
    @Transactional
    public UserData registerUser(UserRegistrationDTO dto) {
        String fullName = sanitize(dto.getFullName());
        String email = sanitizeEmail(dto.getEmail());
        String phone = sanitizePhone(dto.getPhone());

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Пароли не совпадают");
        }

        UserData user = new UserData();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setIsAdmin(false);

        return userRepository.save(user);
    }

    public UserData findByEmail(String email) {
        String sanitizedEmail = sanitizeEmail(email);
        return userRepository.findByEmail(sanitizedEmail).orElse(null);
    }

    public UserDTO getUserDTO(String email) {
        UserData user = findByEmail(email);
        if (user == null) return null;

        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsAdmin() != null && user.getIsAdmin()
        );
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<UserDTO> getAllUsersPaged(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::convertToDTO);
    }

    public UserEditDTO getUserForEdit(Integer id) {
        UserData user = userRepository.findById(id).orElse(null);
        if (user == null) return null;

        return new UserEditDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsAdmin()
        );
    }

    @Transactional
    public void updateUser(Integer id, UserEditDTO dto) {
        UserData user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        String fullName = sanitize(dto.getFullName());
        String email = sanitizeEmail(dto.getEmail());
        String phone = sanitizePhone(dto.getPhone());

        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);

        if (dto.getIsAdmin() != null) {
            user.setIsAdmin(dto.getIsAdmin());
        }

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepository.save(user);
    }

    @Transactional
    public void toggleAdmin(Integer id) {
        UserData user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setIsAdmin(!Boolean.TRUE.equals(user.getIsAdmin()));
            userRepository.save(user);
        }
    }

    @Transactional
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        String sanitizedEmail = sanitizeEmail(email);
        return userRepository.existsByEmail(sanitizedEmail);
    }

    public long count() {
        return userRepository.count();
    }

    private UserDTO convertToDTO(UserData user) {
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getIsAdmin() != null && user.getIsAdmin()
        );
    }
}