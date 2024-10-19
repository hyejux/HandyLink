package com.example.HiMade.admin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class StoreAddr {

    private String zipcode; //우편번호
    private String addr; //주소
    private String addrdetail; //상세주소
}
