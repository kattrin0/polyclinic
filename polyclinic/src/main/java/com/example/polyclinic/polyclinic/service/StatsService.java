package com.example.polyclinic.polyclinic.service;

import com.example.polyclinic.polyclinic.dto.*;
import com.example.polyclinic.polyclinic.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final ServiceRepository serviceRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;

    public StatsService(UserRepository userRepository,
                        DoctorRepository doctorRepository,
                        ServiceRepository serviceRepository,
                        DepartmentRepository departmentRepository,
                        AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.serviceRepository = serviceRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime sixMonthsAgo = now.minusMonths(6);
        LocalDateTime oneYearAgo = now.minusYears(1);

        // Базовая статистика
        stats.setUsersCount(userRepository.count());
        stats.setDoctorsCount(doctorRepository.count());
        stats.setServicesCount(serviceRepository.count());
        stats.setDepartmentsCount(departmentRepository.count());
        stats.setAppointmentsCount(appointmentRepository.count());

        // Статистика за текущий месяц
        try {
            Long countThisMonth = appointmentRepository.countByDateRange(startOfMonth, now);
            stats.setAppointmentsThisMonth(countThisMonth != null ? countThisMonth : 0L);
        } catch (Exception e) {
            stats.setAppointmentsThisMonth(0L);
        }

        try {
            BigDecimal revenue = appointmentRepository.sumRevenueByDateRange(startOfMonth, now);
            stats.setRevenueThisMonth(revenue != null ? revenue : BigDecimal.ZERO);
        } catch (Exception e) {
            stats.setRevenueThisMonth(BigDecimal.ZERO);
        }

        // Популярные услуги
        stats.setPopularServices(getPopularServices(sixMonthsAgo, 5));

        // Популярные врачи
        stats.setPopularDoctors(getPopularDoctors(sixMonthsAgo, 5));

        // Месячная статистика
        stats.setMonthlyStats(getMonthlyStats(sixMonthsAgo));

        // Статистика по отделениям
        stats.setDepartmentStats(getDepartmentStats(oneYearAgo));

        return stats;
    }

    private List<PopularServiceDTO> getPopularServices(LocalDateTime since, int limit) {
        try {
            List<Object[]> results = appointmentRepository.findPopularServices(since, PageRequest.of(0, limit));
            return results.stream()
                    .map(row -> new PopularServiceDTO(
                            toInteger(row[0]),
                            (String) row[1],
                            (String) row[2],
                            toLong(row[3]),
                            toBigDecimal(row[4])
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<PopularDoctorDTO> getPopularDoctors(LocalDateTime since, int limit) {
        try {
            List<Object[]> results = appointmentRepository.findPopularDoctors(since, PageRequest.of(0, limit));
            return results.stream()
                    .map(row -> new PopularDoctorDTO(
                            toInteger(row[0]),
                            (String) row[1],
                            (String) row[2],
                            (String) row[3],
                            toLong(row[4]),
                            toLong(row[5]),
                            toBigDecimal(row[6])
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<MonthlyStatsDTO> getMonthlyStats(LocalDateTime since) {
        try {
            List<Object[]> results = appointmentRepository.findMonthlyStats(since);
            return results.stream()
                    .map(row -> {
                        Integer year = toInteger(row[0]);
                        Integer month = toInteger(row[1]);
                        String monthName = "";
                        try {
                            monthName = Month.of(month).getDisplayName(TextStyle.FULL_STANDALONE, new Locale("ru"));
                            monthName = capitalize(monthName) + " " + year;
                        } catch (Exception e) {
                            monthName = month + "/" + year;
                        }

                        return new MonthlyStatsDTO(
                                year,
                                month,
                                monthName,
                                toLong(row[2]),
                                toLong(row[3]),
                                toLong(row[4]),
                                toBigDecimal(row[5])
                        );
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<DepartmentStatsDTO> getDepartmentStats(LocalDateTime since) {
        try {
            List<Object[]> results = appointmentRepository.findDepartmentStats(since);
            return results.stream()
                    .map(row -> {
                        DepartmentStatsDTO dto = new DepartmentStatsDTO();
                        dto.setId(toInteger(row[0]));
                        dto.setName((String) row[1]);
                        dto.setDoctorsCount(toLong(row[2]));
                        dto.setAppointmentsCount(toLong(row[3]));
                        dto.setCompletedCount(toLong(row[4]));
                        dto.setTotalRevenue(toBigDecimal(row[5]));

                        // Топ врачи отделения
                        dto.setTopDoctors(getDoctorStatsByDepartment(dto.getId(), since, 3));

                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<DoctorStatsDTO> getDoctorStatsByDepartment(Integer departmentId, LocalDateTime since, int limit) {
        try {
            List<Object[]> results = appointmentRepository.findDoctorStatsByDepartment(
                    departmentId, since, PageRequest.of(0, limit));
            return results.stream()
                    .map(row -> new DoctorStatsDTO(
                            toInteger(row[0]),
                            (String) row[1],
                            (String) row[2],
                            toLong(row[3]),
                            toBigDecimal(row[4])
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    // Вспомогательные методы для безопасного преобразования типов
    private Integer toInteger(Object value) {
        if (value == null) return 0;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof Number) return ((Number) value).intValue();
        return 0;
    }

    private Long toLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Number) return ((Number) value).longValue();
        return 0L;
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        try {
            return new BigDecimal(value.toString());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}