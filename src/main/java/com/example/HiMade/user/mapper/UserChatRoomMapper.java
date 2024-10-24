package com.example.HiMade.user.mapper;

import com.example.HiMade.user.dto.UserChatDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserChatRoomMapper {
    void insertChat(UserChatDTO userChatDTO);
    List<UserChatDTO> selectChat(String userId, String storeId);
}
