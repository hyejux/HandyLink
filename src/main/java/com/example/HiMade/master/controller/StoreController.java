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
        return storeRepository.findById(id).orElse(null);
    }

    @PostMapping("/{storeId}/approve")
    public Store approveStore(@PathVariable String storeId) {
        storeRepository.updateStoreStatus(storeId, StoreStatus.활성화);
        return storeRepository.findById(storeId).orElse(null);
    }

    @PostMapping("/{storeId}/deactivate")
    public Store deactivateStore(@PathVariable String storeId) {
        storeRepository.updateStoreStatus(storeId, StoreStatus.비활성화);
        return storeRepository.findById(storeId).orElse(null);
    }



}
