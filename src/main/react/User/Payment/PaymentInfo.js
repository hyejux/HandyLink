import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import BasicMap from "./BasicMap"; // BasicMap import

function PaymentInfo() {
    const [showMap, setShowMap] = useState(false); // 맵 표시 상태

    const toggleMap = () => {
        setShowMap(!showMap); // 버튼 클릭 시 맵 토글
    };

    const requestPayment = () => {
        const { IMP } = window;
        if (!IMP) {
            console.error("IMP 객체가 정의되지 않았습니다. 아임포트 스크립트를 확인하세요.");
            return;
        }

        IMP.init("imp14516351"); // 아임포트에서 발급받은 가맹점 식별코드

        const data = {
            pg: "html5_inicis",
            pay_method: "card",
            merchant_uid: `mid_${new Date().getTime()}`,
            amount: 1000, // 결제 금액 (테스트 금액)
            name: "테스트 상품",
            buyer_email: "buyer@example.com",
            buyer_name: "테스트 구매자",
            buyer_tel: "010-1234-5678",
            buyer_addr: "구매자 주소",
            buyer_postcode: "우편번호",
            m_redirect_url: "https://yourdomain.com/redirect",
        };

        IMP.request_pay(data, function (response) {
            if (response.success) {
                console.log("결제 성공:", response);
                alert(`결제 성공! 결제 ID: ${response.imp_uid}`);
            } else {
                console.log("결제 실패:", response);
                alert(`결제 실패! 에러 코드: ${response.error_code}, 에러 메시지: ${response.error_msg}`);
            }
        });
    };

    // 가게의 위치 (예시)
    const storeLocation = {
        lat: 37.5709, // 가게의 위도
        lng: 126.9851, // 가게의 경도
    };

    return (
    <div>
    <h3>테스트 결제 페이지</h3>
    <button onClick={requestPayment}>테스트 결제하기</button>
    <button onClick={toggleMap}>
    {showMap ? "카카오맵 닫기" : "카카오맵 보기"}
    </button>
    {showMap && (
    <div style={{ marginTop: "20px" }}>
    <BasicMap storeLocation={storeLocation} /> {/* 맵 표시 */}
</div>
)}
</div>
);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PaymentInfo />);
