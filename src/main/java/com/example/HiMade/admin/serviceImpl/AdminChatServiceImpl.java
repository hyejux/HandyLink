package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.AdminChatDTO;
import com.example.HiMade.admin.mapper.AdminChatMapper;
import com.example.HiMade.admin.service.AdminChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminChatServiceImpl implements AdminChatService {

    @Autowired
    private AdminChatMapper adminChatMapper;

    @Override
    public List<AdminChatDTO> getChatHistory(String userId, String storeId, int limit) {
        return adminChatMapper.fetchChatHistory(userId, storeId, limit);
    }

    @Override
    public void saveChatMessage(AdminChatDTO chatMessage) {
        adminChatMapper.insertChatMessage(chatMessage);
    }

    @Override
    public List<Map<String, Object>> getChatListForStore(String storeId) {
        return adminChatMapper.getChatListForStore(storeId);
    }
}
