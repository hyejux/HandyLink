import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';
import './userMyReservationList.css';


function UserMyReservationList() {


  const [reservationList, setReservationList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [reviewBtn, setReviewBtn] = useState(false);

  useEffect(() => {
    // Fetch user profile and then fetch reservations
    axios.get(`/user/profile`)
      .then(response => {
        console.log(response.data);
        setUserInfo(response.data);
        const extractedUserId = response.data.userId; // Extract userId here

        // Now make the second API call for reservations
        return axios.post('/userMyReservation/getMyReserveList', { userId: extractedUserId });
      })
      .then(response => {
        console.log(response.data);
        setReservationList(response.data);
      })
      .catch(error => {
        console.log("Error occurred:", error);
      });



  }, []);


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
      <div className="user-main-content my-reservation-list" >

        <div className="user-top-nav">
          {/* <i className="bi bi-arrow-left"></i> */}
          <logo className="logo"> 내 예약 내역 (아이디 고정값으로 뿌리는 중) </logo>

        </div>


        {reservationList.map((value, index) => (
          <div className="user-content-container" key={index} onClick={() => { goToUserPage(value.reservationNo) }}>
            <div className="reservation-header">
              <span className="reservation-status">{value.reservationStatus}</span>
              <div className="reservation-time">{value.regTime} </div>


              {value.reviewCount === 0 && value.reservationStatus === '확정' && (
                <button
                  onClick={(event) => {
                    event.stopPropagation(); // Prevents event bubbling
                    goToReview(value.reservationNo); // Call the function to navigate to the review page
                  }}
                >
                  리뷰 작성하기
                </button>
              )}


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