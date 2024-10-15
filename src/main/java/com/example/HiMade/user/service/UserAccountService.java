package com.example.HiMade.user.service;

import com.example.HiMade.user.dto.UserDTO;

public interface UserAccountService {
    void insertUser(UserDTO userDTO);
    boolean checkId(String userId);
    UserDTO loginUser(UserDTO userDTO);
    UserDTO getUserById(String userId);
    void updateUser(UserDTO userDTO);
    void updatePassword(UserDTO userDTO);
}
