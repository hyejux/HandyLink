package com.example.HiMade.master.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "store_admin")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class StoreAdmin {
    private String storePw;
    private String storeCate;
    private String storeName;
    private String storeMaster;
    private String managerName;
    private String managerPhone;
    private String storeBusinessNo;
    private Timestamp storeSignup;

    @Column(name = "store_status")
    @Enumerated(EnumType.STRING)
    private StoreStatus storeStatus;

    private String storeIntro;
    private String storeParkingYn;
    private String storeNotice;
    private Time storeOpenTime;
    private Time storeCloseTime;
    private String accountBank;
    private String accountNumber;
    private String zipcode;
    private String addr;
    private String addrdetail;

    // store_no를 추가하여 시퀀스와 연결
    @Id
    @Column(name = "store_no", nullable = false)
    private Long storeNo; //

    // 연관관계 설정
    @OneToMany(mappedBy = "storeAdmin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<StoreSnsLink> snsLinks = new ArrayList<>();

    @OneToMany(mappedBy = "storeAdmin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<StoreImg> storeImages = new ArrayList<>();

    @OneToMany(mappedBy = "storeAdmin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DayOffDay> dayOffs = new ArrayList<>();
}