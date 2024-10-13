package com.example.HiMade.user.service;

import com.example.HiMade.user.dto.UserDTO;

public interface UserAccountService {
    void insertUser(UserDTO userDTO);
    boolean checkEmail(String email);
    UserDTO loginUser(UserDTO userDTO);
    UserDTO getUserById(Long userId);
    void updateUser(UserDTO userDTO);
}
