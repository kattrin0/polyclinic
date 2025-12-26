package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByPatientId(Integer patientId);

    List<Appointment> findByDoctorId(Integer doctorId);

    List<Appointment> findByStatus(String status);

    // Фильтрация с пагинацией
    @Query("SELECT a FROM Appointment a " +
            "WHERE (:status IS NULL OR a.status = :status) " +
            "AND (:doctorId IS NULL OR a.doctor.id = :doctorId)")
    Page<Appointment> findAllFiltered(
            @Param("status") String status,
            @Param("doctorId") Integer doctorId,
            Pageable pageable);

    // Подсчёт записей за период
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end")
    Long countByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Выручка за период (только завершённые)
    @Query("SELECT COALESCE(SUM(a.price), 0) FROM Appointment a " +
            "WHERE a.status = 'Завершен' AND a.appointmentDate BETWEEN :start AND :end")
    BigDecimal sumRevenueByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Популярные услуги
    @Query("SELECT s.id, s.name, s.department.name, COUNT(a), COALESCE(SUM(a.price), 0) " +
            "FROM Appointment a " +
            "JOIN a.service s " +
            "WHERE a.appointmentDate >= :since " +
            "GROUP BY s.id, s.name, s.department.name " +
            "ORDER BY COUNT(a) DESC")
    List<Object[]> findPopularServices(@Param("since") LocalDateTime since, Pageable pageable);

    // Популярные врачи
    @Query("SELECT d.id, d.user.fullName, d.specialization, d.department.name, " +
            "COUNT(a), " +
            "SUM(CASE WHEN a.status = 'Завершен' THEN 1 ELSE 0 END), " +
            "COALESCE(SUM(CASE WHEN a.status = 'Завершен' THEN a.price ELSE 0 END), 0) " +
            "FROM Appointment a " +
            "JOIN a.doctor d " +
            "WHERE a.appointmentDate >= :since " +
            "GROUP BY d.id, d.user.fullName, d.specialization, d.department.name " +
            "ORDER BY COUNT(a) DESC")
    List<Object[]> findPopularDoctors(@Param("since") LocalDateTime since, Pageable pageable);

    // Месячная статистика
    @Query("SELECT FUNCTION('YEAR', a.appointmentDate), FUNCTION('MONTH', a.appointmentDate), " +
            "COUNT(a), " +
            "SUM(CASE WHEN a.status = 'Завершен' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN a.status = 'Отменен' THEN 1 ELSE 0 END), " +
            "COALESCE(SUM(CASE WHEN a.status = 'Завершен' THEN a.price ELSE 0 END), 0) " +
            "FROM Appointment a " +
            "WHERE a.appointmentDate >= :since " +
            "GROUP BY FUNCTION('YEAR', a.appointmentDate), FUNCTION('MONTH', a.appointmentDate) " +
            "ORDER BY FUNCTION('YEAR', a.appointmentDate) DESC, FUNCTION('MONTH', a.appointmentDate) DESC")
    List<Object[]> findMonthlyStats(@Param("since") LocalDateTime since);

    // Статистика по отделениям
    @Query("SELECT d.department.id, d.department.name, " +
            "COUNT(DISTINCT d.id), " +
            "COUNT(a), " +
            "SUM(CASE WHEN a.status = 'Завершен' THEN 1 ELSE 0 END), " +
            "COALESCE(SUM(CASE WHEN a.status = 'Завершен' THEN a.price ELSE 0 END), 0) " +
            "FROM Appointment a " +
            "JOIN a.doctor d " +
            "WHERE a.appointmentDate >= :since " +
            "GROUP BY d.department.id, d.department.name " +
            "ORDER BY COUNT(a) DESC")
    List<Object[]> findDepartmentStats(@Param("since") LocalDateTime since);

    // Врачи по отделению
    @Query("SELECT d.id, d.user.fullName, d.specialization, " +
            "COUNT(a), COALESCE(SUM(CASE WHEN a.status = 'Завершен' THEN a.price ELSE 0 END), 0) " +
            "FROM Appointment a " +
            "JOIN a.doctor d " +
            "WHERE d.department.id = :departmentId AND a.appointmentDate >= :since " +
            "GROUP BY d.id, d.user.fullName, d.specialization " +
            "ORDER BY COUNT(a) DESC")
    List<Object[]> findDoctorStatsByDepartment(
            @Param("departmentId") Integer departmentId,
            @Param("since") LocalDateTime since,
            Pageable pageable);
}