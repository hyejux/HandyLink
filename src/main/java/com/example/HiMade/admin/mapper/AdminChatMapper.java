package com.example.HiMade.admin.mapper;

import com.example.HiMade.admin.dto.AdminChatDTO;
import com.example.HiMade.user.dto.UserChatDTO;
import org.apache.ibatis.annotations.Mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminChatMapper {
    List<AdminChatDTO> fetchChatHistory(String userId, Long storeNo, int limit);
    void insertChatMessage(AdminChatDTO chatMessage);
    List<Map<String, Object>> getChatListForStore(Long storeNo);
    List<AdminChatDTO> selectNewMessages(String userId, Long storeNo, Timestamp lastCheckedTime);
    void updateLastCheckedTime(String userId, Long storeNo);
}
