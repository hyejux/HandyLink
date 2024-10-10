package com.example.HiMade.user.repository;

import com.example.HiMade.user.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
