package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.AdminChatDTO;
import com.example.HiMade.admin.mapper.AdminChatMapper;
import com.example.HiMade.admin.service.AdminChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Service
public class AdminChatServiceImpl implements AdminChatService {

    @Autowired
    private AdminChatMapper adminChatMapper;

    @Override
    public List<AdminChatDTO> getChatHistory(String userId, Long storeNo, int limit) {
        return adminChatMapper.fetchChatHistory(userId, storeNo, limit);
    }

    @Override
    public void saveChatMessage(AdminChatDTO chatMessage) {
        adminChatMapper.insertChatMessage(chatMessage);
    }

    @Override
    public List<Map<String, Object>> getChatListForStore(Long storeNo) {
        return adminChatMapper.getChatListForStore(storeNo);
    }

    @Override
    public List<AdminChatDTO> findNewMessages(String userId, Long storeNo, Timestamp lastCheckedTime) {
        return adminChatMapper.selectNewMessages(userId, storeNo, lastCheckedTime);
    }

    @Override
    public void updateLastCheckedTime(String userId, Long storeNo) {
        adminChatMapper.updateLastCheckedTime(userId, storeNo);
    }
}
