import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import BasicMap from "./BasicMap";
import axios from "axios";

function PaymentInfo() {
    const [showMap, setShowMap] = useState(false); // 맵 표시 상태
    const [payments, setPayments] = useState([]); // 결제 정보 상태

    // 인서트용 상태
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [reservationNo, setReservationNo] = useState("");

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
                fetchPayments(); // 결제 성공 후 결제 정보 조회
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


    // 결제 정보를 가져옴
    const fetchPayments = async () => {
        try {
            const response = await axios.get("/payment");
            setPayments(response.data);
        } catch (error) {
            console.error("결제 정보를 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);


    // 결제 정보 인서트 
    const insertPayment = async () => {
        try {
            const response = await axios.post("/payment", {
                paymentMethod,
                paymentAmount,
                paymentStatus,
                reservationNo,
            });
            alert(`결제 정보가 추가되었습니다: ${response.data.paymentId}`);
            fetchPayments();
        } catch (error) {
            console.error("결제 정보를 추가하는 중 오류 발생:", error);
            alert("결제 정보 추가 실패");
        }
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
                    <BasicMap storeLocation={storeLocation} />
                </div>
            )}

            <h3>셀렉트 테스트</h3>
            <ul>
                {payments.map((payment) => (
                    <li key={payment.paymentId} style={{ marginBottom: '10px' }}>
                        결제 ID: {payment.paymentId} <br />
                        결제 방법: {payment.paymentMethod} <br />
                        금액: {payment.paymentAmount} 원 <br />
                        결제일시: {new Date(payment.paymentDate).toLocaleString()} <br />
                        상태: {payment.paymentStatus} <br />
                        예약번호: {payment.reservationNo} <br />
                    </li>
                ))}
            </ul>

            <h3>인서트 테스트</h3>
            <div>
                <input
                    type="text"
                    placeholder="결제 방법"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="금액"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="상태"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="예약번호"
                    value={reservationNo}
                    onChange={(e) => setReservationNo(Number(e.target.value))}
                />
                <button onClick={insertPayment}>결제 정보 추가</button>
            </div>


        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PaymentInfo />);
