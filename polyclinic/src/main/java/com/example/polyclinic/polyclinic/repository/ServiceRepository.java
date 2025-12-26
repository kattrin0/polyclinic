package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {

    List<Service> findByDepartmentId(Integer departmentId);

    List<Service> findByDepartmentName(String departmentName);

    @Query("SELECT s FROM Service s JOIN FETCH s.department")
    List<Service> findAllWithDepartment();

    // Фильтрация с пагинацией
    @Query("SELECT s FROM Service s WHERE :departmentId IS NULL OR s.department.id = :departmentId")
    Page<Service> findAllFiltered(@Param("departmentId") Integer departmentId, Pageable pageable);
}