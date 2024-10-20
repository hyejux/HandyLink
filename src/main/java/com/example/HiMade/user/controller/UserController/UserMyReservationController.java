package com.example.HiMade.user.controller.UserController;

import com.example.HiMade.user.dto.UserRD;
import com.example.HiMade.user.dto.UserRL;
import com.example.HiMade.user.dto.UserRSlotDTO;
import com.example.HiMade.user.service.UserReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/userMyReservation")
public class UserMyReservationController {

  @Autowired
  UserReservationService userReservationService;

  @GetMapping("/getMyReserveList")
  public List<UserRL> getMyReserveList() {
    System.out.println(userReservationService.getMyReserveList());
    return userReservationService.getMyReserveList();
  }


  @GetMapping("/getMyReservationDetail")
  public List<UserRD> getMyReservationDetail(){
    return userReservationService.getMyReservationDetail();
  }

}
