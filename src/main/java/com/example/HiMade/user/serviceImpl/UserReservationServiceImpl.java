package com.example.HiMade.user.serviceImpl;


import com.example.HiMade.user.dto.*;
import com.example.HiMade.user.mapper.UserReservationMapper;
import com.example.HiMade.user.service.UserReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.SQLOutput;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
  public List<UserRSlotDTO> getDateTime(UserRSlotDTO Date) {
    System.out.println(userReservationMapper.getDateTime(Date));
    return userReservationMapper.getDateTime(Date);
  }

  @Override
  public List<UserRSlotDTO> getAllDateTime(int id) {

//    System.out.println(userReservationMapper.getAllDateTime(id));
    return userReservationMapper.getAllDateTime(id);
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

     int result = userReservationMapper.setReservationFormDetail(d);
      System.out.println(result);
    }
  }

  @Override
  public List<UserRD> getMyReservationDetail(int id) {
    System.out.println(userReservationMapper.getMyReservationDetail(id));
    return userReservationMapper.getMyReservationDetail(id);
  }

  @Override
  public List<LocalDate> getNoSlot(int id) {
    return userReservationMapper.getNoSlot(id);
  }

  @Override
  public void setUpdateStart(UserRSlotDTO dto) {
    userReservationMapper.setUpdateStart(dto);
//    List<UserRSlotDTO> resultDto = userReservationMapper.getAllDateTime(dto.getCategoryId());
//    System.out.println("gg" +resultDto.get(1).getServiceStart());
//    LocalDateTime result = resultDto.get(1).getServiceStart();
  }

  @Override
  public void setUpdateSlot(UserUSlotDTO dto) {

    userReservationMapper.setUpdateSlot(dto);
  }

  @Transactional
  @Override
  public void updateReservationStatus(int reservationNo, String status) {
    userReservationMapper.updateReservationStatus(reservationNo, status);
  }

    @Override
  @Transactional
  public void updateSlotStatus(int categoryId, LocalDate reservationDate, int storeNo) {
    userReservationMapper.updateSlotStatus(categoryId, reservationDate, storeNo);

  }

  @Override
  public void updateSlotCount1(UserRSlotDTO dto) {
    userReservationMapper.updateSlotCount1(dto);
  }

  @Override
  public List<UserReviewDTO> getReviewList(int id) {
    return userReservationMapper.getReviewList(id);
  }

  @Override
  public int setReview(UserReviewDTO dto) {
    userReservationMapper.setReview(dto);
    int num = dto.getReviewNo();
    System.out.println("리뷰 등록 번호 " + num);
    return num;

  }

  @Override
  public void setReviewImg(List<UserReviewImgDTO> dto) {
    System.out.println("리뷰이미지등록" + dto );

    for (UserReviewImgDTO d : dto){
      userReservationMapper.setReviewImg(d);
    }
  }
}
