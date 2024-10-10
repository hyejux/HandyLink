package com.example.HiMade.admin.mapper;


import com.example.HiMade.admin.dto.adminReservationDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminReservationMapper {

  public List<adminReservationDTO> getList();
  public void setCategory(adminReservationDTO dto);
}
