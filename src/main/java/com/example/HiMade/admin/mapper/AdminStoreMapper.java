package com.example.HiMade.admin.mapper;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Mapper
public interface AdminStoreMapper {

    StoreRegistDTO loginCheck(@Param("id") String id,@Param("pw") String pw); //로그인
    void registStore(StoreRegistDTO storeRegistDTO); //업체등록

    void updateStoreSet(StoreRegistDTO storeRegistDTO); //내가게 업데이트

    String uploadImage(MultipartFile file); // 이미지 업로드
    Integer duplicatedId(String storeId); //아이디 중복검사
    StoreRegistDTO getStoreInfo(String storeId); //이미지 불러오기

}
