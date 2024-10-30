package com.example.HiMade.admin.mapper;

import com.example.HiMade.admin.dto.AdminChatDTO;
import com.example.HiMade.user.dto.UserChatDTO;
import org.apache.ibatis.annotations.Mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminChatMapper {
    List<AdminChatDTO> fetchChatHistory(String userId, String storeId, int limit);
    void insertChatMessage(AdminChatDTO chatMessage);
    List<Map<String, Object>> getChatListForStore(String storeId);
    List<AdminChatDTO> selectNewMessages(String userId, String storeId, Timestamp lastCheckedTime);
}
