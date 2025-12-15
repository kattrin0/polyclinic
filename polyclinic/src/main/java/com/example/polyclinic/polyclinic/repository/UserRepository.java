package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserData, Integer> {
    Optional<UserData> findByEmail(String email);
    boolean existsByEmail(String email);
}