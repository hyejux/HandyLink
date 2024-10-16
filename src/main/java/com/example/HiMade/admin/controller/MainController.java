package com.example.HiMade.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class MainController {

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
    model.addAttribute("id", id); // id를 모델에 추가
    System.out.println("뷰이름: " + pageName + ", ID: " + id);
    System.out.println("id ------------" + id);

    return "adminLayout"; // 반환할 뷰 이름
  }

  @GetMapping("/{pageName}.user/{id}")
  public String pageUser(@PathVariable String pageName, @PathVariable String id, Model model) {
    model.addAttribute("pageName", pageName);
    model.addAttribute("id", id); // id를 모델에 추가
    System.out.println("뷰이름: " + pageName + ", ID: " + id);
    System.out.println("id ------------" + id);

    return "userLayout"; // 반환할 뷰 이름
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
    System.out.println("뷰이름:" +pageName);

    return "storeRegist";
  }
}