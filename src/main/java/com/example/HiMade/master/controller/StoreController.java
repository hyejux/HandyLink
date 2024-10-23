package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.StoreAdmin;
import com.example.HiMade.master.entity.StoreStatus;
import com.example.HiMade.master.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.HiMade.master.repository.StoreRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/getStoreInfo")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public List<StoreAdmin> getAllStores() {
        return storeService.getAllStores();
    }

    @GetMapping("/{storeNo}")
    public StoreAdmin getStoreById(@PathVariable Long storeNo) {
        return storeService.getStoreDetails(storeNo);
    }

    @PostMapping("/{storeNo}/approve")
    public StoreAdmin approveStore(@PathVariable Long storeNo) {
        return storeService.approveStore(storeNo);
    }

    @PostMapping("/{storeNo}/deactivate")
    public StoreAdmin deactivateStore(@PathVariable Long storeNo) {
        return storeService.deactivateStore(storeNo);
    }
}
