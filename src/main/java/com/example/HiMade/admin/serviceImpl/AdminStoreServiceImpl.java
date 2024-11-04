package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.*;
import com.example.HiMade.admin.mapper.AdminStoreMapper;
import com.example.HiMade.admin.service.AdminStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("adminStoreService")
public class AdminStoreServiceImpl implements AdminStoreService {

    @Autowired
    private AdminStoreMapper adminStoreMapper;


    @Override
    public StoreRegistDTO loginCheck(String id, String pw) {
        StoreRegistDTO result = adminStoreMapper.loginCheck(id,pw);
        return result;
    }

    @Override
    @Transactional
    public void registStore(StoreRegistDTO storeRegistDTO) {
        adminStoreMapper.registStore(storeRegistDTO);

        System.out.println("확인storeId "+storeRegistDTO.getStoreId());
        System.out.println("확인storeNo "+storeRegistDTO.getStoreNo());

        List<String> daysOfWeek = Arrays.asList("월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일");


        for (String day : daysOfWeek) {
            DayOffDay dayOff = new DayOffDay();
//            dayOff.setStoreId(storeRegistDTO.getStoreId());
            dayOff.setStoreNo(storeRegistDTO.getStoreNo());
            dayOff.setDayOffDay(day);
            dayOff.setDayOffType("고정");
            dayOff.setDayOffFixStatus("N");

            adminStoreMapper.insertDay(dayOff);
        }
    }

    @Override
    public void updateStoreInfo(StoreRegistDTO storeRegistDTO) {
        adminStoreMapper.updateStoreInfo(storeRegistDTO);
    }

    @Override
    public String findAdminId(String managerName, String storeBusinessNo) {
        return adminStoreMapper.findAdminId(managerName, storeBusinessNo);
    }

    @Override
    public Integer findAdminPw(String storeId, String storeBusinessNo) {
        return adminStoreMapper.findAdminPw(storeId, storeBusinessNo);
    }

    @Override
    public void updatePw(String newPw, String storeId, String storeBusinessNo) {
        adminStoreMapper.updatePw(newPw, storeId, storeBusinessNo);
    }

    @Override
    public void updateStore(StoreRegistDTO storeRegistDTO) {
        Long storeNo = storeRegistDTO.getStoreNo();
        List<StoreImgDTO> storeImgList = storeRegistDTO.getStoreImg();
        List<StoreSnsDTO> storeSns = storeRegistDTO.getStoreSns();

        adminStoreMapper.updateStore(storeRegistDTO); // 가게정보 업데이트

        // 1. 기존 이미지 삭제
        adminStoreMapper.deleteStoreImg(storeNo, storeImgList);


        if (storeImgList != null && !storeImgList.isEmpty()) {
            // 2. DB에 없는 이미지만 삽입
            List<String> existingImgs = adminStoreMapper.selectExistingStoreImg(storeNo);

            for (StoreImgDTO storeImg : storeImgList) {
                if (storeImg != null && !existingImgs.contains(storeImg.getStoreImgLocation())) {
                    adminStoreMapper.addStoreImg(storeImg);  // DB에 없는 이미지만 삽입
                }
            }
        }

        //sns링크 삭제
        adminStoreMapper.deleteStoreSns(storeNo, storeSns);


        //db에 있는 sns링크 확인
        List<String> existingSns = adminStoreMapper.selectExistingSns(storeNo);

        if(storeSns != null && !storeSns.isEmpty()) {
            for (StoreSnsDTO sns : storeRegistDTO.getStoreSns()) {
                if (!existingSns.contains(sns.getSnsLink())) {
                    adminStoreMapper.addStoreSns(sns);
                }
            }
        }
    }

    @Override
    public StoreRegistDTO getMyStore(Long storeNo) {
        return adminStoreMapper.getMyStore(storeNo);
    }

    @Override
    public void updateDay(StoreRegistDTO storeRegistDTO) {

        adminStoreMapper.updateDay(storeRegistDTO);
    }

    @Override
    public List<DayOffDay> getOffDay(Long storeNo) {
        return adminStoreMapper.getOffDay(storeNo);
    }

    @Override
    public void registDayOffSet(DayOffSet dayOffSet) {
        adminStoreMapper.registDayOffSet(dayOffSet);
    }

    @Override
    public List<DayOffSet> getOffSet(Long storeNo) {
        return adminStoreMapper.getOffSet(storeNo);
    }

    @Override
    public Integer deleteOffSet(Long storeNo, Long setNo) {
        return adminStoreMapper.deleteOffSet(storeNo, setNo);
    }

    @Override
    public String uploadImage(MultipartFile file) { //이미지 URL 변환해서 리턴
        String imageUrl = null;
        try {
            String uploadDir = "C:/Users/admin/Desktop/HandyLink/src/main/resources/static/uploads/storeImg"; // 원하는 경로로 변경
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs(); // 디렉토리가 존재하지 않으면 생성
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File uploadFile = new File(uploadDir + "/" + fileName); // 파일 경로 설정
            file.transferTo(uploadFile); // 파일 저장

            // URL 반환
            imageUrl = "http://localhost:8585/uploads/storeImg/" + fileName; // 로컬 개발 환경
            // imageUrl = "https://example.com/uploads/" + fileName; // 운영 환경
        } catch (Exception e) {
            e.printStackTrace();
        }
        return imageUrl; // 업로드된 파일의 URL 반환
    }


    @Override
    public Integer duplicatedId(String storeId) {
        return adminStoreMapper.duplicatedId(storeId);
    }



    @Override
    public List<storeNoticeDTO> getNoticeList(int storeNo) {
        return adminStoreMapper.getNoticeList(storeNo);
    }

    @Override
    public void setNotice(storeNoticeDTO dto) {
       adminStoreMapper.setNotice(dto);
    }

    @Override
    public void setNoticeModi(storeNoticeDTO dto) {
        adminStoreMapper.setNoticeModi(dto);
    }

    @Override
    public void setNoticeStatus(storeNoticeDTO dto) {
        adminStoreMapper.setNoticeStatus(dto);
    }

    @Override
    public storeNoticeDTO getNoticeDetail(int id) {
        return adminStoreMapper.getNoticeDetail(id);
    }

    @Override
    public Map<String , Integer> getReportCount(Long storeNo) {
        Integer reviewCount = adminStoreMapper.getReviewCount(storeNo);
        Integer cancledCount = adminStoreMapper.getCancledCount(storeNo);

        System.out.println("리뷰개수: "+ reviewCount + "예약취소: " + cancledCount);

        Map<String, Integer> resultMap = new HashMap<>();
        resultMap.put("reviewCount", reviewCount);
        resultMap.put("cancledCount", cancledCount);

        return resultMap;
    }

}
