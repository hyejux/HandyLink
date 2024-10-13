package com.example.HiMade.user.mapper;

import com.example.HiMade.user.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserAccountMapper {
    void insertUser(UserDTO userDTO);
    int checkEmail(String email);
    UserDTO loginUser(UserDTO userDTO);
    UserDTO getUserById(@Param("userId") Long userId);
    void updateUser(UserDTO userDTO);
}
