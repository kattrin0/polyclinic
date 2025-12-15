package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findBySnils(String snils);
    Optional<Patient> findByUserId(Integer userId);
}