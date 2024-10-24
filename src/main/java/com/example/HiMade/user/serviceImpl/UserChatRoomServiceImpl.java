package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.mapper.UserChatRoomMapper;
import com.example.HiMade.user.service.UserChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserChatRoomServiceImpl implements UserChatRoomService {

    private final UserChatRoomMapper userChatRoomMapper;

    @Override
    public void createChatRoom(String storeId, String userId) {
        userChatRoomMapper.insertChatRoom(storeId, userId);
    }

    @Override
    public List<UserChatDTO> getChatRoomByUser(String userId) {
        return userChatRoomMapper.selectChatRoomByUser(userId);
    }
}
