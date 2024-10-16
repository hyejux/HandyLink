package com.example.HiMade.admin.controller;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.admin.service.AdminStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/adminStore")
public class AdminStoreController {

    @Autowired
    @Qualifier("adminStoreService")
    private AdminStoreService adminStoreService;

    //아이디중복체크
    @PostMapping("/duplicatedIdCheck")
    public Integer duplicatedId(@RequestBody StoreRegistDTO storeRegistDTO) {
        Integer result = adminStoreService.duplicatedId(storeRegistDTO.getStoreId());
        return result;
    }

    //업체가입
    @PostMapping("/registStore")
    public void registStore(@RequestBody StoreRegistDTO storeRegistDTO){
        System.out.println("업체정보 " + storeRegistDTO);

        adminStoreService.registStore(storeRegistDTO);
    }

    // 파일 업로드 메서드
    @PostMapping("/uploadImageToServer")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        // 파일 저장 로직 (S3에 저장하거나 로컬 저장)
        String imageUrl = adminStoreService.uploadImage(file);
        System.out.println("이미지 "+imageUrl);
        return ResponseEntity.ok(imageUrl);
    }

    // 이미지 삭제 메서드
    @DeleteMapping("/deleteImage")
    public ResponseEntity<String> deleteImage(@RequestBody Map<String, String> payload) {
        String imageUrl = payload.get("imageUrl");
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1); // 파일 이름 추출
        String uploadDir = "C:/Users/admin/Desktop/HiMade/src/main/resources/static/uploads"; // 이미지 저장 경로

        File file = new File(uploadDir + "/" + fileName);
        if (file.exists()) {
            if (file.delete()) {
                return ResponseEntity.ok("이미지 삭제 성공");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 삭제 실패");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("이미지 파일을 찾을 수 없습니다.");
        }
    }


    @GetMapping("/storeInfoImg")
    public List<String> getStoreImg(@RequestParam String storeId){
        return adminStoreService.getStoreImg(storeId);
    }


}
