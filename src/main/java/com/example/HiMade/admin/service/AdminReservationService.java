package com.example.HiMade.admin.service;

import com.example.HiMade.admin.dto.*;

import java.util.List;

public interface AdminReservationService
{
  public List<adminReservationDTO> getList();
  public void setCategory(adminReservationDTO dto);
  public  adminReservationDTO  getListDetail(int id);
  public  List<adminRSDTO> getMiddleItem(int id);

  public Integer setMainCategory(adminReservationDTO dto);
  public int setMainCategory2(adminRSDTO dto);
  public void setMainCategory3(adminRSDTO dto);
  public void setMainCategory4(adminReservationDTO dto);

  public List<adminReserveMangeDTO> getManageList();

  //예약 상태 변경
  void updateStatus(UpdateReservationStatusDTO dto);

}
