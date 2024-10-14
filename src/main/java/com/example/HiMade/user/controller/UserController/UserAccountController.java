package com.example.HiMade.user.controller.UserController;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/user")
public class UserAccountController {
    @Autowired
    private UserAccountService userAccountService;

    // 아이디(이메일) 중복 확인
    @GetMapping("/checkEmail")
    public ResponseEntity<?> checkEmail(@RequestParam("userEmail") String email) {
        boolean isDuplicate = userAccountService.checkEmail(email);
        if (isDuplicate) {
            return ResponseEntity.ok().body("{\"isDuplicate\": true}");
        } else {
            return ResponseEntity.ok().body("{\"isDuplicate\": false}");
        }
    }

    // 회원 가입 및 이미지 파일 경로 insert
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@ModelAttribute UserDTO userDTO, @RequestParam("profileImage") MultipartFile profileImage) {
        try {
            // 프로필 이미지 저장 및 경로 설정
            String savedFilePath = saveProfileImage(profileImage);
            if (savedFilePath != null) {
                userDTO.setUserImgUrl(savedFilePath);
            }

            System.out.println("UserDTO: " + userDTO);
            userAccountService.insertUser(userDTO);

            return ResponseEntity.ok("회원 가입이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생");
        }
    }

    // 이미지 파일 경로 생성 메서드 - 이건 로컬에 저장시키는 방식이라 추후에 다른 방식으로 수정할 것
    private String saveProfileImage(MultipartFile profileImage) throws IOException {
        if (profileImage == null || profileImage.isEmpty()) {
            System.out.println("파일이 업로드되지 않았습니다.");
            return null;
        }

        String uploadDir = "C:/uploads";  // 업로드 경로 설정
        File uploadFolder = new File(uploadDir);

        // 경로가 없으면 디렉토리 생성
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
            System.out.println("업로드 폴더가 생성되었습니다: " + uploadDir);
        }

        // 파일 저장 경로 생성
        String filePath = uploadDir + "/" + profileImage.getOriginalFilename();
        File dest = new File(filePath);
        profileImage.transferTo(dest);  // 파일 저장

        System.out.println("파일이 저장되었습니다: " + filePath);
        return filePath;
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDTO userDTO, HttpSession session) {
        UserDTO user = userAccountService.loginUser(userDTO);
        System.out.println("로그인한 사용자 정보: " + user);
        if (user != null) {
            System.out.println("로그인 성공: " + user.getUserEmail());
            session.setAttribute("userId", user.getUserId()); // 세션에 로그인된 유저의 ID 저장
            return ResponseEntity.ok(user); // 로그인 성공 시 유저 정보를 반환
        } else {
            return ResponseEntity.status(401).body("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    // 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId != null) {
            UserDTO user = userAccountService.getUserById(userId);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 사용자 정보 수정
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@ModelAttribute UserDTO userDTO, @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        // 로그로 전달된 userPhone 값 확인
        System.out.println("업데이트할 연락처: " + userDTO.getUserPhonenum());
        System.out.println("업데이트할 사용자 정보: " + userDTO.toString());

        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                String savedFilePath = saveProfileImage(profileImage); // 이미지 저장
                userDTO.setUserImgUrl(savedFilePath); // 이미지 URL 설정
            }
            userAccountService.updateUser(userDTO); // 사용자 정보 수정 로직 실행
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사용자 정보 수정 중 오류 발생");
        }
    }

}
