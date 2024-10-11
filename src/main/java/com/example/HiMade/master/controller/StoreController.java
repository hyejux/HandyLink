package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.entity.StoreStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.HiMade.master.entity.StoreInfo;
import com.example.HiMade.master.repository.StoreInfoRepository;
import com.example.HiMade.master.repository.StoreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    // 상태 업데이트를 위한 POST 메서드 추가
    @PostMapping("/{storeId}/approve")
    public ResponseEntity<Store> approveStore(@PathVariable Long storeId) {
        return storeRepository.findById(storeId)
                .map(store -> {
                    store.setStoreStatus(StoreStatus.활성화);
                    Store updatedStore = storeRepository.save(store);
                    return ResponseEntity.ok(updatedStore);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{storeId}/deactivate")
    public ResponseEntity<Void> deactivateStore(@PathVariable Long storeId) {
        Optional<Store> storeOptional = storeRepository.findById(storeId);
        if (storeOptional.isPresent()) {
            Store store = storeOptional.get();
            store.setStoreStatus(StoreStatus.비활성화);
            storeRepository.save(store); 
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}
