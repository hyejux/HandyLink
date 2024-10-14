package com.example.HiMade.admin.controller;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.admin.service.AdminStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adminStore")
public class AdminStoreController {

    @Autowired
    @Qualifier("adminStoreService")
    private AdminStoreService adminStoreService;

    @PostMapping("/registStore")
    public void registStore(@RequestBody StoreRegistDTO storeRegistDTO){
        System.out.println("업체정보 " + storeRegistDTO);
        adminStoreService.registStore(storeRegistDTO);
    }

}
