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


  @GetMapping("/getListDetail/{id}")
  public adminReservationDTO getListDetail(@PathVariable int id) {
    System.out.println(adminReservationService.getListDetail(id));
    System.out.println(id);
    return adminReservationService.getListDetail(id);
  }

  @PostMapping("/setCategory")
  public void setCategory(@RequestBody adminReservationDTO dto) {
    adminReservationService.setCategory(dto);

  }



}
