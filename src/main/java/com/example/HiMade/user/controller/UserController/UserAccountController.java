package com.example.HiMade.user.controller.UserController;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserAccountController {

    private static final Logger logger = LoggerFactory.getLogger(UserAccountController.class);

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
    public ResponseEntity<String> signUp(@ModelAttribute UserDTO userDTO,
                                         @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            userDTO.setLoginType("GENERAL");

            // 프로필 이미지 처리
            if (profileImage != null && !profileImage.isEmpty()) {
                String filePath = saveProfileImage(profileImage);
                userDTO.setUserImgUrl(filePath);
            }

            // 유저 등록
            userAccountService.insertUser(userDTO);
            return ResponseEntity.ok("회원 가입이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생: " + e.getMessage());
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

        // 파일명 생성 (타임스탬프 기반)
        String originalFilename = profileImage.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = System.currentTimeMillis() + fileExtension; // 타임스탬프를 파일명으로 사용

        // 파일 저장 경로 생성
        Path filePath = uploadPath.resolve(newFilename);
        try (InputStream inputStream = profileImage.getInputStream()) {
            Files.copy(inputStream, filePath);
        }

        System.out.println("파일이 저장되었습니다: " + filePath);

        return newFilename;
    }

    // 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            String userId = auth.getName(); // 여기서 userId를 직접 가져옴
            UserDTO user = userAccountService.getUserById(userId);
            if (user != null) {
                // 프로필 이미지 URL (파일명만 저장된 경우)
                if (user.getUserImgUrl() != null && !user.getUserImgUrl().isEmpty()) {
                    user.setUserImgUrl("/uploads/" + Paths.get(user.getUserImgUrl()).getFileName().toString());
                }
                return ResponseEntity.ok(user);
            }
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

    // 아이디 찾기 인증
    @GetMapping("/find-id")
    public ResponseEntity<String> findUserId(@RequestParam String userName, @RequestParam String phonenum) {
        String userId = userAccountService.findUserId(userName, phonenum);

        if (userId != null) {
            String maskedUserId = maskUserId(userId);
            return ResponseEntity.ok(maskedUserId);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 정보로 가입된 사용자가 없습니다.");
        }
    }

    // 아이디 찾기 결과에 * 마스킹 처리
    private String maskUserId(String userId) {
        int atIndex = userId.indexOf('@');
        if (atIndex > 2) { // 아이디가 3자리 이상인 경우
            int maskLength = 2; // 마스킹할 길이 (예: 2자리)
            String visiblePart = userId.substring(0, atIndex - maskLength);
            String maskedPart = "*".repeat(maskLength);
            return visiblePart + maskedPart + userId.substring(atIndex);
        } else if (atIndex > 0) { // 아이디가 1~2자리인 경우 끝자리 마스킹
            return userId.substring(0, atIndex - 1) + "*" + userId.substring(atIndex);
        }
        return userId;
    }

    // 비밀번호 찾기 인증
    @PostMapping("/verify-reset-password")
    public ResponseEntity<?> verifyUserForPasswordReset(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String userName = payload.get("userName");
        String phonenum = payload.get("phonenum");

        boolean isVerified = userAccountService.verifyUserForPasswordReset(userId, userName, phonenum);

        if (isVerified) {
            return ResponseEntity.ok().body("{\"verified\": true}");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"verified\": false, \"message\": \"사용자 정보를 찾을 수 없습니다.\"}");
        }
    }

    // 비밀번호 찾기를 통한 수정
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String newPassword = payload.get("newPassword");

        try {
            userAccountService.resetPassword(userId, newPassword);
            return ResponseEntity.ok().body("{\"success\": true, \"message\": \"비밀번호가 성공적으로 재설정되었습니다.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"success\": false, \"message\": \"비밀번호 재설정 중 오류가 발생했습니다.\"}");
        }
    }

}
