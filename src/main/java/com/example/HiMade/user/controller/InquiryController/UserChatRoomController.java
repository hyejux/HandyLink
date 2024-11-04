package com.example.HiMade.user.controller.InquiryController;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.user.dto.ChatStatusDTO;
import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.service.UserChatRoomService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class UserChatRoomController {

    private static final Logger logger = LoggerFactory.getLogger(UserChatRoomController.class);

    @Autowired
    private UserChatRoomService userChatRoomService;

    @PostMapping("/save")
    public ResponseEntity<?> saveMessage(@RequestBody UserChatDTO userChatDTO) {
        // 들어온 요청 로그 찍기
        logger.info("로그 컨트롤러 Received message data: {}", userChatDTO);

        // 메시지 저장 시도
        try {
            logger.info("메시지 저장 시도: {}", userChatDTO);
            userChatRoomService.insertChat(userChatDTO);
            logger.info("메시지 저장 성공");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("메시지 저장 중 오류 발생", e);
            return ResponseEntity.status(500).body("메시지 저장 중 오류가 발생했습니다.");
        }
    }

    // 채팅 기록 불러오기
    @GetMapping("/history")
    public List<UserChatDTO> getChatHistory(@RequestParam String userId, @RequestParam Long storeNo) {
        logger.info("로그 Fetching chat history for userId: {} and storeNo: {}", userId, storeNo);
        return userChatRoomService.selectChat(userId, storeNo);
    }

    // 현재 로그인된 사용자 확인
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.ok(Map.of("userId", auth.getName()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/list")
    public ResponseEntity<?> getChatList(@RequestParam String userId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (!auth.getName().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("접근 권한이 없습니다.");
            }

            List<Map<String, Object>> chatList = userChatRoomService.getChatListForUser(userId);

            // 전체 데이터 구조 확인
            for (Map<String, Object> chat : chatList) {
                logger.info("채팅방 데이터: {}", chat.toString());
            }

            return ResponseEntity.ok(chatList);
        } catch (Exception e) {
            logger.error("채팅 목록 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("채팅 목록을 불러오는 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/getStoreInfoByStoreNo/{storeNo}")
    public ResponseEntity<StoreRegistDTO> getStoreInfoByStoreNo(@PathVariable Long storeNo) {
        System.out.println("가게 정보 띄우기" + userChatRoomService.getStoreInfoByStoreNo(storeNo));
        StoreRegistDTO storeInfo = userChatRoomService.getStoreInfoByStoreNo(storeNo);
        if (storeInfo != null) {
            return ResponseEntity.ok(storeInfo);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


//    @GetMapping("/checkNewMessages")
//    public List<UserChatDTO> checkNewMessages(
//            @RequestParam String userId,
//            @RequestParam Long storeNo,
//            @RequestParam Timestamp lastCheckedTime) {
//        return userChatRoomService.findNewMessages(userId, storeNo, lastCheckedTime);
//    }

    @PostMapping("/updateLastCheckedTime")
    public ResponseEntity<Void> updateLastCheckedTime(@RequestParam Long storeNo, @RequestParam String userId, Timestamp lastCheckedTime) {
        System.out.println("로그 updateLastCheckedTime - storeNo: " + storeNo + ", userId: " + userId + ", lastCheckedTime: " + lastCheckedTime);
        userChatRoomService.updateLastCheckedTime(userId, storeNo, lastCheckedTime);
        return ResponseEntity.ok().build();
    }


//    @GetMapping("/lastCheckedTimes")
//    public ResponseEntity<List<ChatStatusDTO>> getLastCheckedTimes(@RequestParam String userId) {
//        List<ChatStatusDTO> lastCheckedTimes = userChatRoomService.getLastCheckedTimesByUserId(userId);
//        return ResponseEntity.ok(lastCheckedTimes);
//    }

}
