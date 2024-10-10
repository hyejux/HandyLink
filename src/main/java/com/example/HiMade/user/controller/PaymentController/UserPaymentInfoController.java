package com.example.HiMade.user.controller.PaymentController;

import com.example.HiMade.user.entity.Payment;
import com.example.HiMade.user.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class UserPaymentInfoController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment.getPaymentMethod(), payment.getPaymentAmount(), payment.getPaymentStatus(), payment.getReservationNo());
    }

    // 결제 정보 조회
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }


}
