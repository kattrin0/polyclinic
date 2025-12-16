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

    @Transactional
    public UserData registerUser(UserRegistrationDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Пароли не совпадают");
        }

        UserData user = new UserData();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setIsAdmin(false);

        return userRepository.save(user);
    }

    public UserData findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
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

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        if (dto.getIsAdmin() != null) {
            user.setIsAdmin(dto.getIsAdmin());
        }

        // Обновляем пароль только если он указан
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
        return userRepository.existsByEmail(email);
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