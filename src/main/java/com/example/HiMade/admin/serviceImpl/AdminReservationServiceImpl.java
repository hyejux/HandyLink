package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.adminReservationDTO;
import com.example.HiMade.admin.mapper.AdminReservationMapper;
import com.example.HiMade.admin.service.AdminMainService;
import com.example.HiMade.admin.service.AdminReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
