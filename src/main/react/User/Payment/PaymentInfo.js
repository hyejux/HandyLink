import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import BasicMap from "./BasicMap";
import axios from "axios";
import './PaymentInfo.css';

function PaymentInfo() {
    const [showMap, setShowMap] = useState(false); // 맵 표시 상태
    const [paymentInfo, setPaymentInfo] = useState([]); // 결제 정보 상태
    const [reservationList, setReservationList] = useState([]); // 예약 목록 상태
    const [reservationNo, setReservationNo] = useState(""); // 예약 번호 상태

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
            m_redirect_url: window.location.href,
        };

        IMP.request_pay(data, function (response) {
            if (response.success) {
                console.log("결제 성공:", response);
                alert(`결제 성공! 결제 ID: ${response.imp_uid}`);
                fetchPaymentInfo(); // 결제 성공 후 결제 정보 조회
            } else {
                console.log("결제 실패:", response);
                alert(`결제 실패! 에러 코드: ${response.error_code}, 에러 메시지: ${response.error_msg}`);
            }
        });
    };

    const storeLocation = {
        lat: 37.5709, // 가게의 위도
        lng: 126.9851, // 가게의 경도
    };

    useEffect(() => {
        if (showMap) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("위치 정보 허용됨:", position);
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("위치 정보 거부됨:", error);
                    alert("위치 정보를 허용해주세요.");
                }
            );
        }
    }, [showMap]);

    // URL에서 reservationNo 가져오기 및 결제 정보 및 예약 세부정보 가져오기
    useEffect(() => {
        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const reservationId = pathSegments[pathSegments.length - 1]; // 마지막 부분이 reservationId
        setReservationNo(reservationId); // 예약 번호 설정

        // 예약 세부정보 및 결제 정보 가져오기
        const fetchReservationAndPayments = async () => {
            try {
                const reservationResponse = await axios.get(`/userMyReservation/getMyReservationDetail/${reservationId}`);
                console.log(reservationResponse.data);
                setReservationList(reservationResponse.data); // 예약 목록 설정

                const paymentResponse = await axios.get(`/userPaymentInfo/getPaymentInfo/${reservationId}`);
                console.log(paymentResponse.data);
                setPaymentInfo(paymentResponse.data); // 결제 정보 상태 설정
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchReservationAndPayments();
    }, []); // 컴포넌트가 마운트될 때 한 번만 실행됩니다.



    // 결제 일시 포맷 (년/월/일 시:분:초)
    const formatDate1 = (dateString) => {
        const [date, time] = dateString.split('T');
        const formattedDate = date.replace(/-/g, '.'); // '-'을 '/'로 변경
        return `${formattedDate} ${time.substring(0, 8)}`; // 'YYYY/MM/DD HH:MM:SS' 형식으로 반환
    };


    // 결제 일시 포맷 (년/월/일만 표시)
    const formatDate2 = (dateString) => {
        return dateString.split('T')[0].split('-').join('.'); // 'YYYY/MM/DD' 형식으로 반환
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



            <div className="user-content-container">
                {paymentInfo.length > 0 && paymentInfo[0].paymentDate && (
                    <div className="header">
                        {formatDate2(paymentInfo[0].paymentDate)}
                    </div>
                )}
            </div>

            <div className="user-content-container">
                <div className="header">예약 정보</div>
                <div className="reservation-date">2024.10.3(목) 오후 2:30</div>
                <div className="reservation-info">
                    <img src="../img/cake001.jpg" alt="예약 이미지" />
                    <div className="reservation-details">
                        <div className="store-name">오늘도 케이크</div>


                        {/* 대분류와 중분류 출력 */}
                        {reservationList.map((item, resIndex) => {
                            const isFirstInGroup = resIndex === 0 || reservationList[resIndex - 1].mainCategoryName !== item.mainCategoryName;

                            return (
                                <div key={resIndex}>
                                    {isFirstInGroup && (
                                        <div className="menu">{item.mainCategoryName}</div>
                                    )}
                                    {item.middleCategoryValue ? (
                                        <div className="option">
                                            <span><i className="bi bi-dot"></i>  {item.middleCategoryName}</span>
                                            <span>({item.middleCategoryValue}개)  {/*(+{item.middlePrice}원)*/}</span>
                                        </div>
                                    ) : (
                                        <div className="option">
                                            <span><i className="bi bi-dot"></i>  {item.subCategoryName}</span>
                                            {/* <span>(+{item.subPrice}원)</span> */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
                <div className="button-group">
                    <button className="button btn-left">가게 정보</button>
                    <button className="button btn-right" onClick={() => window.location.href = `/UserMyReservationDetail.user/${reservationNo}`}>
                        예약 상세
                    </button>
                </div>
            </div>

            <div className="user-content-container">
                <div className="header">결제 정보</div>
                <div className="payment-info">
                    {paymentInfo.length > 0 ? (
                        paymentInfo.map((payment, index) => (
                            <div key={index}>
                                <div className="info-row">
                                    <div className="left">결제 일시</div>
                                    <div className="right">{formatDate1(payment.paymentDate)}</div>
                                </div>
                                <div className="info-row">
                                    <div className="left">결제 수단</div>
                                    <div className="right">{payment.paymentMethod}</div>
                                </div>
                                <div className="info-row">
                                    <div className="left">결제 금액</div>
                                    <div className="right">{payment.paymentAmount}</div>
                                </div>

                                {/* 대분류와 중분류 출력 */}
                                {reservationList.map((item, resIndex) => {
                                    const isFirstInGroup = resIndex === 0 || reservationList[resIndex - 1].mainCategoryName !== item.mainCategoryName;
                                    const isMiddleCategoryDifferent = resIndex === 0 || reservationList[resIndex - 1].middleCategoryName !== item.middleCategoryName;

                                    return (
                                        <div key={resIndex}>
                                            {isFirstInGroup && (
                                                <div className="info-row">
                                                    <div className="left"><i className="bi bi-dot"></i> {item.mainCategoryName}</div>
                                                    <div className="right">(+{item.mainPrice}원)</div>
                                                </div>
                                            )}
                                            {isMiddleCategoryDifferent &&
                                                null
                                            }
                                            {item.middleCategoryValue ? (
                                                <div className="info-row info-row2">
                                                    <div className="left"><i className="bi bi-dash"></i> {item.middleCategoryName}</div>
                                                    <div className="right">{item.middleCategoryValue + '개'} (+{item.middlePrice}원)</div>
                                                </div>
                                            ) : (
                                                <div className="info-row info-row2">
                                                    <div className="left"><i className="bi bi-dash"></i> {item.subCategoryName}</div>
                                                    <div className="right">(+{item.subPrice}원)</div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="info-row">
                            <div className="left">결제 정보가 없습니다.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PaymentInfo />);
