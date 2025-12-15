package com.example.polyclinic.polyclinic.repository;

import com.example.polyclinic.polyclinic.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByReceiptNumber(String receiptNumber);
    Optional<Payment> findByAppointmentId(Integer appointmentId);
}