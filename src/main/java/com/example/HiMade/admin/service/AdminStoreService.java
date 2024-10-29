package com.example.HiMade.admin.service;

import com.example.HiMade.admin.dto.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminStoreService {

    StoreRegistDTO loginCheck(String id, String pw); //로그인
    void registStore(StoreRegistDTO storeRegistDTO); //업체등록
    void updateStoreInfo(StoreRegistDTO storeRegistDTO); //마이페이지 update

    String findAdminId(String managerName, String storeBusinessNo); //아이디찾기
    Integer findAdminPw(String storeId, String storeBusinessNo); //비번찾기
    void updatePw(String newPw, String storeId, String storeBusinessNo); //새비번등록

    void updateStore(StoreRegistDTO storeRegistDTO); //내가게 업데이트
    StoreRegistDTO getMyStore(Long storeNo); //가게관리정보 불러오기


    void updateDay(StoreRegistDTO storeRegistDTO); //고정휴무-update
    List<DayOffDay> getOffDay(Integer storeNo);//고정휴무-select
    void registDayOffSet(DayOffSet dayOffSet); //지정휴무
    List<DayOffSet> getOffSet(Integer storeNo); //지정휴무-select
    Integer deleteOffSet(Integer storeNo, Integer setNo); //지정휴무-delete

    String uploadImage(MultipartFile file); // 이미지 업로드
    Integer duplicatedId(String storeId); //아이디 중복검사

    List<storeNoticeDTO> getNoticeList(); // 가게소식
    void setNotice(storeNoticeDTO dto); // 가게 소식 등록
    void setNoticeModi(storeNoticeDTO dto); // 가게 소식 등록
    void setNoticeStatus(storeNoticeDTO dto);
    public storeNoticeDTO getNoticeDetail( int id);

}
