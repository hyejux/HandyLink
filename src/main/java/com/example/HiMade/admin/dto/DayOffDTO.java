package com.example.HiMade.admin.dto;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class DayOffDTO {

    private Integer dayId; //업체휴무pk
    private String dayOffType; //휴무타입
    private String dayOffFix; //정기휴무요일
    private String dayOffFixStatus; //정기휴무상태(Y, N)
    private LocalDate dayOffStart; //지정휴무시작일
    private LocalDate dayOffEEnd; //지정휴무종료일
    private String storeId; //업체아이디
    private Long storeNo; //업체번호
}
