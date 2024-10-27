import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';
import './userMyReservationList.css';


function UserMyReservationList() {


    const [reservationList, setReservationList] = useState([]);

       useEffect(() => {
            axios.get('/userMyReservation/getMyReserveList')
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

    const goToUserPage = (id) => {
       window.location.href = `../UserMyReservationDetail.user/${id}`;
      };

      const goToReview = (id) => {
        window.location.href = `../UserReviewRegist.user/${id}`;
       };

  return (
    <div>
           <div className="user-main-content" >

           <div className="user-top-nav">
           {/* <i className="bi bi-arrow-left"></i> */}
        <logo className="logo"> 내 예약 내역 (아이디 고정값으로 뿌리는 중) </logo>
      
      </div>


           {reservationList.map((value, index) => (
            <div className="user-content-container"  key={index} onClick={()=>{goToUserPage(value.reservationNo)}}>
              <div className="reservation-header">
                <span className="reservation-status">{value.reservationStatus}</span>
                <div className="reservation-time">{value.regTime} </div>
                <button onClick={(event) => {
          event.stopPropagation(); // 클릭 이벤트의 버블링 방지
          goToReview(value.reservationNo); // 리뷰 작성 함수 호출
        }}> 리뷰 작성하기 </button>
              </div>
              <div className="store-name-title">{value.storeName} <i class="bi bi-chevron-right"></i> </div>
              <div className="product-details">{value.serviceName} | {value.reservationPrice} 원</div>

              <div className="reservation-info">

                <div className="reservation-info-box">
                    <div className="date">
                    <i className="bi bi-calendar-check-fill"></i>
                    <span>{value.reservationSlotDate} </span>
                    </div>
                <div className="time">
                <i className="bi bi-clock-fill"></i>
                    <span>{value.reservationTime}</span>
                    </div>
                </div>
                
                </div>
               </div>
  ))}


                </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserMyReservationList />
);