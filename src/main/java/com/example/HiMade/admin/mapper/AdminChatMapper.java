package com.example.HiMade.admin.mapper;

import com.example.HiMade.admin.dto.AdminChatDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminChatMapper {
    List<AdminChatDTO> fetchChatHistory(String userId, String storeId, int limit);
    void insertChatMessage(AdminChatDTO chatMessage);
    List<Map<String, Object>> getChatListForStore(String storeId);

}
