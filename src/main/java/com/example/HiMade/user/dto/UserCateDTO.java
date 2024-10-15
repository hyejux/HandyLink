package com.example.HiMade.user.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class UserCateDTO {

  private int categoryId;
  private int categoryLevel;
  private int parentCategoryId;
  private String serviceName;
  private int servicePrice;
  private String serviceContent;
  private String storeId;
}
