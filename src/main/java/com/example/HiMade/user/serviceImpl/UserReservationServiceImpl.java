package com.example.HiMade.user.serviceImpl;


import com.example.HiMade.user.dto.UserRL;
import com.example.HiMade.user.dto.UserRSlotDTO;
import com.example.HiMade.user.dto.UserReservationDTO;
import com.example.HiMade.user.mapper.UserReservationMapper;
import com.example.HiMade.user.service.UserReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service("UserReservationService")
public class UserReservationServiceImpl implements UserReservationService {

  @Autowired
  UserReservationMapper userReservationMapper;

  @Override
  public List<UserRL> getMyReserveList() {
    return  userReservationMapper.getMyReserveList();
  }

  @Override
  public List<UserRSlotDTO> getDateTime(LocalDate Date) {
    System.out.println(userReservationMapper.getDateTime(Date));
    return userReservationMapper.getDateTime(Date);
  }

  @Override
  public void setReservationForm(UserReservationDTO dto) {
    userReservationMapper.setReservationForm(dto);
  }

  @Override
  public List<UserReservationDTO> getSlotTime(int slotkey) {
    return userReservationMapper.getSlotTime(slotkey);
  }
}
