package com.example.HiMade.user.service;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.user.dto.UserCateDTO;

import java.util.List;

public interface UserStoreService {

  public List<UserCateDTO> getStoreMainCategory(int id);
  public StoreRegistDTO getStoreInfo(int id);

}
