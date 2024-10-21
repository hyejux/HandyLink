package com.example.HiMade.user.serviceImpl;


import com.example.HiMade.user.dto.*;
import com.example.HiMade.user.mapper.UserReservationMapper;
import com.example.HiMade.user.service.UserReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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
  public List<UserRSlotDTO> getAllDateTime() {
    return userReservationMapper.getAllDateTime();
  }

  @Transactional
  @Override
  public int setReservationForm(UserReservationDTO dto) {

    int go = userReservationMapper.setReservationForm(dto);
    System.out.println("insert 된 reservation_id" +  dto.getReservationNo());
    return dto.getReservationNo();
  }

  @Override
  public List<UserReservationDTO> getSlotTime(int slotkey) {
    return userReservationMapper.getSlotTime(slotkey);
  }

  @Transactional
  @Override
  public void setReservationFormDetail(List<UserReservationFormDTO> dto) {
    for (UserReservationFormDTO d : dto ){
      System.out.println("삽입 값" + d);
      userReservationMapper.setReservationFormDetail(d);
    }
  }

  @Override
  public List<UserRD> getMyReservationDetail(int id) {
    System.out.println(userReservationMapper.getMyReservationDetail(id));
    return userReservationMapper.getMyReservationDetail(id);
  }


}
