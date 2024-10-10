package com.example.HiMade.user.service;

import com.example.HiMade.user.entity.Payment;
import com.example.HiMade.user.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPayment(String paymentMethod, Long paymentAmount, String paymentStatus, Long reservationNo) {
        Payment payment = new Payment();
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentAmount(paymentAmount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus(paymentStatus);
        payment.setReservationNo(reservationNo);

        return paymentRepository.save(payment);
    }

    // 모든 결제 정보 조회
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }


}
