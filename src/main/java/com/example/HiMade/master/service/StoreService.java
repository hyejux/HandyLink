package com.example.HiMade.master.service;

import com.example.HiMade.master.entity.StoreAdmin;
import com.example.HiMade.master.entity.StoreStatus;
import com.example.HiMade.master.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreService {

    private final StoreRepository storeRepository;

    @Autowired
    public StoreService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    // 모든 가게 정보 가져오기
    public List<StoreAdmin> getAllStores() {
        return storeRepository.findAll();
    }

    // 특정 가게와 관련된 정보 가져오기
    public StoreAdmin getStoreDetails(Long storeNo) {
        return storeRepository.findByStoreNo(storeNo)
                .orElseThrow(() -> new RuntimeException("Store not found with storeNo: " + storeNo));
    }

    // 가게 활성화
    public StoreAdmin approveStore(Long storeNo) {
        storeRepository.updateStoreStatusByStoreNo(storeNo, StoreStatus.활성화);
        return getStoreDetails(storeNo);
    }

    // 가게 비활성화
    public StoreAdmin deactivateStore(Long storeNo) {
        storeRepository.updateStoreStatusByStoreNo(storeNo, StoreStatus.비활성화);
        return getStoreDetails(storeNo);
    }
}
