package com.example.HiMade.user.mapper;

import com.example.HiMade.user.dto.UserCateDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserStoreMapper {
  public List<UserCateDTO> getStoreMainCategory(String storeId);
}
