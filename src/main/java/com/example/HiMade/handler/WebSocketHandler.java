package com.example.HiMade.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.CloseStatus;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    // 사용자 아이디 당 여러 개의 ws세션을 저장할 수 있도록 set으로 받음
    private static final ConcurrentHashMap<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = "123@naver.com";  // 고객 ID
        String storeId = "1";             // 업체 ID

        // 고객 세션 저장
        userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(session);
        // 업체 세션 저장
        userSessions.computeIfAbsent(storeId, k -> ConcurrentHashMap.newKeySet()).add(session);

        //System.out.println("New connection established: " + session.getId());
        //System.out.println("Current user sessions: " + userSessions.keySet());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);

        String senderId = (String) payload.get("senderId");
        String recipientId = (String) payload.get("recipientId");

        //System.out.println("Sending message from " + senderId + " to " + recipientId);

        // 중복 전송을 방지하기 위해 모든 세션을 Set에 모음
        Set<WebSocketSession> sessionsToSend = ConcurrentHashMap.newKeySet();

        // 발신자의 세션 추가
        Set<WebSocketSession> senderSessions = userSessions.get(senderId);
        if (senderSessions != null) {
            sessionsToSend.addAll(senderSessions);
        }

        // 수신자의 세션 추가
        Set<WebSocketSession> recipientSessions = userSessions.get(recipientId);
        if (recipientSessions != null) {
            sessionsToSend.addAll(recipientSessions);
        }

        // 모든 대상 세션에 한 번씩만 메시지 전송
        String messageString = objectMapper.writeValueAsString(payload);
        for (WebSocketSession ws : sessionsToSend) {
            if (ws.isOpen()) {
                ws.sendMessage(new TextMessage(messageString));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 모든 사용자의 세션 목록에서 닫힌 세션 제거
        for (Set<WebSocketSession> sessions : userSessions.values()) {
            sessions.remove(session);
        }

        // 빈 세션 셋 제거
        userSessions.entrySet().removeIf(entry -> entry.getValue().isEmpty());

        //System.out.println("Connection closed: " + session.getId());
        //System.out.println("Remaining sessions: " + userSessions.size());
    }
}