package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    List<Doctor> findByIsActiveTrue();

    List<Doctor> findByDepartmentId(Integer departmentId);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department")
    List<Doctor> findAllWithUserAndDepartment();

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department WHERE d.isActive = true")
    List<Doctor> findAllActiveWithUserAndDepartment();
}