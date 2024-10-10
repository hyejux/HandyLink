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

    return "adminSignUp";
  }
}