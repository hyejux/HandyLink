package com.example.HiMade.master.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "store")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storeId;

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
    
}
