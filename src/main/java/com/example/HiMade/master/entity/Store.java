package com.example.HiMade.master.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.sql.Time;

@Entity
@Table(name = "store")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    @Id
    private String storeId;

    private String storePw;
    private String storeCate;
    private String storeName;
    private String storeMaster;
    private String managerName;
    private String managerPhone;
    private String storeAddr;
    private String storeBusinessNo;
    private Timestamp storeSignup;

    @Column(name = "store_status")
    @Enumerated(EnumType.STRING)
    private StoreStatus storeStatus;

    private String storeIntro;
    private String storeParkingYn;
    private String storeSns;
    private String imageUrl;
    private String notice;
    private Time storeStartTime;
    private Time storeCloseTime;
    private String storeDayOff;
    private String storeAccount;
}
