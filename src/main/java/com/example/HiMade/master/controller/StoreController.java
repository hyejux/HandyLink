package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.Review;
import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.service.ReviewService;
import com.example.HiMade.master.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/getStoreInfo")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @Autowired
    private ReviewService reviewService;

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

    @GetMapping("/{storeNo}/averageRating")
    public Double getAverageRatingByStoreNo(@PathVariable Long storeNo) {
        return reviewService.getAverageRatingByStoreNo(storeNo);
    }

    // 활성화 상태인 가게에서 categoryLevel 1인 카테고리가 하나 이상 있는 가게 가져오기
    @GetMapping("/activeWithCategory")
    public List<Store> getActiveStoresWithCategoryLevelOne() {
        return storeService.getActiveStoresWithCategoryLevelOne();
    }

}
