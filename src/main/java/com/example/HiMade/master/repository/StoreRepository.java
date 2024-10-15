package com.example.HiMade.master.repository;

import com.example.HiMade.master.entity.Store;
import com.example.HiMade.master.entity.StoreStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface StoreRepository extends JpaRepository<Store, String> {
    @Modifying
    @Transactional
    @Query("UPDATE Store s SET s.storeStatus = :storeStatus WHERE s.storeId = :storeId")
    void updateStoreStatus(@Param("storeId") String storeId, @Param("storeStatus") StoreStatus storeStatus);
}
