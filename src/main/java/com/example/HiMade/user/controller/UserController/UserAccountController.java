package com.example.HiMade.user.controller.UserController;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/user")
public class UserAccountController {

    @Autowired
    private UserAccountService userAccountService;

    // 이메일 중복 확인
    @GetMapping("/checkId")
    public ResponseEntity<?> checkId(@RequestParam("userId") String userId) {
        boolean isDuplicate = userAccountService.checkId(userId);
        if (isDuplicate) {
            return ResponseEntity.ok().body("{\"isDuplicate\": true}");
        } else {
            return ResponseEntity.ok().body("{\"isDuplicate\": false}");
        }
    }

    // 회원 가입 및 이미지 파일 저장
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@ModelAttribute UserDTO userDTO, @RequestParam("profileImage") MultipartFile profileImage) {
        try {
            // 프로필 이미지 저장
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

    // 이미지 파일 경로 생성 메서드
    private String saveProfileImage(MultipartFile profileImage) throws IOException {
        if (profileImage == null || profileImage.isEmpty()) {
            System.out.println("파일이 업로드되지 않았습니다.");
            return null;
        }

        // 업로드 경로 설정
        String uploadDir = "src/main/resources/static/uploads";
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        // 경로가 없으면 디렉토리 생성
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("업로드 폴더가 생성되었습니다: " + uploadPath);
        }

        // 간결한 파일명 생성 (타임스탬프 기반)
        String originalFilename = profileImage.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = System.currentTimeMillis() + fileExtension; // 타임스탬프를 파일명으로 사용

        // 파일 저장 경로 생성
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(profileImage.getInputStream(), filePath);

        System.out.println("파일이 저장되었습니다: " + filePath);

        // 웹에서 접근 가능한 경로 반환
        return "/static/uploads/" + newFilename;
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDTO userDTO, HttpSession session) {
        try {
            UserDetails userDetails = userAccountService.loadUserByUsername(userDTO.getUserId());
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDTO.getUserPw(), userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDTO user = userAccountService.getUserById(userDTO.getUserId());
            session.setAttribute("userId", user.getUserId());  // 세션에 사용자 정보 저장
            return ResponseEntity.ok(user);
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            return ResponseEntity.status(401).body("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    // 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile() {
        // 인증된 사용자 정보 가져오기
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String userId = userDetails.getUsername();

            // userId를 통해 사용자 정보를 조회
            UserDTO user = userAccountService.getUserById(userId);
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 사용자 정보 수정 (비밀번호 포함)
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@ModelAttribute UserDTO userDTO, @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        System.out.println("업데이트할 사용자 정보: " + userDTO.toString());
        try {
            // 프로필 이미지 저장 로직
            if (profileImage != null && !profileImage.isEmpty()) {
                String savedFilePath = saveProfileImage(profileImage); // 이미지 저장
                userDTO.setUserImgUrl(savedFilePath); // 이미지 URL 설정
            }

            // 비밀번호 및 사용자 정보 업데이트
            userAccountService.updateUser(userDTO);  // 비밀번호가 변경된 경우도 처리

            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사용자 정보 수정 중 오류 발생");
        }
    }


}
