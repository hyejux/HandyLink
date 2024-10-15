package com.example.HiMade.admin.controller;


import com.example.HiMade.admin.dto.adminRSDTO;
import com.example.HiMade.admin.dto.adminReservationDTO;
import com.example.HiMade.admin.dto.adminReserveAdd;
import com.example.HiMade.admin.dto.adminReserveMangeDTO;
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


  @GetMapping("/getManageList")
  public List<adminReserveMangeDTO> getManageList(){
    System.out.println(adminReservationService.getManageList());
    return adminReservationService.getManageList();
  }

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

  @GetMapping("/getMiddleItem/{id}")
  public List<adminRSDTO> getMiddleItem(@PathVariable int id) {
    System.out.println(adminReservationService.getMiddleItem(id));
    System.out.println(id);
    return adminReservationService.getMiddleItem(id);
  }

  @PostMapping("/setMainCategory")
  public void setMainCategory(@RequestBody adminReserveAdd dto) {
    System.out.println(dto);

    adminReservationDTO dto2 = new adminReservationDTO();
    dto2.setServiceName(dto.getServiceName());
    dto2.setServicePrice(dto.getServicePrice());
    dto2.setServiceContent(dto.getServiceContent());

    // 대분류 카테고리
    int serviceId = adminReservationService.setMainCategory(dto2); // 대분류 insert
    System.out.println("메인 카테고리 삽입 후 아이디  : " + serviceId);
//    System.out.println(dto.getCategories());

    // 중분류 카테고리
    List<adminRSDTO> categories = dto.getCategories();
    for (adminRSDTO category : categories) {
      category.setParentCategoryId(serviceId); // 서비스 ID를 카테고리에 설정
      int serviceId2 = adminReservationService.setMainCategory2(category); // 중분류 insert
      System.out.println("중분류 카테고리 삽입 후 " + serviceId2);
      adminReservationService.setMainCategory3(category); // 중분류 상태 insert 

      List<adminReservationDTO> subCategories = category.getSubCategories();
      //subCategory 배열 들어감

      System.out.println(subCategories);

      for (adminReservationDTO subcategory : subCategories) {
        subcategory.setParentCategoryId(serviceId2); // 삽입된 중분류 아이디를 부모 아이디로 가지고 감
        adminReservationService.setMainCategory4(subcategory); // 소분류 insert
        System.out.println("중분류 삽입됨");
      }

    }

    System.out.println();
    // 소분류 카테고리



  }



  @PostMapping("/setCategory")
  public void setCategory(@RequestBody adminReservationDTO dto) {
    adminReservationService.setCategory(dto);
  }



}
