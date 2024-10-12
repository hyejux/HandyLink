package com.example.HiMade.admin.mapper;


import com.example.HiMade.admin.dto.adminRSDTO;
import com.example.HiMade.admin.dto.adminReservationDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminReservationMapper {

  public List<adminReservationDTO> getList();
  public void setCategory(adminReservationDTO dto);
  public adminReservationDTO getListDetail(int id);
  public List<adminReservationDTO> getSubItem(int id);
//  public void setMainCategory(adminRSDTO dto);
  public Integer setMainCategory(adminReservationDTO dto);
  public int setMainCategory2(adminRSDTO dto);
  public void setMainCategory3(adminRSDTO dto);
}
