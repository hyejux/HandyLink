package com.example.HiMade.user.service;

import com.example.HiMade.user.dto.UserRL;
import com.example.HiMade.user.dto.UserRSlotDTO;
import com.example.HiMade.user.dto.UserReservationDTO;
import com.example.HiMade.user.dto.UserReservationFormDTO;

import java.time.LocalDate;
import java.util.List;

public interface UserReservationService {

  public List<UserRL> getMyReserveList();
  public List<UserRSlotDTO> getDateTime(LocalDate Date);
  public int setReservationForm(UserReservationDTO dto);
  public List<UserReservationDTO> getSlotTime(int slotkey);
  public void setReservationFormDetail(List<UserReservationFormDTO> dto);


}
