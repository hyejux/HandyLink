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

//    @JsonProperty("zipcode")
    private String zipcode; //우편번호
//    @JsonProperty("addr")
    private String addr; //주소
//    @JsonProperty("addrdetail")
    private String addrdetail; //상세주소
}
