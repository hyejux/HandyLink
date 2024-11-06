package com.example.HiMade.master.controller;

import com.example.HiMade.master.entity.Review;
import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.entity.StoreStatus;
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
        Store store = storeService.getStoreDetails(storeNo);

        // 상태가 '대기'일 경우, 비활성화로 변경
        if (store.getStoreStatus() == StoreStatus.대기) {
            storeService.deactivateStore(storeNo);  // 비활성화 처리
        } else {
            storeService.approveStore(storeNo);  // 활성화 처리
        }

        return storeService.getStoreDetails(storeNo);  // 변경된 가게 정보 반환
    }


    @PostMapping("/{storeNo}/deactivate")
    public Store deactivateStore(@PathVariable Long storeNo) {
        return storeService.deactivateStore(storeNo);
    }

    @PostMapping("/{storeNo}/suspend")
    public Store suspendStore(@PathVariable Long storeNo) {
        return storeService.suspendStore(storeNo);
    }

    @GetMapping("/{storeNo}/averageRating")
    public Double getAverageRatingByStoreNo(@PathVariable Long storeNo) {
        return reviewService.getAverageRatingByStoreNo(storeNo);
    }
}
