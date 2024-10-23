import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';
import './UserMyReservationDetail.css';



function UserMyReservationDetail() {
  const [cateId, setCateId] = useState(0);
  const [reservationList, setReservationList] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const categoryId = pathSegments[pathSegments.length - 1];
    setCateId(categoryId);
    axios.get(`/userMyReservation/getMyReservationDetail/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setReservationList(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });

    // 결제 정보 가져옴
    axios.get(`/userPaymentInfo/getPaymentInfo/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setPaymentInfo(response.data);
      })
      .catch(error => {
        console.log('Error fetching payment info', error);
      });
  }, []);


  const [category, setCategory] = useState({
    categoryLevel: 0,
    parentCategoryLevel: 0,
    serviceName: '',
    servicePrice: 0,
    serviceContent: ''
  });

  // 결제 일시 포맷 (년/월/일 시:분:초)
  const formatDate = (dateString) => {
    const [date, time] = dateString.split('T');
    const formattedDate = date.replace(/-/g, '.'); // '-'을 '/'로 변경
    return `${formattedDate} ${time.substring(0, 8)}`; // 'YYYY/MM/DD HH:MM:SS' 형식으로 반환
  };


  // 예약 취소 버튼 클릭 시 결제 상태 업데이트
  const cancelReservation = async () => {
    try {
      const response = await axios.post(`/userPaymentCancel/updatePaymentStatus/${cateId}`, { paymentStatus: "N" });
      console.log("예약 취소 성공:", response.data);
      alert("예약이 취소되었습니다.");

      // 페이지를 새로 고침하거나 다른 작업 수행
      window.location.reload();
    } catch (error) {
      console.error("예약 취소 중 오류 발생:", error);
      alert("예약 취소에 실패했습니다. 다시 시도해주세요.");
    }
  };



  return (
    <div>

      <h1> 예약 정보 (가게이름이나 주문일시, 상태 등등) </h1>
      <button type="button" > 예약 취소 </button>
      <hr />
      <h1> 예약자 정보 </h1>

      <hr />
      <h1> 주문내역 </h1>

      {reservationList.map((item, index) => {
        // 현재 항목의 대분류가 이전 항목과 다른 경우만 출력
        const isFirstInGroup = index === 0 || reservationList[index - 1].mainCategoryName !== item.mainCategoryName;

        // 현재 항목의 중분류가 이전 항목과 다른 경우만 출력
        const isMiddleCategoryDifferent = index === 0 || reservationList[index - 1].middleCategoryName !== item.middleCategoryName;
        return (
          <div key={index} style={{ marginBottom: '20px' }}>
            {/* 대분류 출력 */}
            {isFirstInGroup && <h2>{item.mainCategoryName} (+{item.mainPrice}원)</h2>}

            {/* 중분류 출력 */}
            {isMiddleCategoryDifferent && <h3>{item.middleCategoryName}</h3>}

            {/* middleCategoryValue가 있다면 출력 */}
            {item.middleCategoryValue ? (
              <span>{item.middleCategoryValue} (+{item.middlePrice}원)</span>
            ) : (
              // 없다면 subCategoryName 출력
              <span>{item.subCategoryName} (+{item.subPrice} 원)</span>
            )}
          </div>
        );
      })}
      <h1> 총액 </h1>

      <hr />
      <h1> 요청사항 </h1>

      <hr />

      {/* 결제 정보 */}
      <div className="user-payment-info-container">
        <div className="payment-info-top">
          <div className="payment-left">결제 정보</div>
          <div className="payment-right">
            <a href="#" onClick={() => window.location.href = `/paymentInfo.user/${cateId}`}>
              결제 상세
            </a>
          </div>

        </div>
        <div className="payment-info">
          {paymentInfo.length > 0 ? (
            paymentInfo.map((payment, index) => (
              <div key={index} className="info-row">
                <div className="left">결제 일시</div>
                <div className="right">{formatDate(payment.paymentDate)}</div>
              </div>
            ))
          ) : (
            <div className="info-row">
              <div className="left">결제 정보가 없습니다.</div>
            </div>
          )}
          {paymentInfo.length > 0 && paymentInfo.map((payment, index) => (
            <div key={index}>
              <div className="info-row">
                <div className="left">결제수단</div>
                <div className="right">{payment.paymentMethod}</div>
              </div>
              <div className="info-row">
                <div className="left">결제 금액</div>
                <div className="right">{payment.paymentAmount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="user-payment-info-container">
        <button onClick={cancelReservation}>예약취소</button>
      </div>





      <hr />

      <hr />

      <h1> 주의사항 </h1>

      <hr />

      <h1> 환불규정 </h1>

      <hr />




    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserMyReservationDetail />
);