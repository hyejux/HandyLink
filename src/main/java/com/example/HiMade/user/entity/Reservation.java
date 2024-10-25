package com.example.HiMade.user.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalTime;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_no")
    private Long reservationNo;

    @Column(name = "reservation_status")
    private String reservationStatus;

    @Column(name = "reservation_time")
    private LocalTime reservationTime;

    @Column(name = "reg_time")
    private Timestamp regTime;

    @Column(name = "customer_request")
    private String customerRequest;

    @Column(name = "reservation_price")
    private Long reservationPrice;

    @Column(name = "store_id", nullable = false)
    private String storeId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "reservation_slot_key")
    private Long reservationSlotKey;

    @Column(name = "store_no", nullable = false)
    private String storeNo;

}
