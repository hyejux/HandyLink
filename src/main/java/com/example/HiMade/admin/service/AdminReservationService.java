package com.example.HiMade.admin.service;

import com.example.HiMade.admin.dto.adminReservationDTO;

import java.util.List;

public interface AdminReservationService
{
  public List<adminReservationDTO> getList();
  public void setCategory(adminReservationDTO dto);
  public  adminReservationDTO  getListDetail(int id);
}
