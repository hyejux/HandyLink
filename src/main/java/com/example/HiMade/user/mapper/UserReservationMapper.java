package com.example.HiMade.user.mapper;

import com.example.HiMade.user.dto.UserRL;
import com.example.HiMade.user.dto.UserRSlotDTO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface UserReservationMapper {

  public List<UserRL> getMyReserveList();
  public List<UserRSlotDTO> getDateTime(LocalDate Date);

}
