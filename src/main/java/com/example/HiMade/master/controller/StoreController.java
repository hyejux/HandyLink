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

    @GetMapping("/{storeNo}")
    public Store getStoreById(@PathVariable Long storeNo) { //
        return storeRepository.findByStoreNo(storeNo).orElse(null);
    }

    @PostMapping("/{storeNo}/approve") // storeNo로 변경
    public Store approveStore(@PathVariable Long storeNo) { //
        storeRepository.updateStoreStatusByStoreNo(storeNo, StoreStatus.활성화);
        return storeRepository.findByStoreNo(storeNo).orElse(null);
    }

    @PostMapping("/{storeNo}/deactivate") // storeNo로 변경
    public Store deactivateStore(@PathVariable Long storeNo) { //
        storeRepository.updateStoreStatusByStoreNo(storeNo, StoreStatus.비활성화);
        return storeRepository.findByStoreNo(storeNo).orElse(null);
    }
}