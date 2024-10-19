package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.*;
import com.example.HiMade.admin.mapper.AdminReservationMapper;
import com.example.HiMade.admin.service.AdminMainService;
import com.example.HiMade.admin.service.AdminReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("AdminReservationService")
public class AdminReservationServiceImpl implements AdminReservationService {

  @Autowired
  AdminReservationMapper adminReservationMapper;

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



}
