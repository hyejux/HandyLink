package com.example.HiMade.handler;

import com.example.HiMade.user.service.UserAccountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.CloseStatus;

import java.security.Principal;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

    // 사용자 ID별로 여러 개의 WebSocket 세션을 관리하는 Map
@Component
public class WebSocketHandler extends TextWebSocketHandler {
    private static final ConcurrentHashMap<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserAccountService userAccountService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Spring Security의 SecurityContext에서 인증 정보 가져오기
        String userId = extractUserIdFromSession(session);
        if (userId != null) {
            userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(session);
            System.out.println("New WebSocket connection established for user: " + userId);
        } else {
            session.close();  // 인증되지 않은 사용자는 연결 종료
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String userId = extractUserIdFromSession(session);
        if (userId == null) {
            session.close();
            return;
        }

        Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
        // 메시지에서 userId와 storeId를 추출
        String senderId = (String) payload.get("userId");

        // 메시지 발신자 검증
        if (!userId.equals(senderId)) {
            return;  // 권한 없음
        }

        String recipientId = (String) payload.get("recipientId"); // 받는 사람 ID

        System.out.println("Message received from: " + senderId + " to " + recipientId);

        // 각 대상의 모든 세션에 메시지 전송
        sendMessageToUser(senderId, payload);
        sendMessageToUser(recipientId, payload);
    }

    // 각 사용자 ID에 연결된 모든 세션에 메시지 전송
    private void sendMessageToUser(String userId, Map<String, Object> payload) throws Exception {
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (sessions != null) {
            String messageString = objectMapper.writeValueAsString(payload);
            for (WebSocketSession ws : sessions) {
                if (ws.isOpen()) {
                    ws.sendMessage(new TextMessage(messageString));
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 닫힌 세션을 모든 사용자 세션 목록에서 제거
        userSessions.forEach((userId, sessions) -> sessions.remove(session));
        // 빈 세션 목록 제거
        userSessions.entrySet().removeIf(entry -> entry.getValue().isEmpty());

        System.out.println("WebSocket connection closed: " + session.getId());
    }

    private String extractUserIdFromSession(WebSocketSession session) {
        Map<String, Object> attributes = session.getAttributes();
        Principal principal = session.getPrincipal();
        if (principal != null) {
            return principal.getName();  // UserDetailsService에서 설정한 username(userId) 반환
        }
        return null;
    }
}

