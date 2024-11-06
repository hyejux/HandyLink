package com.example.HiMade.admin.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class OptionDTO {

    private String categoryLevel; //카테고리 레빌
    private String serviceName; //상품명
    private String middleCategoryValue; //텍스트값

}
