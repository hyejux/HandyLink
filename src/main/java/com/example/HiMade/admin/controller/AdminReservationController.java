package com.example.HiMade.admin.controller;


import com.example.HiMade.admin.dto.adminReservationDTO;
import com.example.HiMade.admin.service.AdminMainService;
import com.example.HiMade.admin.service.AdminReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adminReservation")
public class AdminReservationController {

  @Autowired
  private AdminReservationService adminReservationService;


  @GetMapping("/getList")
  public List<adminReservationDTO> getList() {
    System.out.println(adminReservationService.getList());
    return adminReservationService.getList();
  }

  @PostMapping("/setCategory")
  public void setCategory(@RequestBody adminReservationDTO dto) {
    adminReservationService.setCategory(dto);

  }



}
