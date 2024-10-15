package com.example.HiMade.user.controller.ReservationController;

import com.example.HiMade.user.dto.UserRL;
import com.example.HiMade.user.service.UserReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/userMyReservationList")
public class UserMyReservationListController {

  @Autowired
  private UserReservationService userReservationService;

  @GetMapping("/getMyReserveList")
  public List<UserRL> getMyReserveList() {
    System.out.println(userReservationService.getMyReserveList());
    return userReservationService.getMyReserveList();
  }


}

