package com.example.HiMade.admin.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class userRL {
  private  int reservationNo;
  private  String reservationStatus;
  private  int reservationPrice;
  private LocalDateTime regTime;

  private  String storeName;
}
