package com.example.HiMade.user.controller.StoreController;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.user.dto.UserCateDTO;
import com.example.HiMade.user.dto.UserRL;
import com.example.HiMade.user.service.UserReservationService;
import com.example.HiMade.user.service.UserStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/UserStoreDetail")
public class UserStoreDetailController {

  @Autowired
  private UserStoreService userStoreService;

  @GetMapping("/getStoreMainCategory/{id}")
  public List<UserCateDTO> getStoreMainCategory(@PathVariable int id) {
    System.out.println("gg" + id);
    System.out.println( userStoreService.getStoreMainCategory(id));
    return userStoreService.getStoreMainCategory(id);
  }

  @GetMapping("/getStoreInfo/{id}")
  public StoreRegistDTO getStoreInfo(@PathVariable int id){
    System.out.println( "출력값" + userStoreService.getStoreInfo(id));
    return userStoreService.getStoreInfo(id);
  }

}

