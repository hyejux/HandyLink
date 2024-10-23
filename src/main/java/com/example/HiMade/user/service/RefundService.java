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

    public Refund createRefund(String method, Long amount, Long reservationNo) {
        Refund refund = new Refund();
        refund.setRefundMethod(method);
        refund.setRefundAmount(amount);
        refund.setRefundDate(LocalDateTime.now());
        refund.setReservationNo(reservationNo);
        return refundRepository.save(refund);
    }


}
