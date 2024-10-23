package com.example.HiMade.user.controller.ReservationController;


import com.example.HiMade.user.dto.UserRSlotDTO;
import com.example.HiMade.user.dto.UserReservationDTO;
import com.example.HiMade.user.dto.UserReservationFormDTO;
import com.example.HiMade.user.service.UserReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/userReservation")
public class UserReservationController {

  @Autowired
  private UserReservationService userReservationService;

  @PostMapping("/getDateTime")
  public List<UserRSlotDTO> getDateTime(@RequestBody UserRSlotDTO dto){
    System.out.println( dto.getReservationSlotDate());
    LocalDate date = dto.getReservationSlotDate();
    System.out.println(date);
    System.out.println(userReservationService.getDateTime(date));
    return userReservationService.getDateTime(date);
  }

  @GetMapping("/getAllDateTime/{id}")
  public List<UserRSlotDTO> getAllDateTime(@PathVariable int id){
    System.out.println(userReservationService.getAllDateTime(id));
    return userReservationService.getAllDateTime(id);
  }

  @PostMapping("/setReservationForm")
  public int setReservationForm(@RequestBody UserReservationDTO dto) {
    System.out.println(dto);
    return userReservationService.setReservationForm(dto);
  }


  @PostMapping("/setReservationFormDetail")
  public void setReservationFormDetail(@RequestBody List<UserReservationFormDTO> dto) {
    System.out.println("form에 들어갈 배열 값들 --- " + dto);
    userReservationService.setReservationFormDetail(dto);
  }


  @PostMapping("/getSlotTime")
  public List<UserReservationDTO> getSlotTime(@RequestBody UserRSlotDTO dto){
    int slotkey = dto.getReservationSlotKey();
    System.out.println("슬롯키"  + slotkey);

    return userReservationService.getSlotTime(slotkey);
  }

  @GetMapping("/getNoSlot")
  public List<LocalDate> getNoSlot(){
    System.out.println(userReservationService.getNoSlot());
    return userReservationService.getNoSlot();
  }

  @PostMapping("/updateSlotStatus")
  public void updateSlotStatus(@RequestBody Map<String, Object> slotUpdate) {
    int categoryId = (int) slotUpdate.get("categoryId");
    LocalDate reservationDate = LocalDate.parse((String) slotUpdate.get("reservationDate"));
    int storeNo = (int) slotUpdate.get("storeNo");

    userReservationService.updateSlotStatus(categoryId, reservationDate, storeNo);
  }




}
