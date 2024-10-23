package com.example.HiMade.user.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
  private int storeNo;
  private int categoryId;
  private int limitTime;

  @JsonProperty("serviceStart")
  private LocalDateTime serviceStart;

}
