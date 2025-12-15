package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {

    List<Service> findByDepartmentId(Integer departmentId);

    @Query("SELECT s FROM Service s JOIN FETCH s.department")
    List<Service> findAllWithDepartment();

    @Query("SELECT s FROM Service s JOIN FETCH s.department WHERE s.department.name = :departmentName")
    List<Service> findByDepartmentName(String departmentName);
}