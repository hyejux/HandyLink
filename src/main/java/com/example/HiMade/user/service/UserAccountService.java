package com.example.HiMade.user.service;

import com.example.HiMade.user.dto.UserDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserAccountService {
    void insertUser(UserDTO userDTO);
    boolean checkId(String userId);
//    UserDTO loginUser(UserDTO userDTO);
    UserDTO getUserById(String userId);
    void updateUser(UserDTO userDTO);
    UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException;
}
