package com.example.HiMade.user.controller.UserController;

import com.example.HiMade.user.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.HiMade.user.dto.UserDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;


@RestController
@RequestMapping("/kakao")
public class UserSocialController {

    private static final Logger logger = LoggerFactory.getLogger(UserAccountController.class);

    @Autowired
    private UserAccountService userAccountService;

    // 카카오 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<String> kakaoSignUp(@RequestBody UserDTO userDTO, HttpSession session) {
        try {
            //logger.info("컨트롤러로 넘어온 userDTO: {}", userDTO);

            // 세션에서 카카오 사용자 정보 가져오기
            UserDTO kakaoUser = (UserDTO) session.getAttribute("kakaoUser");
            //logger.info("세션에서 가져온 카카오 사용자 정보: {}", kakaoUser); // 아이디, 이름, 프로필 넘어옴

            if (kakaoUser == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("카카오 사용자 정보가 없습니다.");
            }

            // 카카오에서 넘겨준 사용자 정보로 UserDTO 일부 세팅
            userDTO.setUserId(kakaoUser.getUserId());
            userDTO.setUserName(kakaoUser.getUserName());
            userDTO.setUserImgUrl(kakaoUser.getUserImgUrl());
            userDTO.setLoginType("KAKAO");  // 카카오 로그인 타입 설정

            // 유저 등록
            logger.info("등록할 사용자 정보: {}", userDTO);
            userAccountService.insertUser(userDTO);

            // 세션에서 카카오 사용자 정보 제거
            session.removeAttribute("kakaoUser");

            return ResponseEntity.ok("카카오 회원가입이 성공적으로 완료되었습니다.");
        } catch (Exception e) {
            logger.error("카카오 회원가입 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("카카오 회원가입 중 오류 발생");
        }
    }

    // 카카오 로그인 처리
    @GetMapping("/login/oauth2")
    public ResponseEntity<?> kakaoLogin(@RequestParam String code, HttpSession session) {
        try {
            // 1. 카카오 인가 코드를 통해 액세스 토큰을 요청
            String accessToken = userAccountService.getKakaoAccessToken(code);
            logger.info("로그 Access Token: {}", accessToken);

            // 2. 액세스 토큰으로 카카오 사용자 정보 요청
            UserDTO kakaoUser = userAccountService.getKakaoUserInfo(accessToken);
            logger.info("로그 Kakao User Info: {}", kakaoUser);

            // 3. 사용자 정보가 DB에 있는지 확인
            UserDTO existingUser = userAccountService.getUserById(kakaoUser.getUserId());

            if (existingUser == null) {
                // 카카오 사용자 정보 세션에 저장하고 회원가입 페이지로 리다이렉트
                kakaoUser.setLoginType("KAKAO");
                session.setAttribute("kakaoUser", kakaoUser);
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", "/UserSignUp.user?kakao=true")
                        .build();
            } else {
                // 카카오 로그인 처리
                Authentication authentication = new UsernamePasswordAuthenticationToken(existingUser.getUserId(), null, AuthorityUtils.createAuthorityList("ROLE_USER"));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

                // 마이페이지로 리다이렉트
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header("Location", "/UserMain.user")
                        .build();
            }
        } catch (Exception e) {
            logger.error("카카오 로그인 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("카카오 로그인 처리 중 오류 발생");
        }
    }

    // 카카오 회원가입 시 정보 조회
    @GetMapping("/info")
    public ResponseEntity<UserDTO> getKakaoUserInfo(HttpSession session) {
        UserDTO kakaoUser = (UserDTO) session.getAttribute("kakaoUser");
        if (kakaoUser != null) {
            return ResponseEntity.ok(kakaoUser);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
