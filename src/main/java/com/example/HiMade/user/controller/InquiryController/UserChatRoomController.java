package com.example.HiMade.user.controller.InquiryController;

import com.example.HiMade.user.dto.UserChatDTO;
import com.example.HiMade.user.service.UserChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/userChatRoom")
public class UserChatRoomController {
    @Autowired
    private UserChatRoomService userChatRoomService;

    @GetMapping("/select")
    public List<UserChatDTO> selectTest() {
        return userChatRoomService.selectTest();
    }

    @PostMapping("/insert")
    public ResponseEntity<String> insertChat(@RequestBody UserChatDTO userChatDTO) {
        userChatRoomService.insertTest(userChatDTO);
        return ResponseEntity.ok("insert 성공 찌리리공");
    }
}
