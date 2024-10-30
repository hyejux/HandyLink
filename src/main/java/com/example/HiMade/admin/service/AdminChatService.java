package com.example.HiMade.admin.service;

import com.example.HiMade.admin.dto.AdminChatDTO;
import com.example.HiMade.user.dto.UserChatDTO;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

public interface AdminChatService {
    List<AdminChatDTO> getChatHistory(String userId, String storeId, int limit);
    void saveChatMessage(AdminChatDTO chatMessage);
    List<Map<String, Object>> getChatListForStore(String storeId);
    List<AdminChatDTO> findNewMessages(String userId, String storeId, Timestamp lastCheckedTime);
}
