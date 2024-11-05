import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminMain.css';


function AdminMain() {

  return(
  <div className="admin-store-regist-container">
  <div className="container">
  <div className="operation-status">
  <h3><i className="bi bi-bar-chart-line-fill"></i>운영 현황</h3>
  <div className="status-container">
  <div className="status-item">
  <p>3</p> <p className="new">New</p>
  </div>
  <div className="status-item">
  <p>1</p> <p className="cancle">예약취소</p>
  </div>
  <div className="status-item">
  <p>5</p> <p className="chat">채팅문의</p>
  </div>
  </div>
  </div>

  <div className="operation-status">
  <div className="header">
  <div className="calendar">
  <div className="calendar-header">
  캘린더 자리
  </div>

  </div>

  <div className="today-bookings">
  <h3><i className="bi bi-shop-window"></i>Today 예약</h3>
  <div className="date-search-box">
  <input type="date" />
  <button type="button" className="btn today">예약보기</button>
  </div>


  <div className="table-wrapper">
  <table>
  <thead>
  <tr>
  <th>이름</th>
  <th>예약시간</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>김철수</td>
  <td>12:00</td>
  </tr>
  <tr>
  <td>이영희</td>
  <td>12:30</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  </tr>

  </tbody>
  </table>
  </div>
  </div>
  </div>
  </div>

  <div className="operation-status today-customer">
  <div className="customer-reservation-check">
  <div className="today-bookings2">
  <h3><i className="bi bi-shop-window"></i>Today 예약</h3>
  <div className="date-search-box">
  <input type="date" />
  <button type="button" className="btn today">예약보기</button>
  </div>

  <div className="table-wrapper2">
  <table>
  <thead>
  <tr>
  <th>이름</th>
  <th>예약시간</th>
  <th>보기</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>김철수</td>
  <td>12:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>이영희</td>
  <td>12:30</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  <tr>
  <td>박민수</td>
  <td>13:00</td>
  <td><input type="radio"/></td>
  </tr>
  </tbody>
  </table>
  </div>
  </div>
  <div className="customer-info-container">
  <h3>예약 정보</h3>
  <div className="customer-info">
  <div className="customer-detail">
  <div className="customer-group">
  <label>예약자</label>
  <div>
  <input type="text" value="박민수" disabled/>
  </div>
  </div>
  <div className="customer-group">
  <label>연락처</label>
  <div>
  <input type="text" value="010-2252-6598" disabled/>
  </div>
  </div>
  <div className="customer-group">
  <label>방문시간</label>
  <div>
  <input type="text" value="13:00" disabled/>
  </div>
  </div>
  <div className="customer-group">
  <label>결제방식</label>
  <div>
  <input type="text" value="계좌이체" disabled/>
  </div>
  </div>
  <div className="customer-group">
  <label>결제금액</label>
  <div>
  <input type="text" value="32,000원" disabled/>
  </div>
  </div>
  </div>

  <div className="customer-reservation">
  <div className="reservation-content">
  <label>상품명</label>
  <div>
  <input type="text" value="의자" disabled/>
  </div>
  </div>
  <div className="reservation-content">
  <label>옵션</label>
  <div className="reservation-option">
  <div className="option">
  <p>색상</p>
  <input type="text" value="애쉬" disabled/>
  </div>
  <div className="option">
  <p>사이즈</p>
  <input type="text" value="M" disabled/>
  </div>
  </div>
  </div>
  <div className="reservation-content">
  <label>요청사항</label>
  <div>
  <input type="text" value="모서리 둥글게 해주세요." disabled/>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>

  </div>
  </div>

  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminMain />
);