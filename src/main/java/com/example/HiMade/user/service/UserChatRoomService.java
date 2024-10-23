package com.example.HiMade.user.service;

//import com.example.HiMade.user.dto.UserChatDTO;

import com.example.HiMade.user.dto.UserChatDTO;

import java.util.List;

public interface UserChatRoomService {
    void createChatRoom(String storeId, String userId);  // 채팅방 생성
    List<UserChatDTO> getChatRoomByUser(String userId);  // 유저 ID로 채팅방 조회
}
