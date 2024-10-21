package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.mapper.UserAccountMapper;
import com.example.HiMade.user.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafProperties;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserAccountServiceImpl implements UserAccountService, UserDetailsService {

    // application-secret.properties 파일에서 값 가져오기
    private final Dotenv dotenv = Dotenv.load(); // .env 파일 로드
    private final String CLIENT_ID = dotenv.get("REACT_APP_KAKAO_CLIENT_ID");
    private final String REDIRECT_URI = dotenv.get("REACT_APP_KAKAO_REDIRECT_URI");
    private final String KAKAO_TOKEN_URL = dotenv.get("KAKAO_TOKEN_URL");
    private final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me"; // 사용자 정보 요청 URL

    private static final Logger logger = LoggerFactory.getLogger(UserAccountServiceImpl.class);

    @Autowired
    private UserAccountMapper userAccountMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private ThymeleafProperties thymeleafProperties;

    // 생성자를 통해 의존성 주입
    public UserAccountServiceImpl(BCryptPasswordEncoder passwordEncoder, UserAccountMapper userAccountMapper) {
        this.passwordEncoder = passwordEncoder;
        this.userAccountMapper = userAccountMapper;
    }

    @Override
    @Transactional
    public void insertUser(UserDTO userDTO) {
        if (userDTO.getUserPw() != null && !userDTO.getUserPw().isEmpty()) {
            if ("KAKAO".equals(userDTO.getUserPw())) {
                // 카카오 로그인 사용자의 경우 비밀번호를 그대로 "KAKAO"로 저장시킴 -> 비밀번호 쓸 일 없어서 구분 용도로
                userDTO.setUserPw("KAKAO");
            } else {
                // 일반 사용자의 경우 비밀번호 암호화
                String encodedPassword = passwordEncoder.encode(userDTO.getUserPw());
                userDTO.setUserPw(encodedPassword);
            }
        } else {
            // 비밀번호가 제공되지 않은 경우 (예외 처리)
            throw new IllegalArgumentException("비밀번호가 제공되지 않았습니다.");
        }
        userAccountMapper.insertUser(userDTO);
    }

    @Override
    public boolean checkId(String userId) {
        return userAccountMapper.checkId(userId) > 0; // 이메일 중복 시 true 반환
    }

    @Override
    public UserDTO getUserById(String userId) {
        return userAccountMapper.getUserById(userId);
    }

    @Override
    public void updateUser(UserDTO userDTO) {
        // 비밀번호가 제공되었을 때는 비밀번호도 암호화하여 업데이트
        if (userDTO.getUserPw() != null && !userDTO.getUserPw().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(userDTO.getUserPw());
            userDTO.setUserPw(encodedPassword);
            userAccountMapper.updateUserWithPassword(userDTO);  // 비밀번호 포함한 업데이트
        } else {
            userAccountMapper.updateUser(userDTO);  // 비밀번호 없이 업데이트
        }
    }

    // 시큐리티 방식의 로그인 (사용자 인증)
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        UserDTO user = userAccountMapper.getUserById(userId);

        if (user == null) {
            logger.error("유저를 찾을 수 없음: {}", userId);
            throw new UsernameNotFoundException("찾을 수 없는 유저 : " + userId);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        // 비밀번호가 암호화된 상태로 User 객체 생성
        return new User(user.getUserId(), user.getUserPw(), authorities);
    }

    @Override
    public String getKakaoAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", CLIENT_ID);
        body.add("redirect_uri", REDIRECT_URI);
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(KAKAO_TOKEN_URL, request, Map.class);

        System.out.println("로그 Kakao token URL: " + KAKAO_TOKEN_URL);
        System.out.println("로그 Request body: " + body);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            return (String) responseBody.get("access_token");
        }
        return null;
    }

    @Override
    public UserDTO getKakaoUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(KAKAO_USERINFO_URL, HttpMethod.GET, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> kakaoAccount = (Map<String, Object>) responseBody.get("kakao_account");
            Map<String, Object> properties = (Map<String, Object>) responseBody.get("properties");

            // 카카오에서 제공하는 사용자 정보
            String kakaoId = String.valueOf(responseBody.get("id"));
            String nickname = (String) properties.get("nickname");
            String profileImage = (String) properties.get("profile_image");

            // UserDTO로 변환
            return UserDTO.builder()
                    .userId(kakaoId)
                    .userName(nickname)
                    .userImgUrl(profileImage)
                    .build();
        }
        return null;
    }

    @Override
    public String findUserId(String userName, String phonenum) {
        return userAccountMapper.findUserIdByNameAndPhone(userName, phonenum);
    }

    @Override
    public boolean verifyUserForPasswordReset(String userId, String userName, String phonenum) {
        return userAccountMapper.verifyUserForPasswordReset(userId, userName, phonenum) > 0;
    }

    @Override
    @Transactional
    public void resetPassword(String userId, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        userAccountMapper.updatePassword(userId, encodedPassword);
    }

    @Override
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
