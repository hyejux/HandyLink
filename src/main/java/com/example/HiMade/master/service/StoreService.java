package com.example.HiMade.master.service;

import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.entity.StoreStatus;
import com.example.HiMade.master.repository.ReviewRepository;
import com.example.HiMade.master.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public StoreService(StoreRepository storeRepository, ReviewRepository reviewRepository) {
        this.storeRepository = storeRepository;
        this.reviewRepository = reviewRepository;
    }

    // 모든 가게 정보 가져오기
    public List<Store> getAllStores() {
        List<Store> stores = storeRepository.findAll();
        // 각 스토어에 대해 평균 평점과 리뷰 개수 계산
        for (Store store : stores) {
            Double averageRating = reviewRepository.findAverageRatingByStoreNo(store.getStoreNo());
            Long reviewCount = reviewRepository.countReviewsByStoreNo(store.getStoreNo());

            if (averageRating != null) {
                // 소수점 첫째 자리까지 절삭
                BigDecimal rating = BigDecimal.valueOf(averageRating).setScale(1, RoundingMode.FLOOR);
                store.setAverageRating(rating);
            } else {
                store.setAverageRating(BigDecimal.ZERO); // 리뷰가 없는 경우 0으로 설정
            }

            // 리뷰 개수 설정
            store.setReviewCount(reviewCount != null ? reviewCount : 0L); // 리뷰 개수 추가
        }
        return stores;
    }

    // 특정 가게와 관련된 정보 가져오기
    public Store getStoreDetails(Long storeNo) {
        return storeRepository.findByStoreNo(storeNo)
                .orElseThrow(() -> new RuntimeException("Store not found with storeNo: " + storeNo));
    }

    // 가게 활성화
    public Store approveStore(Long storeNo) {
        storeRepository.updateStoreStatusByStoreNo(storeNo, StoreStatus.활성화);
        return getStoreDetails(storeNo);
    }

    // 가게 비활성화
    public Store deactivateStore(Long storeNo) {
        storeRepository.updateStoreStatusByStoreNo(storeNo, StoreStatus.비활성화);
        return getStoreDetails(storeNo);
    }
}
