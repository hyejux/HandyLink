package com.example.HiMade.admin.dto;


import lombok.*;

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

}
