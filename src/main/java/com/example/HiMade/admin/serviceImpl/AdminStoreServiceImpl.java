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
import java.util.List;

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
            dayOff.setStoreId(storeRegistDTO.getStoreId());
            dayOff.setStoreNo(storeRegistDTO.getStoreNo());
            dayOff.setDayOffDay(day);
            dayOff.setDayOffType("고정");
            dayOff.setDayOffFixStatus("N");

            adminStoreMapper.insertDay(dayOff);
        }

    }

    @Override
    public void addStoreSns(StoreSnsDTO storeSns) {
        adminStoreMapper.addStoreSns(storeSns);
    }

    @Override
    public void updateStore(StoreRegistDTO storeRegistDTO) {
        adminStoreMapper.updateStore(storeRegistDTO);
    }

    @Override
    public void updateStoreSns(StoreSnsDTO storeSns) {
        adminStoreMapper.updateStoreSns(storeSns);
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
    public void registDayOffSet(DayOffSet dayOffSet) {
        adminStoreMapper.registDayOffSet(dayOffSet);
    }

    @Override
    public String uploadImage(MultipartFile file) { //이미지 URL 변환해서 리턴
        String imageUrl = null;
        try {
            String uploadDir = "C:/Users/admin/Desktop/HiMade/src/main/resources/static/uploads"; // 원하는 경로로 변경
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs(); // 디렉토리가 존재하지 않으면 생성
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File uploadFile = new File(uploadDir + "/" + fileName); // 파일 경로 설정
            file.transferTo(uploadFile); // 파일 저장

            // URL 반환
            imageUrl = "http://localhost:8585/uploads/" + fileName; // 로컬 개발 환경
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
    public StoreRegistDTO getStoreInfo(String storeId) {
        return adminStoreMapper.getStoreInfo(storeId);
    }

}
