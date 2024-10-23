package com.example.HiMade.admin.mapper;

import com.example.HiMade.admin.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Mapper
public interface AdminStoreMapper {

    StoreRegistDTO loginCheck(@Param("id") String id,@Param("pw") String pw); //로그인
    void registStore(StoreRegistDTO storeRegistDTO); //업체등록
    void insertDay(DayOffDay dayOffDay); //가게등록시 고정휴무 세팅
    void updateStore(StoreRegistDTO storeRegistDTO); //내가게 업데이트
    void addStoreSns(StoreSnsDTO storeSns); //가게sns추가
    void updateStoreSns(StoreSnsDTO storeSns); //가게sns업데이트
    StoreRegistDTO getMyStore(Long storeNo); //가게관리정보 불러오기

    void updateDay(StoreRegistDTO storeRegistDTO); //고정휴무-update
    void registDayOffSet(DayOffSet dayOffSet); //지정휴무

    String uploadImage(MultipartFile file); // 이미지 업로드
    Integer duplicatedId(String storeId); //아이디 중복검사
    StoreRegistDTO getStoreInfo(String storeId); //이미지 불러오기

    List<storeNoticeDTO> getNoticeList(); // 가게소식
    void setNotice(storeNoticeDTO dto); // 가게 소식 등록
}
