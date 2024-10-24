package com.example.HiMade.user.service;

//import com.example.HiMade.user.dto.UserChatDTO;

import com.example.HiMade.user.dto.UserChatDTO;

import java.util.List;

public interface UserChatRoomService {
    void insertChat(UserChatDTO userChatDTO);
    List<UserChatDTO> selectChat(String userId, String storeId);
}
