package com.example.HiMade.user.dto;

import lombok.*;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class UserChatDTO {
    private Long chatNo;
    private String chatContent;
    private Timestamp chatTime;
    private String storeId;
    private String userId;
}
