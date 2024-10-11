package com.example.HiMade.master.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "store_info")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class StoreInfo {
    
    @Id
    private Long storeId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "storeId")
    private Store store;

    private String storeIntro;
    private String storeParkingYn;
    private String storeSns;
    private String imageUrl;
    private String notice;
    private Time storeStartTime;
    private Time storeEndTime;
    private Date storeBreakDate;
    private Long accountNumber;

}
