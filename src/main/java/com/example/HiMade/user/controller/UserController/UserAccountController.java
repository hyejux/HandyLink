package com.example.HiMade.user.controller.UserController;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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
    public ResponseEntity<String> signUp(@RequestBody UserDTO userDTO,
                                         @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
                                         HttpSession session) {
        logger.info("Received UserDTO: {}", userDTO);
        logger.info("Received ProfileImage: {}", (profileImage != null ? profileImage.getOriginalFilename() : "null"));

        try {
            // 카카오 로그인 사용자인지 확인
            UserDTO kakaoUser = (UserDTO) session.getAttribute("kakaoUser");
            if (kakaoUser != null) {
                // 카카오 사용자 정보와 추가 입력 정보를 합침
                userDTO.setUserId(kakaoUser.getUserId());
                userDTO.setUserName(kakaoUser.getUserName());
                userDTO.setUserImgUrl(kakaoUser.getUserImgUrl());
                // 카카오 로그인 사용자는 비밀번호 필드를 "KAKAO"로 설정
                userDTO.setUserPw("KAKAO");
            } else if (profileImage != null && !profileImage.isEmpty()) {
                // 일반 회원가입의 경우 프로필 이미지 처리
                String filePath = saveProfileImage(profileImage);
                userDTO.setUserImgUrl(filePath);
            }

            userAccountService.insertUser(userDTO);
            return ResponseEntity.ok("회원 가입이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            logger.error("회원가입 중 오류 발생", e);
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

    // 카카오 로그인 처리
    @GetMapping("/login/oauth2/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam String code, HttpSession session) {
        try {
            // 1. 카카오 인가 코드를 이용해 액세스 토큰을 요청
            String accessToken = userAccountService.getKakaoAccessToken(code);
            System.out.println("로그 로그 Access Token: " + accessToken);  // 로그 추가

            // 2. 액세스 토큰을 이용해 사용자 정보를 요청
            UserDTO kakaoUser = userAccountService.getKakaoUserInfo(accessToken);
            System.out.println("로그 로그 Access Token: " + accessToken);  // 로그 추가

            // 3. DB에서 사용자 확인 (이미 회원인지 확인)
            UserDTO existingUser = userAccountService.getUserById(kakaoUser.getUserId());

            if (existingUser == null) {
                // 신규 사용자인 경우 회원가입 페이지로 리다이렉트
                session.setAttribute("kakaoUser", kakaoUser);
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", "/UserSignUp.user")
                        .build();
            } else {
                // 기존 사용자인 경우 자동 로그인 처리
                Authentication authentication = new UsernamePasswordAuthenticationToken(existingUser.getUserId(), "KAKAO", AuthorityUtils.createAuthorityList("ROLE_USER"));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 세션에 사용자 정보 저장
                session.setAttribute("userId", existingUser.getUserId());

                // 로그인 성공 후 리다이렉트할 페이지 (예: 메인 페이지)
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", "/UserMyPage.user")
                        .build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("로그 로그 Detailed error: " + e.getMessage());  // 더 자세한 오류 메시지
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("카카오 로그인 처리 중 오류 발생");
        }
    }

    @GetMapping("/kakao-info")
    public ResponseEntity<UserDTO> getKakaoUserInfo(HttpSession session) {
        UserDTO kakaoUser = (UserDTO) session.getAttribute("kakaoUser");
        if (kakaoUser != null) {
            return ResponseEntity.ok(kakaoUser);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            String userId = auth.getName(); // 여기서 userId를 직접 가져옵니다.
            UserDTO user = userAccountService.getUserById(userId);
            if (user != null) {
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


}
