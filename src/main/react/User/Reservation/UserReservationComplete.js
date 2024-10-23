import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import './UserReservationComplete.css';


function UserReservationComplete() {



  //------------------------------------



  return (
    <div>

      <div class="user-main-content">

        <div class="user-content-container">
          <div>가게 이름</div>
          <div class="header">예약 완료</div>
          
          <div><a href='/UserMain.user'> 홈으로 가기 </a></div>
        </div>

        <div class="user-content-container">
          <div class="header">예약 정보</div>
          <div class="reservation-date">2024.10.3(목) 오후 2:30</div>
          <div class="reservation-info">
            <img src="../img1.jpg" alt="예약 이미지" />
            <div class="reservation-details">
              <div class="store-name">오늘도 케이크</div>
              <div class="menu">레터링 케이크</div>
              <div class="option">• 사이즈: 1호</div>
              <div class="option">• 디자인 옵션: 쇼핑몰추천</div>
              <div class="option">• 발송옵션: O</div>
            </div>
          </div>
          <div class="button-group">
            <button class="button btn-left">가게 정보</button>
            <button class="button btn-right">예약 상세</button>
          </div>
        </div>

        <div class="user-content-container">
          <div class="payment-info-top">
            <div class="payment-left">결제 정보</div>
            <div class="payment-right"><a href="#">결제 상세</a></div>
          </div>
          <div class="payment-info">
            <div class="info-row">
              <div class="left">결제 일시</div>
              <div class="right">2024/10/01 15:37:35</div>
            </div>
            <div class="info-row">
              <div class="left">결제수단</div>
              <div class="right">카카오페이</div>
            </div>
          </div>
          <div class="footer">
          </div>
        </div>


      </div>

    </div>
  )
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UserReservationComplete />
);



