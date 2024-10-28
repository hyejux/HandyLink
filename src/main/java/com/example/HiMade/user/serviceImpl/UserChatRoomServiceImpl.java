package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.mapper.UserChatRoomMapper;
import com.example.HiMade.user.service.UserChatRoomService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserChatRoomServiceImpl implements UserChatRoomService {

    private static final Logger logger = LoggerFactory.getLogger(UserChatRoomServiceImpl.class);

    private final UserChatRoomMapper userChatRoomMapper;

    @Override
    public void insertChat(UserChatDTO userChatDTO) {

        logger.info("로그 서비스 insert user chat: {}", userChatDTO);
        userChatRoomMapper.insertChat(userChatDTO);
    }

    @Override
    public List<UserChatDTO> selectChat(String userId, String storeId) {
        return userChatRoomMapper.selectChat(userId, storeId);
    }
}
