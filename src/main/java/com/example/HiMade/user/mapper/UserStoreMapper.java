package com.example.HiMade.user.mapper;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.user.dto.UserCateDTO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Mapper
public interface UserStoreMapper {
  public List<UserCateDTO> getStoreMainCategory(int id);
  public StoreRegistDTO getStoreInfo(int id);
}
