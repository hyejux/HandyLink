package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.*;
import com.example.HiMade.admin.mapper.AdminReservationMapper;
import com.example.HiMade.admin.service.AdminReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.awt.*;
import java.io.File;
import java.util.List;

@Service("AdminReservationService")
public class AdminReservationServiceImpl implements AdminReservationService {

  @Autowired
  AdminReservationMapper adminReservationMapper;

  @Autowired
  private ServletContext servletContext;

  @Override
  public List<adminReservationDTO> getList() {
    return adminReservationMapper.getList();
  }

  @Override
  public void setCategory(adminReservationDTO dto) {
      adminReservationMapper.setCategory(dto);
  }

  @Override
  public adminReservationDTO getListDetail(int id) {
    return adminReservationMapper.getListDetail(id);
  }

  @Override
  public List<adminRSDTO> getMiddleItem(int id) {

    List<adminRSDTO> dto = adminReservationMapper.getMiddleItem(id);
    System.out.println("service dto ::  " + dto );

    for (adminRSDTO d : dto ){
      System.out.println(d);
      System.out.println();
      d.setSubCategories(adminReservationMapper.getSubItem(d.getCategoryId()));
    }
    System.out.println(dto);
    return dto;
  }

  @Override
  public Integer setMainCategory(adminReservationDTO dto) {
    adminReservationMapper.setMainCategory(dto);
    return dto.getCategoryId();
  }

  @Override
  public int setMainCategory2(adminRSDTO dto) {
       adminReservationMapper.setMainCategory2(dto);
       return dto.getMiddleId();
  }

  @Override
  public void setMainCategory3(adminRSDTO dto) {
    adminReservationMapper.setMainCategory3(dto);
  }

  @Override
  public void setMainCategory4(adminReservationDTO dto) {
    adminReservationMapper.setMainCategory4(dto);
  }

  @Override
  public List<adminReserveMangeDTO> getManageList() {
    return adminReservationMapper.getManageList();
  }

  //예약 상태 변경
  @Override
  public void updateStatus(UpdateReservationStatusDTO dto) {
    adminReservationMapper.updateStatus(dto);
  }

  @Override
  public void setMainCategoryImg(MultipartFile file, int categoryId) {

      String imageUrl = null;

      try {
        String uploadDir = "C:/Users/user/Desktop/HiMade/src/main/resources/static/uploads";

// 원하는 경로로 변경
        File dir = new File(uploadDir);
        if (!dir.exists()) {
          dir.mkdirs(); // 디렉토리가 존재하지 않으면 생성
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File uploadFile = new File(uploadDir + "/" + fileName); // 파일 경로 설정
        file.transferTo(uploadFile); // 파일 저장

        // URL 반환
        imageUrl = "http://localhost:8585/uploads/" + fileName; // 로컬 개발 환경
        // imageUrl = "https://example.com/uploads/" + fileName; // 운영 환경
      } catch (Exception e) {
        e.printStackTrace();
      }

      AdminCategoryImgDTO dto = new AdminCategoryImgDTO();
      dto.setImageUrl(imageUrl);
      dto.setCategoryId(categoryId);

      adminReservationMapper.setMainCategoryImg(dto);
  }


}
