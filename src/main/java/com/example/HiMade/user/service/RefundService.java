package com.example.HiMade.user.service;

import com.example.HiMade.user.entity.Refund;
import com.example.HiMade.user.repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class RefundService {

    @Autowired
    private RefundRepository refundRepository;

    public void createRefund(Long paymentId, String refundMethod, Long refundAmount) {
        Refund refund = new Refund();
        refund.setPaymentId(paymentId);
        refund.setRefundMethod(refundMethod);
        refund.setRefundAmount(refundAmount);
        refund.setRefundDate(LocalDateTime.now());

        refundRepository.save(refund);
    }

    public String processRefund(Long paymentId, String refundMethod, Long refundAmount) {
        // Refund 기록을 먼저 생성합니다.
        createRefund(paymentId, refundMethod, refundAmount);

        // 이니시스 API를 사용하여 환불 요청을 처리합니다.
        String accessToken = getAccessToken(); // 엑세스 토큰을 가져오는 메서드 호출
        if (accessToken == null) {
            return "엑세스 토큰을 가져오는 데 실패했습니다.";
        }

        // 환불 API 호출을 위한 파라미터 설정
        Map<String, String> refundParams = new HashMap<>();
        refundParams.put("imp_uid", String.valueOf(paymentId)); // 결제 ID
        refundParams.put("amount", String.valueOf(refundAmount)); // 환불 금액

        // 환불 요청을 위한 RestTemplate 설정
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://api.iamport.kr/payments/refund";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken); // Bearer 토큰으로 설정

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(refundParams, headers);
        ResponseEntity<Map> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, Map.class);

        // 응답 처리
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            String success = (String) response.getBody().get("success");
            if ("true".equals(success)) {
                return "환불 요청이 성공적으로 처리되었습니다.";
            } else {
                return "환불 요청 실패: " + response.getBody().get("message");
            }
        } else {
            return "환불 요청 중 오류 발생";
        }
    }

    private String getAccessToken() {
        // 여기에 앞서 제공한 코드에서 엑세스 토큰을 가져오는 로직을 구현
        String restApiKey = "1428878563124318";
        String restApiSecret = "1aPAqQgEAkwYHOcNOXejmgyDQnmAXTjCwUejYGXvXghojulbOlDYsk7skoNNWta2B6tGiDq9ZbsMctU9";

        String auth = restApiKey + ":" + restApiSecret;
        String base64Auth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://api.iamport.kr/users/getToken"; // 엑세스 토큰 요청 URL

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + base64Auth);
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("imp_key", restApiKey);
        requestBody.put("imp_secret", restApiSecret);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        }

        return null; // 엑세스 토큰 발급 실패 시 null 반환
    }
}
