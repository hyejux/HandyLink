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
                    .loginProcessingUrl("/login")
                    .usernameParameter("userId")
                    .passwordParameter("userPw")
                    .defaultSuccessUrl("/UserMyPage.user", true)
                    .failureUrl("/UserLoginPage.user?error=true") // 로그인 실패 시 이동할 URL
                .and()
                .logout()
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/UserLoginPage.user")
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID");
        return http.build();
    }

}
