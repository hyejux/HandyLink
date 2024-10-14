package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.entity.StoreStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.HiMade.master.entity.StoreInfo;
import com.example.HiMade.master.repository.StoreInfoRepository;
import com.example.HiMade.master.repository.StoreRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store")
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreInfoRepository storeInfoRepository;

    @GetMapping
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Store getStoreById(@PathVariable Long id) {
        return storeRepository.findById(id).orElse(null);
    }

    @GetMapping("/info/{storeId}")
    public StoreInfo getStoreInfoByStoreId(@PathVariable Long storeId) {
        return storeInfoRepository.findById(storeId).orElse(null);
    }

    @PostMapping("/{storeId}/approve")
    public Store approveStore(@PathVariable Long storeId) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store != null) {
            store.setStoreStatus(StoreStatus.활성화); // 열거형 값으로 설정
            return storeRepository.save(store); // 변경된 업체 저장
        }
        return null; // 업체가 존재하지 않을 경우 null 반환
    }

    @PostMapping("/{storeId}/deactivate")
    public Store deactivateStore(@PathVariable Long storeId) {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store != null) {
            store.setStoreStatus(StoreStatus.비활성화); // 열거형 값으로 설정
            return storeRepository.save(store); // 변경된 업체 저장
        }
        return null; // 업체가 존재하지 않을 경우 null 반환
    }


}

