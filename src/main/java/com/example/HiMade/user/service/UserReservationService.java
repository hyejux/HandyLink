package com.example.HiMade.user.service;

import com.example.HiMade.user.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface UserReservationService {

  public List<UserRL> getMyReserveList();
  public List<UserRSlotDTO> getDateTime(LocalDate Date);
  public List<UserRSlotDTO> getAllDateTime(int id);

  public int setReservationForm(UserReservationDTO dto);
  public List<UserReservationDTO> getSlotTime(int slotkey);
  public void setReservationFormDetail(List<UserReservationFormDTO> dto);
  public List<UserRD> getMyReservationDetail(int id);

  public List<LocalDate> getNoSlot();



}
