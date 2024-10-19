package com.example.HiMade.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    // 정적 리소스 무시 설정
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().antMatchers("/css/**", "/uploads/**", "/img/**", "/bundle/**");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
//                .antMatchers("/UserSignUp.user","/UserLoginPage.user", "/UserSignUpFinish.user", "/userMain.user").permitAll()  // 로그인 없이도 접근 허용
//                .antMatchers("/user/signup", "/user/login", "/user/checkId").permitAll()

                .antMatchers("/**").permitAll()  // 모든 경로에 접근 허용 (임시 설정)
//                .anyRequest().authenticated()  // 그 외 요청은 로그인 필요
                .and()
                .formLogin()
                .loginPage("/UserLoginPage.user")  // 커스텀 로그인 페이지 경로
                .loginProcessingUrl("/user/login")  // 로그인 처리 경로
                .usernameParameter("userId")
                .passwordParameter("userPw")
                .defaultSuccessUrl("/UserMyPage.user", true)
                .failureUrl("/UserLoginPage.user?error=true")
                .and()
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/UserLoginPage.user")
                .invalidateHttpSession(true) // 세션 무효화
                .deleteCookies("JSESSIONID") // 로그아웃 시 쿠키 삭제
                .and()
                .sessionManagement() // 세션 관리 설정
                .invalidSessionUrl("/UserLoginPage.user?sessionExpired=true") // 세션 만료 시 이동할 페이지
                .maximumSessions(1) // 한 명의 사용자당 하나의 세션만 허용
                .maxSessionsPreventsLogin(true); // 중복 로그인 방지 (기존 세션 만료 방지)

        return http.build();
    }

}
