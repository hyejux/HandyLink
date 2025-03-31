package com.example.HiMade.admin.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class adminReserveAdd {

  private String serviceName;
  private int servicePrice;
  private String serviceContent;
  private List<adminRSDTO> categories;
  private LocalDateTime serviceStart;
  private Integer dateNumCase;
  private Integer timeNumCase;
  private Integer storeNo;
  private String storeId;
  private Integer categoryId;
  private LocalDate reservationSlotDate;
}
