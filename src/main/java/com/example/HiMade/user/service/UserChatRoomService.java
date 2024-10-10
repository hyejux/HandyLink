package com.example.HiMade.user.service;

import com.example.HiMade.user.dto.UserChatDTO;

import java.util.List;

public interface UserChatRoomService {
    List<UserChatDTO> selectTest();
    void insertTest(UserChatDTO userChatDTO);
}
