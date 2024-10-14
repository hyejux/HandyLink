package com.example.HiMade.admin.mapper;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminStoreMapper {

    void registStore(StoreRegistDTO storeRegistDTO); //업체등록
}
