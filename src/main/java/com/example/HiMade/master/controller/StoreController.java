package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/getStoreInfo")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public List<Store> getAllStores() {
        return storeService.getAllStores();
    }

    @GetMapping("/{storeNo}")
    public Store getStoreById(@PathVariable Long storeNo) {
        return storeService.getStoreDetails(storeNo);
    }

    @PostMapping("/{storeNo}/approve")
    public Store approveStore(@PathVariable Long storeNo) {
        return storeService.approveStore(storeNo);
    }

    @PostMapping("/{storeNo}/deactivate")
    public Store deactivateStore(@PathVariable Long storeNo) {
        return storeService.deactivateStore(storeNo);
    }
}
