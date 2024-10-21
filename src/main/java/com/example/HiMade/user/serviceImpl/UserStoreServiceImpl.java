package com.example.HiMade.user.serviceImpl;


import com.example.HiMade.user.dto.UserCateDTO;
import com.example.HiMade.user.mapper.UserReservationMapper;
import com.example.HiMade.user.mapper.UserStoreMapper;
import com.example.HiMade.user.service.UserStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("UserStoreService")
public class UserStoreServiceImpl implements UserStoreService {

  @Autowired
  UserStoreMapper userStoreMapper;

  @Override
  public List<UserCateDTO> getStoreMainCategory(int id) {

    return userStoreMapper.getStoreMainCategory(id);
  }
}
