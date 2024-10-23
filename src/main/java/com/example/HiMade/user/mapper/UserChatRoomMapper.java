package com.example.HiMade.user.mapper;

//import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.dto.UserChatDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserChatRoomMapper {
    void insertChatRoom(@Param("storeId") String storeId, @Param("userId") String userId);  // 채팅방 생성
    List<UserChatDTO> selectChatRoomByUser(@Param("userId") String userId);  // 유저 ID로 채팅방 조회
}
