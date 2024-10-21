import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';



function UserMyReservationDetail() {
  const [cateId, setCateId] = useState(0);
    const [reservationList, setReservationList] = useState([]);

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
        }, [])

  const [category, setCategory] = useState({
    categoryLevel: 0,
    parentCategoryLevel: 0,
    serviceName: '',
    servicePrice: 0,
    serviceContent: ''
  });
  return (
    <div>

<h1> 예약 정보 (가게이름이나 주문일시, 상태 등등) </h1>
 <button type="button" > 예약 취소 </button>
   <hr/>
<h1> 예약자 정보 </h1>

   <hr/>
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

   <hr/>
   <h1> 요청사항 </h1>

      <hr/>

   <h1> 결제 정보 </h1>

      <hr/>

<h1> 주의사항 </h1>

   <hr/>

<h1> 환불규정 </h1>

   <hr/>




    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserMyReservationDetail />
);