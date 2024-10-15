package com.example.HiMade.user.controller.ReservationController;


import com.example.HiMade.user.dto.UserRSlotDTO;
import com.example.HiMade.user.service.UserReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/userReservation")
public class UserReservationController {

  @Autowired
  private UserReservationService userReservationService;

  @PostMapping("/getDateTime")
  public List<UserRSlotDTO> getDateTime(@RequestBody UserRSlotDTO dto){
    System.out.println( dto.getReservationSlotDate());
    LocalDate date = dto.getReservationSlotDate();
    System.out.println(date);
    System.out.println(userReservationService.getDateTime(date));
    return userReservationService.getDateTime(date);
  }


}
