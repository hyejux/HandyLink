package com.example.HiMade.admin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class StoreRegistDTO {

    //StoreDTO - 업체
    private String storeId; //업체id
    private String storePw; //업체pw
    private String storeCate; //업종
    private String storeName; //상호명
    private String storeMaster; //대표자명
    private String managerName; //담당자명
    private String managerPhone; //담당자연락처
    private String storeBusinessNo; //사업자등록번호

    //StoreInfoDTO - 업체정보
    private String storeIntro; //업체소개
    private String storeParkingYn; //주차여부
    private String storeNotice; //공지사항
    private LocalTime storeOpenTime; //영업시작시간
    private LocalTime storeCloseTime; //영업종료시간
    private String storeSignup; //가입일시
    private String storeStatus; //업체활동상태
    private String zipcode; //우편번호
    private String addr; //주소
    private String addrdetail; //상세주소
    private String accountBank;
    private String accountNumber;

}
