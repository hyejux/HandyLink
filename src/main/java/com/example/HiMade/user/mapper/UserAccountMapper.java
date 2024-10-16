package com.example.HiMade.user.mapper;

import com.example.HiMade.user.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserAccountMapper {
    void insertUser(UserDTO userDTO);
    int checkId(String userId);
    UserDTO getUserById(@Param("userId") String userId);
    void updateUser(UserDTO userDTO);
    void updateUserWithPassword(UserDTO userDTO);
}
