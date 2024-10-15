package com.example.HiMade.user.dto;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder

public class UserRSlotDTO {

  private int reservationSlotKey;
  private LocalDate reservationSlotDate;
  private int slotCount;
  private int slotStatusCount;
  private Boolean reservationActive ;
  private String storeId;
  private int categoryId;

}
