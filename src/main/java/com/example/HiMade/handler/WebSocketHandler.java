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

import javax.servlet.http.HttpSession;
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
        String sessionUserId = extractUserIdFromSession(session);
        if (sessionUserId == null) {
            session.close();
            return;
        }

        Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
        String userId = (String) payload.get("userId");
        String storeId = (String) payload.get("storeId");
        String senderType = (String) payload.get("senderType");

        // STORE 타입일 경우 sessionUserId와 storeId를 비교
        // USER 타입일 경우 sessionUserId와 userId를 비교
        if ("STORE".equals(senderType)) {
            if (!sessionUserId.equals(storeId)) {
                return;
            }
        } else {
            if (!sessionUserId.equals(userId)) {
                return;
            }
        }

        // 기존 로직대로 메시지 전송
        sendMessageToUser(userId, payload);   // userId에게 전송
        sendMessageToUser(storeId, payload);  // storeId에게 전송
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

            // 1. 시큐리티로 로그인한 일반 사용자 체크
            Principal principal = session.getPrincipal();
            if (principal != null) {
                System.out.println("Found user through security principal: " + principal.getName());
                return principal.getName();
            }

            // 2. 일반 세션으로 로그인한 스토어 체크
            HttpSession httpSession = (HttpSession) attributes.get("HTTP.SESSION");
            if (httpSession != null) {
                String storeId = (String) httpSession.getAttribute("storeId");
                if (storeId != null) {
                    System.out.println("Found store through session: " + storeId);
                    return storeId;
                }
            }

            System.out.println("No user or store ID found");
            return null;
        }
}

