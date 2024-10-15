package com.example.HiMade.admin.dto;

import lombok.*;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class StoreRegistDTO {

//    private StoreDTO storeDTO;
//    private StoreInfoDTO storeInfoDTO;

    //StoreDTO - 업체
    private String storeId; //업체id
    private String storePw; //업체pw
    private String storeCate; //업종
    private String storeName; //상호명
    private String storeMaster; //대표자명
    private String managerName; //담당자명
    private String managerPhone; //담당자연락처
    private StoreAddr storeAddr; //사업자주소
    private String storeBusinessNo; //사업자등록번호

    //StoreInfoDTO - 업체정보
    private String storeIntro; //업체소개
    private String storeParkingYn; //주차여부
    private List<StoreSns> storeSns; //sns링크
    private String storeNotice; //공지사항
    private LocalTime storeOpenTime; //영업시작시간
    private LocalTime storeCloseTime; //영업종료시간
    private List<String> storeDayOff; //휴무일
    private StoreAccount storeAccount; //업체계좌번호
    private List<String>  imageUrl; //img경로





}
