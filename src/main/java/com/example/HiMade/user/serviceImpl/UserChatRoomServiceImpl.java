package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.user.dto.ChatStatusDTO;
import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.mapper.UserChatRoomMapper;
import com.example.HiMade.user.service.UserChatRoomService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

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
    public List<UserChatDTO> selectChat(String userId, Long storeNo) {
        logger.info("로그 selectChat userId: {}", userId);
        return userChatRoomMapper.selectChat(userId, storeNo);
    }

    @Override
    public List<Map<String, Object>> getChatListForUser(String userId) {
        return userChatRoomMapper.getChatListForUser(userId);
    }

    @Override
    public StoreRegistDTO getStoreInfoByStoreNo(Long storeNo) {
        return userChatRoomMapper.getStoreInfoByStoreNo(storeNo);
    }

    @Override
    public void updateLastCheckedTime(String userId, Long storeNo, Timestamp lastCheckedTime) {
        System.out.println("DB 업데이트 시도 - userId: " + userId + ", storeNo: " + storeNo + ", lastCheckedTime : " + lastCheckedTime);
        userChatRoomMapper.updateUserLastCheckedTime(userId, storeNo, lastCheckedTime);
    }

    @Override
    public boolean hasUnreadMessages(String userId) {
        return userChatRoomMapper.hasUnreadMessages(userId);
    }

    @Override
    public void deactivateChat(String userId, Long storeNo) {
        userChatRoomMapper.deactivateChat(userId, storeNo);
    }

    @Override
    public void reactivateChat(String userId, Long storeNo) {
        userChatRoomMapper.reactivateChat(userId, storeNo);
    }
}
