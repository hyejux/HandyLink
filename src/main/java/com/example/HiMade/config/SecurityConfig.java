package com.example.HiMade.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.servlet.http.HttpSession;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/css/**", "/uploads/**", "/img/**", "/bundle/**").permitAll()
                .antMatchers("/UserMyPage.user").authenticated()
                .antMatchers("/**").permitAll()  // 모든 경로에 접근 허용 (임시 설정)
                //.anyRequest().authenticated()  // 그 외 요청은 로그인 필요
                .and()
                .formLogin()
                    .loginPage("/UserLoginPage.user")
                    .loginProcessingUrl("/user/login")
                    .usernameParameter("userId")
                    .passwordParameter("userPw")
                    .successHandler((request, response, authentication) -> {
                        // 로그인 성공 후 인증 정보 확인
                        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                        if (auth != null && auth.isAuthenticated()) {
                            System.out.println("로그인 성공: 사용자 = " + auth.getName());
                        } else {
                            System.out.println("로그인 실패: 인증되지 않은 사용자");
                        }
                        response.sendRedirect("/UserMyPage.user");
                    })
                    .defaultSuccessUrl("/UserMyPage.user", true)
                    .failureUrl("/UserLoginPage.user?error=true") // 로그인 실패 시 이동할 URL
                .and()
                .logout()
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/UserLoginPage.user")
                    .addLogoutHandler((request, response, authentication) -> {
                        HttpSession session = request.getSession(false);
                        if (session != null) {
                            System.out.println("세션 ID: " + session.getId() + " 가 무효화된다리");
                        }
                    })
                    .logoutSuccessHandler((request, response, authentication) -> {
                        System.out.println("로그아웃 성공: 사용자 = " + (authentication != null ? authentication.getName() : "Anonymous"));
                        response.sendRedirect("/UserLoginPage.user");
                    })
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                    .invalidSessionUrl("/UserLoginPage.user?sessionExpired=true")
                    .maximumSessions(1)
                    .maxSessionsPreventsLogin(true);

        return http.build();
    }

}
