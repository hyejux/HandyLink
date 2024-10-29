package com.example.HiMade.admin.service;

import com.example.HiMade.admin.dto.AdminChatDTO;

import java.util.List;
import java.util.Map;

public interface AdminChatService {
    List<AdminChatDTO> getChatHistory(String userId, String storeId, int limit);
    void saveChatMessage(AdminChatDTO chatMessage);
    List<Map<String, Object>> getChatListForStore(String storeId);

}
