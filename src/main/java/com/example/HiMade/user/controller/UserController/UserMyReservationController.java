package com.example.HiMade.user.controller.UserController;

import com.example.HiMade.user.dto.*;
import com.example.HiMade.user.service.UserReservationService;
import org.apache.ibatis.annotations.Param;
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



  @GetMapping("/getMyReservationDetail/{id}")
  public List<UserRD> getMyReservationDetail(@PathVariable int id){
    return userReservationService.getMyReservationDetail(id);
  }


  @PostMapping("setReview/{id}")
  public void setReview(@RequestBody UserReviewDTO dto, @PathVariable int id){
    System.out.println("user review dto + "  + dto);
    dto.setReservationNo(id);
    userReservationService.setReview(dto);
  }

  @PostMapping("setReviewImg")
  public void setReviewImg(@RequestBody List<UserReviewImgDTO> dto){
    userReservationService.setReviewImg(dto);
  }





}
