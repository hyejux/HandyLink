package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.entity.StoreStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.HiMade.master.repository.StoreRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/store")
public class StoreController {

    @Autowired
    private StoreRepository storeRepository;

    @GetMapping
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Store getStoreById(@PathVariable String id) {
        return storeRepository.findById(id).orElse(null);  // String 타입 그대로 사용
    }

    @PostMapping("/{storeId}/approve")
    public Store approveStore(@PathVariable String storeId) {
        Store store = storeRepository.findById(storeId).orElse(null);  // Removed Long conversion
        if (store != null) {
            store.setStoreStatus(StoreStatus.활성화);
            return storeRepository.save(store);
        }
        return null;
    }

    @PostMapping("/{storeId}/deactivate")
    public Store deactivateStore(@PathVariable String storeId) {
        Store store = storeRepository.findById(storeId).orElse(null);  // Removed Long conversion
        if (store != null) {
            store.setStoreStatus(StoreStatus.비활성화);
            return storeRepository.save(store);
        }
        return null;
    }

}
