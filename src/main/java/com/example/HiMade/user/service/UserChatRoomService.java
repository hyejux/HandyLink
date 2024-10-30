package com.example.HiMade.user.service;

//import com.example.HiMade.user.dto.UserChatDTO;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.user.dto.UserChatDTO;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface UserChatRoomService {
    void insertChat(UserChatDTO userChatDTO);
    List<UserChatDTO> selectChat(String userId, String storeId);
    List<Map<String, Object>> getChatListForUser(String userId);
    StoreRegistDTO getStoreInfoByStoreId(String storeId);
    List<UserChatDTO> findNewMessages(String userId, String storeId, Timestamp lastCheckedTime);
}
