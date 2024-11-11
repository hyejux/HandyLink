package com.example.HiMade.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    public SecurityConfig(CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomAuthenticationProvider customAuthenticationProvider) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                // 로그인 없이 접근 가능한 페이지
                .antMatchers("/userMain.user", "/userSearch.user", "/userStoreDetail.user/**").permitAll()

                // 로그인 필수 페이지
                .antMatchers("/userMyReservationList.user", "/userChatList.user", "/userAccountPage.user").authenticated()
                .antMatchers("/userlikelist.user").authenticated()

                // 정적 리소스는 로그인 없이 접근 허용
                .antMatchers("/css/**", "/uploads/**", "/img/**", "/bundle/**").permitAll()

                // 나머지 경로 설정
                .anyRequest().permitAll() // 추가적인 경로 필요 시 설정

                .and()
                .formLogin()
                .loginPage("/UserLoginPage.user")
                .permitAll()
                .loginProcessingUrl("/login")
                .usernameParameter("userId")
                .passwordParameter("userPw")
                .defaultSuccessUrl("/UserMain.user", true)
                .failureUrl("/UserLoginPage.user?error=true")

                .and()
                .logout()
                .logoutUrl("/logout")
                .permitAll()
                .logoutSuccessUrl("/UserLoginPage.user")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")

                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)

                .and()
                .exceptionHandling()
                .authenticationEntryPoint(customAuthenticationEntryPoint)

                .and()
                .authenticationProvider(customAuthenticationProvider);

        return http.build();
    }
}
