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
        try {
            logger.info("로그 서비스 메시지 저장 시작: {}", userChatDTO);

            // 메시지 저장
            userChatRoomMapper.insertChat(userChatDTO);

            // 사용자가 보낸 경우에만 actived 상태 업데이트
            if ("USER".equals(userChatDTO.getSenderType())) {
                String receiverId = userChatDTO.getStoreId();

                // 채팅방 상태 확인
                Map<String, Object> chatStatus = userChatRoomMapper.getChatRoomStatus(
                        receiverId,
                        userChatDTO.getStoreNo()
                );

                // actived가 'N'인 경우 재활성화
                if (chatStatus != null && "N".equals(chatStatus.get("actived"))) {
                    logger.info("비활성화된 채팅방 발견. 재활성화 시도 - userId: {}, storeNo: {}",
                            receiverId,
                            userChatDTO.getStoreNo()
                    );

                    userChatRoomMapper.reactivateChat(receiverId, userChatDTO.getStoreNo());
                    logger.info("채팅방 재활성화 완료 - userId: {}, storeNo: {}", receiverId, userChatDTO.getStoreNo());
                }
            }

        } catch (Exception e) {
            logger.error("채팅 저장 또는 재활성화 중 오류 발생", e);
            throw e;
        }
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
