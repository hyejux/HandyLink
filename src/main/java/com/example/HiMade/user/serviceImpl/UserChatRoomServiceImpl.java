package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.mapper.UserChatRoomMapper;
import com.example.HiMade.user.service.UserChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserChatRoomServiceImpl implements UserChatRoomService {

    @Autowired
    private UserChatRoomMapper userChatRoomMapper;

    @Override
    public List<UserChatDTO> selectTest() {
        return userChatRoomMapper.selectTest();
    }

    @Override
    public void insertTest(UserChatDTO userChatDTO) {
        userChatRoomMapper.insertTest(userChatDTO);
    }
}
