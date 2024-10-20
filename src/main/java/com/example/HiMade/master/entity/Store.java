package com.example.HiMade.master.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.sql.Time;
import java.util.Collections;
import java.util.List;
import java.util.Map;

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

    private String storeAddr; // JSONB를 String으로 받기
    private String storeBusinessNo;
    private Timestamp storeSignup;

    @Column(name = "store_status")
    @Enumerated(EnumType.STRING)
    private StoreStatus storeStatus;

    private String storeIntro;
    private String storeParkingYn;
    private String storeSns; // 이 필드는 JSON 배열로 유지
    private String imageUrl;
    private String storeNotice;
    private Time storeOpenTime;
    private Time storeCloseTime;
    private String storeDayOff;
    private String storeAccount; // 이 필드는 JSON 객체로 유지

    // store_no를 추가하여 시퀀스와 연결
    @Column(name = "store_no", nullable = false)
    private Long storeNo; //

    public Map<String, Object> getStoreAddrAsMap() {
        return jsonToMap(storeAddr);
    }

    public List<Map<String, Object>> getStoreSnsAsList() {
        return jsonToList(storeSns);
    }

    public Map<String, Object> getStoreAccountAsMap() {
        return jsonToMap(storeAccount);
    }

    private Map<String, Object> jsonToMap(String jsonString) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }

    private List<Map<String, Object>> jsonToList(String jsonString) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonString, new TypeReference<List<Map<String, Object>>>() {});
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
