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
    void updateStoreInfo(StoreRegistDTO storeRegistDTO); //마이페이지 update

    String findAdminId(@Param("managerName") String managerName, @Param("storeBusinessNo") String storeBusinessNo); //아이디찾기
    Integer findAdminPw(@Param("storeId") String storeId, @Param("storeBusinessNo") String storeBusinessNo); //비번찾기
    void updatePw(@Param("newPw") String newPw, @Param("storeId") String storeId, @Param("storeBusinessNo") String storeBusinessNo); //새비번등록

    StoreRegistDTO getMyStore(Long storeNo); //가게관리정보 불러오기
    void updateStore(StoreRegistDTO storeRegistDTO); //내가게 업데이트

    void deleteStoreImg(@Param("storeId") String storeId, @Param("storeImgList") List<StoreImgDTO> storeImgList); //이미지 삭제
    List<String> selectExistingStoreImg(String storeId); // DB에 저장된 이미지 경로 확인
    void addStoreImg(StoreImgDTO storeImgDTO); //가게img 추가

    void deleteStoreSns(@Param("storeId") String storeId, @Param("storeSns") List<StoreSnsDTO> storeSns);
    List<String> selectExistingSns(String storeId); // DB에 저장된 이미지 경로 확인
    void addStoreSns(StoreSnsDTO storeSnsDTO); //가게img 추가

    void updateDay(StoreRegistDTO storeRegistDTO); //고정휴무-update
    List<DayOffDay> getOffDay(Integer storeNo);//고정휴무-select
    void registDayOffSet(DayOffSet dayOffSet); //지정휴무
    List<DayOffSet> getOffSet(Integer storeNo); //지정휴무-select
    Integer deleteOffSet(@Param("storeNo") Integer storeNo, @Param("setNo") Integer setNo); //지정휴무-delete

    Integer duplicatedId(String storeId); //아이디 중복검사

    List<storeNoticeDTO> getNoticeList(); // 가게소식
    void setNotice(storeNoticeDTO dto); // 가게 소식 등록
}
