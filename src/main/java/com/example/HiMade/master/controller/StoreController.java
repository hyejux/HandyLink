package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.Store;
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
}

