package com.example.HiMade.admin.controller;

import com.example.HiMade.admin.dto.*;
import com.example.HiMade.admin.service.AdminStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.SocketTimeoutException;
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
        adminStoreService.registStore(storeRegistDTO);
    }

    //아이디 찾기
    @GetMapping("/findAdminId")
    public String findAdminId(@RequestParam String managerName, @RequestParam String storeBusinessNo){
        String storeId = adminStoreService.findAdminId(managerName,storeBusinessNo);
        System.out.println("아이디찾기 " + storeId);

        return storeId;
    }

    //비밀번호 찾기
    @GetMapping("/findAdminPw")
    public Integer findAdminPw(@RequestParam String storeId, @RequestParam String storeBusinessNo){
        Integer pwYn = adminStoreService.findAdminPw(storeId, storeBusinessNo);
        System.out.println("비번찾기 " + pwYn);

        return pwYn;
    }

    //비밀번호 찾기 - 새로운 비밀번호 변경
    @PostMapping("/updatePw")
    public void updatePw(@RequestParam String newPw,
                         @RequestParam String storeId,
                         @RequestParam String storeBusinessNo){

        System.out.println("newPw: "+newPw+" storeId: "+storeId+"storeBusinessNo: "+storeBusinessNo);
        adminStoreService.updatePw(newPw, storeId, storeBusinessNo);
    }

    //마이페이지 - update
    @PostMapping("/updateStoreInfo")
    public void updateStoreInfo(@RequestBody StoreRegistDTO storeRegistDTO){
        System.out.println("마이페이지 수정 "+storeRegistDTO);
        adminStoreService.updateStoreInfo(storeRegistDTO);
    }

    //가게관리 & 마이페이지 - 정보 가져오기
    @GetMapping("/myStoreInfo")
    public ResponseEntity<StoreRegistDTO> getMyStore(@RequestParam Long storeNo){
        StoreRegistDTO myStore = adminStoreService.getMyStore(storeNo);
        return ResponseEntity.ok(myStore);
    }

    //가게관리-등록
    @PostMapping("/updateStore")
    public void updateStore(@RequestBody StoreRegistDTO storeRegistDTO){
        System.out.println("내가게 " + storeRegistDTO);
        adminStoreService.updateStore(storeRegistDTO);
    }

    //고정휴무-update
    @PostMapping("/updateDay")
    public void updateDay(@RequestBody StoreRegistDTO storeRegistDTO) {
        adminStoreService.updateDay(storeRegistDTO);
    }

    //고정휴무-select
    @GetMapping("/getOffDay")
    public List<DayOffDay> getOffDay(@RequestParam Integer storeNo){
        return adminStoreService.getOffDay(storeNo);
    }

    //지정휴무 - insert
    @PostMapping("/registDayOffSet")
    public void registDayOffSet(@RequestBody StoreRegistDTO storeRegistDTO){
        for(DayOffSet dayOffSet : storeRegistDTO.getDayOffSetList()){
            adminStoreService.registDayOffSet(dayOffSet);
        }
    }

    //지정휴무 - delete
    @DeleteMapping("/deleteOffSet")
    public ResponseEntity<Integer> deleteOffSet(@RequestParam Integer storeNo, @RequestParam Integer setNo){
        Integer result = adminStoreService.deleteOffSet(storeNo, setNo);
        if(result > 0){
            return ResponseEntity.ok(result);
        }else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(0); //삭제 조건에 안맞음
        }
    }

    //지정휴무-select
    @GetMapping("/getOffSet")
    public List<DayOffSet> getOffSet(@RequestParam Integer storeNo){
        return adminStoreService.getOffSet(storeNo);
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
        System.out.println("Received payload: " + payload);
        String imageUrl = payload.get("imageUrl");

        if (imageUrl == null) {
            return ResponseEntity.badRequest().body("imageUrl is missing in the request");
        }

        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1); // 파일 이름 추출
        String uploadDir = "C:/Users/admin/Desktop/HandyLink/src/main/resources/static/uploads/storeImg"; // 이미지 저장 경로

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


    @GetMapping("getNoticeList")
    public List<storeNoticeDTO> getNoticeList(){
        return adminStoreService.getNoticeList();
    }

    @PostMapping("setNotice")
    public void setNotice(@RequestBody storeNoticeDTO dto){
        System.out.println(dto);
        adminStoreService.setNotice(dto);
    }

}
