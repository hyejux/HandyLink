package com.example.HiMade.user.service;

import com.example.HiMade.user.entity.Refund;
import com.example.HiMade.user.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RefundService {

    @Autowired
    private RefundRepository refundRepository;

    public void createRefund(Long paymentId, String refundMethod, Long refundAmount) {
        Refund refund = new Refund();
        refund.setPaymentId(paymentId);
        refund.setRefundMethod(refundMethod);
        refund.setRefundAmount(refundAmount);
        refund.setRefundDate(LocalDateTime.now());

        refundRepository.save(refund);
    }
}
