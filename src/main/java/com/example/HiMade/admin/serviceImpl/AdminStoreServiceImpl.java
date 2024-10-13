package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.admin.mapper.AdminStoreMapper;
import com.example.HiMade.admin.service.AdminStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service("adminStoreService")
public class AdminStoreServiceImpl implements AdminStoreService {

    @Autowired
    private AdminStoreMapper adminStoreMapper;

    @Override
    public void registStore(StoreRegistDTO storeRegistDTO) {
        System.out.println("서비스 "+storeRegistDTO);
        adminStoreMapper.registStore(storeRegistDTO);
    }
}
