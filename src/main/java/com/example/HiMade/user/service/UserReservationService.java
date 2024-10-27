package com.example.HiMade.user.service;

import com.example.HiMade.user.dto.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface
UserReservationService {

  public List<UserRL> getMyReserveList();
  public List<UserRSlotDTO> getDateTime(UserRSlotDTO Date);
  public List<UserRSlotDTO> getAllDateTime(int id);

  public int setReservationForm(UserReservationDTO dto);
  public List<UserReservationDTO> getSlotTime(int slotkey);
  public void setReservationFormDetail(List<UserReservationFormDTO> dto);
  public List<UserRD> getMyReservationDetail(int id);

  public List<LocalDate> getNoSlot(int id);

  void setUpdateStart(UserRSlotDTO dto);
  void setUpdateSlot(@RequestBody UserUSlotDTO dto);


  void updateReservationStatus(int reservationNo, String status);
  void updateSlotStatus(int categoryId, LocalDate reservationDate, int storeNo);

  void updateSlotCount1(UserRSlotDTO dto);


  // 리뷰
  List<UserReviewDTO> getReviewList(int id);
  int setReview(UserReviewDTO dto);
  void setReviewImg(List<UserReviewImgDTO> dto);


}
