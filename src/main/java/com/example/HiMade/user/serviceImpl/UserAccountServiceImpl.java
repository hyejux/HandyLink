package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.mapper.UserAccountMapper;
import com.example.HiMade.user.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.authority.AuthorityUtils;

@Service
public class UserAccountServiceImpl implements UserAccountService, UserDetailsService {
    @Autowired
    private UserAccountMapper userAccountMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void insertUser(UserDTO userDTO) {
        // 비밀번호 암호화 후 저장
        String encodedPassword = passwordEncoder.encode(userDTO.getUserPw());
        userDTO.setUserPw(encodedPassword);
        userAccountMapper.insertUser(userDTO);
    }

    @Override
    public boolean checkId(String userId) {
        return userAccountMapper.checkId(userId) > 0; // 이메일 중복 시 true 반환
    }

//    @Override
//    public UserDTO loginUser(UserDTO userDTO) {
//        // DB에서 사용자 정보 가져오기
//        UserDTO storedUser = userAccountMapper.getUserById(userDTO.getUserId());
//
//        // 사용자가 존재하는지 확인
//        if (storedUser == null) {
//            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
//        }
//
//        // 입력된 비밀번호와 DB에 저장된 암호화된 비밀번호 비교
//        boolean passwordMatches = passwordEncoder.matches(userDTO.getUserPw(), storedUser.getUserPw());
//
//        if (passwordMatches) {
//            // 비밀번호가 일치하면 사용자 정보를 반환
//            return storedUser;
//        } else {
//            // 비밀번호가 일치하지 않으면 null 반환 또는 예외 처리
//            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
//        }
//    }

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
        // DB에서 사용자 정보 가져오기
        UserDTO user = userAccountMapper.getUserById(userId);

        // 사용자가 존재하는지 확인
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId);
        }

        // UserDetails 객체로 변환하여 Spring Security가 인증 처리하도록 반환
        return new org.springframework.security.core.userdetails.User(
                user.getUserId(),  // 사용자 ID
                user.getUserPw(),  // 암호화된 비밀번호
                AuthorityUtils.createAuthorityList("ROLE_USER")  // 기본 사용자 권한
        );
    }
}
