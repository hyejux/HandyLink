package com.example.HiMade.user.mapper;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.user.dto.UserChatDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserChatRoomMapper {
    void insertChat(UserChatDTO userChatDTO);
    List<UserChatDTO> selectChat(String userId, String storeId);
    List<Map<String, Object>> getChatListForUser(String userId);
    StoreRegistDTO getStoreInfoByStoreId(String storeId);
}
