package com.example.HiMade.user.controller.InquiryController;

import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.service.UserChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatroom")
public class UserChatRoomController {
    @Autowired
    private UserChatRoomService userChatRoomService;

    @PostMapping("/create")
    public ResponseEntity<String> createChatRoom(@RequestParam String storeId, @RequestParam String userId) {
        userChatRoomService.createChatRoom(storeId, userId);
        return new ResponseEntity<>("채팅방 생성 완료", HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserChatDTO>> getChatRoomsByUser(@PathVariable String userId) {
        List<UserChatDTO> chatRooms = userChatRoomService.getChatRoomByUser(userId);
        return new ResponseEntity<>(chatRooms, HttpStatus.OK);
    }

}
