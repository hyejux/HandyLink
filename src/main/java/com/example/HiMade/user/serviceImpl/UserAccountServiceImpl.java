package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.mapper.UserAccountMapper;
import com.example.HiMade.user.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAccountServiceImpl implements UserAccountService {

    @Autowired
    UserAccountMapper userAccountMapper;

    @Override
    public void insertUser(UserDTO userDTO) {
        userAccountMapper.insertUser(userDTO);
    }

    @Override
    public boolean checkId(String userId) {
        userAccountMapper.checkId(userId);
        return true;
    }

    @Override
    public UserDTO getUserById(String userId) {
        System.out.println(userAccountMapper.getUserById(userId));
        return userAccountMapper.getUserById(userId);
    }

    @Override
    public void updateUser(UserDTO userDTO) {

    }

    @Override
    public String getKakaoAccessToken(String code, String redirectUri) {
        return "";
    }

    @Override
    public UserDTO getKakaoUserInfo(String accessToken) {
        return null;
    }

    @Override
    public String findUserId(String userName, String phonenum) {
        return "";
    }

    @Override
    public boolean verifyUserForPasswordReset(String userId, String userName, String phonenum) {
        return false;
    }

    @Override
    public void resetPassword(String userId, String newPassword) {

    }

    @Override
    public boolean deleteUser(String userId, String password) {
        return false;
    }

    @Override
    public boolean deleteKakaoUser(String userId, String accessToken, String confirmationText) throws Exception {
        return false;
    }
}
