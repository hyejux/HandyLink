package com.example.HiMade.user.mapper;

import com.example.HiMade.admin.dto.AdminCategoryImgDTO;
import com.example.HiMade.user.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface UserReservationMapper {

  public List<UserRL> getMyReserveList();
  public List<UserRSlotDTO> getDateTime(LocalDate Date);
  public List<UserRSlotDTO> getAllDateTime(int id);
  public int setReservationForm(UserReservationDTO dto);
  public List<UserReservationDTO> getSlotTime(int slotkey);
  public void setMainCategoryImg(AdminCategoryImgDTO dto);
  public void setReservationFormDetail(UserReservationFormDTO dto);
  public List<UserRD> getMyReservationDetail(int id);
  public List<LocalDate> getNoSlot();
  void setUpdateStart(UserRSlotDTO dto);
  void setUpdateSlot(@RequestBody UserUSlotDTO dto);
}
