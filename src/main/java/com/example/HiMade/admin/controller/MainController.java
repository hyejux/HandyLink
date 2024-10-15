package com.example.HiMade.admin.controller;

import com.example.HiMade.admin.dto.StoreRegistDTO;
import com.example.HiMade.admin.service.AdminStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
public class MainController {

  @Autowired
  @Qualifier("adminStoreService")
  private AdminStoreService adminStoreService;

  // BCryptPasswordEncoder 빈 주입
//  @Autowired
//  private BCryptPasswordEncoder passwordEncoder;

  @GetMapping("/{pageName}.user")
  public String page(@PathVariable String pageName, Model model) {
    model.addAttribute("pageName", pageName);
    System.out.println("뷰이름:" + pageName);
    return "userLayout";
  }

  @GetMapping("/{pageName}.admin")
  public String pageAdmin(@PathVariable String pageName, Model model) {
    model.addAttribute("pageName", pageName);
    System.out.println("뷰이름:" + pageName);
    return "adminLayout";
  }

  @GetMapping("/{pageName}.admin/{id}")
  public String pageAdmin(@PathVariable String pageName, @PathVariable String id, Model model) {
    model.addAttribute("pageName", pageName);
    model.addAttribute("id", id);
    System.out.println("뷰이름: " + pageName + ", ID: " + id);
    return "adminLayout";
  }

  @GetMapping("/{pageName}.master")
  public String pageMaster(@PathVariable String pageName, Model model) {
    model.addAttribute("pageName", pageName);
    System.out.println("뷰이름:" + pageName);
    return "masterLayout";
  }

  @GetMapping("/{pageName}.signup")
  public String signup(@PathVariable String pageName, Model model){
    model.addAttribute("pageName", pageName);
    System.out.println("뷰이름:" + pageName);
    return "storeRegist";
  }

  @GetMapping("/{pageName}.login")
  public String login(@RequestParam(value = "err", required = false) String err,
                      @PathVariable String pageName, Model model) {
    if(err != null) {
      model.addAttribute("msg", "아이디 비밀번호를 확인하세요");
    }
    model.addAttribute("pageName", pageName);
    System.out.println("로그인뷰이름:" + pageName);
    return "adminLogin";
  }

  @PostMapping("/loginForm")
  public String loginForm(@RequestBody Map<String, String> loginData) {
    String id = loginData.get("id");
    String pw = loginData.get("pw");

    System.out.println("입력" + id + pw);

    String result = adminStoreService.loginCheck(id, pw);
    System.out.println("아이디 "+ result);
    if(result != null){
      return "redirect:/admin.admin";
    } else {
      return "redirect:/adminlogin.login";
    }
  }



//  @PostMapping("/loginForm")
//  public String loginForm(@RequestParam String id, @RequestParam String pw,
//                          Authentication auth, HttpSession session) {
//    System.out.println("login-------------");
//
//    StoreRegistDTO storeRegistDTO = adminStoreService.getStoreId(id);
//    System.out.println("받아온 아이디: " + storeRegistDTO);
//
//    // 비밀번호 확인
//    if (storeRegistDTO == null || !isPasswordValid(pw, storeRegistDTO.getStorePw())) {
//      return "redirect:/adminLogin.login?err=true"; // 로그인 실패 시
//    }
//
//    // 세션에 사용자 아이디 저장
//    session.setAttribute("loggedInAdmin", storeRegistDTO);
//    return "redirect:/admin.adminLayout"; // 로그인 성공 시 리디렉션
//  }
//
//  // 비밀번호 검증 메소드 추가
//  private boolean isPasswordValid(String rawPassword, String encodedPassword) {
//    return passwordEncoder.matches(rawPassword, encodedPassword);
//  }

}
