package com.example.HiMade.user.controller.PaymentController;

import com.example.HiMade.user.entity.Payment;
import com.example.HiMade.user.service.PaymentService;
import com.example.HiMade.user.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/userPaymentCancel")
public class UserPaymentCancelController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private RefundService refundService;

    @PostMapping("/updatePaymentStatus/{reservationNo}")
    public ResponseEntity<String> updatePaymentStatus(@PathVariable Long reservationNo, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("paymentStatus");
        List<Payment> payments = paymentService.getPaymentInfo(reservationNo);

        if (payments.isEmpty()) {
            return ResponseEntity.badRequest().body("결제 정보가 없습니다.");
        }

        for (Payment payment : payments) {
            payment.setPaymentStatus(newStatus); // 상태 업데이트
            paymentService.updatePayment(payment); // 업데이트 메소드 호출

            // 환불 정보 생성 (상태가 N일 경우)
            if ("N".equals(newStatus)) {
                refundService.createRefund(
                        payment.getPaymentId(),
                        payment.getPaymentMethod(),  // 결제 방법을 환불 방법으로 사용
                        payment.getPaymentAmount()    // 결제 금액을 환불 금액으로 사용
                );
            }
        }
        return ResponseEntity.ok("결제 상태가 업데이트되었습니다.");
    }
}
