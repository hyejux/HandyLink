package com.example.HiMade.admin.controller;

import com.example.HiMade.admin.dto.AdminChatDTO;
import com.example.HiMade.admin.service.AdminChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adminChat")
public class AdminChatController {

    @Autowired
    private AdminChatService adminChatService;

    // 채팅 히스토리 가져오기
    @GetMapping("/history")
    public List<AdminChatDTO> getChatHistory(@RequestParam String userId, @RequestParam String storeId, @RequestParam int limit) {
        return adminChatService.getChatHistory(userId, storeId, limit);
    }

    // 새로운 채팅 메시지 저장
    @PostMapping("/save")
    public void saveChatMessage(@RequestBody AdminChatDTO chatMessage) {
        adminChatService.saveChatMessage(chatMessage);
    }

}
