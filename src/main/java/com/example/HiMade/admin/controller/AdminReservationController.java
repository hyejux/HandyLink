package com.example.HiMade.admin.controller;


import com.example.HiMade.admin.dto.adminRSDTO;
import com.example.HiMade.admin.dto.adminReservationDTO;
import com.example.HiMade.admin.dto.adminReserveAdd;
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

  @GetMapping("/getSubItem/{id}")
  public List<adminReservationDTO> getSubItem(@PathVariable int id) {
    System.out.println(adminReservationService.getSubItem(id));
    System.out.println(id);
    return adminReservationService.getSubItem(id);
  }

  @PostMapping("/setMainCategory")
  public void setMainCategory(@RequestBody adminReserveAdd dto) {
    System.out.println(dto);

    adminReservationDTO dto2 = new adminReservationDTO();
    dto2.setServiceName(dto.getServiceName());
    dto2.setServicePrice(dto.getServicePrice());
    dto2.setServiceContent(dto.getServiceContent());

    int serviceId = adminReservationService.setMainCategory(dto2);

    System.out.println("메인 카테고리 삽입 후 아이디  : " + serviceId);

    System.out.println(dto.getCategories());

    List<adminRSDTO> categories = dto.getCategories();
    for (adminRSDTO category : categories) {
      category.setParentCategoryId(serviceId); // 서비스 ID를 카테고리에 설정
      int serviceId2 = adminReservationService.setMainCategory2(category);
      System.out.println("중분류 카테고리 삽입 후 " + serviceId2);
      adminReservationService.setMainCategory3(category);
    }


  }



  @PostMapping("/setCategory")
  public void setCategory(@RequestBody adminReservationDTO dto) {
    adminReservationService.setCategory(dto);
  }



}
