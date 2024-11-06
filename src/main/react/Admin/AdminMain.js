import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import './AdminMain.css';

function AdminMain() {
  const storeId = sessionStorage.getItem('storeId');
  const storeNo = sessionStorage.getItem('storeNo');

  const events = [
    { title: '예약 1', date: '2024-11-10' },
    { title: '예약 23', date: '2024-11-10' },
    { title: '예약 2', date: '2024-11-15' },
  ]; //달력게 띄울 예약 건

  const [count, setCount] = useState({}); //운영현황
  const [selectedDate, setSelectedDate] = useState(''); //검색할 날짜 받기
  const [reservationNo, setReservationNo] = useState([]); //해당날짜 예약번호



  useEffect(()=>{
    const fetchCount = async() => {
      const resp = await axios.get(`/adminStore/getMainCount?storeNo=${storeNo}`);
      setCount(resp.data);
    };

    fetchCount();
  },[]);

  //날짜 받기
  const handleChangeDate = (e) => {
    const {value} = e.target;
    setSelectedDate(value);
  };

  useEffect(()=>{
    console.log("날짜 ", selectedDate);
  },[selectedDate]);

  const handleClickBook = async() => {
    const reservationSlotDate = selectedDate;
    try {
      const resp = await axios.get(`/adminStore/getReservationNo?storeNo=${storeNo}&reservationSlotDate=${reservationSlotDate}`);
      const reservationNo = resp.data;
      setReservationNo(reservationNo);

      const response = await axios.get(`/adminStore/getTodayCustomer?$reservationNo=${reservationNo}`);
      console.log(response.data);

    }catch (error){
      console.error("해당날짜 예약정보 부르는 중 error ", error);
    }
  };

  return(
  <div className="admin-store-regist-container">
    <div className="container">
      <div className="operation-status">
        <h3><i className="bi bi-bar-chart-line-fill"></i>운영 현황</h3>
        <div className="status-container">
          <div className="status-item">
            <p>{count.waitCount}</p> <p className="new">New</p>
          </div>
          <div className="status-item">
            <p>{count.cancledCount}</p> <p className="cancle">예약취소</p>
          </div>
          <div className="status-item">
            <p>5</p> <p className="chat">채팅문의</p>
          </div>
        </div>
      </div>

      <div className="operation-status">
        <div className="calendar">
          <div className="calendar-header">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="ko" // 한글로 설정
              events={events}
              dayCellContent={(arg) => (
                <div style={{ padding: '10px' }}>
                  <span>{arg.dayNumberText}</span>
                </div>
              )}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="auto" // 여유 공간을 위한 높이 조정
              contentHeight="auto"
            />
          </div>
        </div>
      </div>

      <div className="operation-status today-customer">
        <div className="customer-reservation-check">
          <div className="today-booking2">
            <h3><i className="bi bi-shop-window"></i>Today 예약</h3>
            <div className="date-search-box">
              <input type="date" value={selectedDate} onChange={handleChangeDate}/>
              <button type="button" className="btn today" onClick={handleClickBook}>예약보기</button>
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
                  <div>  <input type="text" value="박민수" disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>연락처</label>
                  <div> <input type="text" value="010-2252-6598" disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>방문시간</label>
                  <div> <input type="text" value="13:00" disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>결제방식</label>
                  <div> <input type="text" value="계좌이체" disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>결제금액</label>
                  <div> <input type="text" value="32,000원" disabled/> </div>
                </div>
              </div>

              <div className="customer-reservation">
                <div className="reservation-content">
                  <label>상품명</label>
                  <div> <input type="text" value="의자" disabled/> </div>
                </div>
                <div className="reservation-content">
                  <label>옵션</label>
                  <div className="reservation-option">
                    <div className="option">
                      <p>색상</p> <input type="text" value="애쉬" disabled/>
                    </div>
                    <div className="option">
                      <p>사이즈</p> <input type="text" value="M" disabled/>
                    </div>
  <div className="option">
  <p>색상</p> <input type="text" value="애쉬" disabled/>
  </div>
  <div className="option">
  <p>사이즈</p> <input type="text" value="M" disabled/>
  </div>

                  </div>
                </div>
                <div className="reservation-content">
                  <label>요청사항</label>
                  <div> <input type="text" value="모서리 둥글게 해주세요." disabled/> </div>
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