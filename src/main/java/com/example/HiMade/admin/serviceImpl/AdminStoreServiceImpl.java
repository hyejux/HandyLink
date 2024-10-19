package com.example.HiMade.admin.serviceImpl;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.admin.mapper.AdminStoreMapper;
import com.example.HiMade.admin.service.AdminStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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
    public void registStore(StoreRegistDTO storeRegistDTO) {
        adminStoreMapper.registStore(storeRegistDTO);
    }

    @Override
    public void updateStoreSet(StoreRegistDTO storeRegistDTO) {
        adminStoreMapper.updateStoreSet(storeRegistDTO);
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
