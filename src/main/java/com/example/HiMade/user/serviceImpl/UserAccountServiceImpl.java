package com.example.HiMade.user.serviceImpl;

import com.example.HiMade.user.dto.UserDTO;
import com.example.HiMade.user.mapper.UserAccountMapper;
import com.example.HiMade.user.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAccountServiceImpl implements UserAccountService {
    @Autowired
    private UserAccountMapper userAccountMapper;

    @Override
    @Transactional
    public void insertUser(UserDTO userDTO) {

        userAccountMapper.insertUser(userDTO);
    }

    @Override
    public boolean checkId(String userId) {
        return userAccountMapper.checkId(userId) > 0; // 이메일 중복 시 true 반환
    }

    @Override
    public UserDTO loginUser(UserDTO userDTO) {
        return userAccountMapper.loginUser(userDTO);
    }

    @Override
    public UserDTO getUserById(String userId) {
        return userAccountMapper.getUserById(userId);
    }

    @Override
    public void updateUser(UserDTO userDTO) {
        userAccountMapper.updateUser(userDTO);
    }

    @Override
    public void updatePassword(UserDTO userDTO) {
        userAccountMapper.updatePassword(userDTO);
    }
}
