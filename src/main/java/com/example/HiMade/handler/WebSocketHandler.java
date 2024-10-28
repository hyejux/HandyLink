package com.example.HiMade.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.CloseStatus;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    // 사용자 ID별로 여러 개의 WebSocket 세션을 관리하는 Map
    private static final ConcurrentHashMap<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 사용자 ID를 가져옴 (고객 또는 업체)
        String userId = extractUserId(session);

        // WebSocket 세션을 사용자 ID별로 저장
        if (userId != null) {
            userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(session);
            System.out.println("New WebSocket connection established for user: " + userId);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);

        // 메시지에서 userId와 storeId를 추출
        String senderId = (String) payload.get("senderId"); // 보낸 사람 ID
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

    // 현재 연결된 WebSocket 세션에서 사용자 ID 추출 (Spring Security 또는 세션 기반)
    private String extractUserId(WebSocketSession session) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName(); // SecurityContext에서 로그인된 사용자 ID 반환
        }
        // TODO: 업체의 경우 세션 또는 다른 인증 방식을 통해 userId를 추출하도록 수정 가능
        return null;
    }
}
