import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import "./UserReservationDate.css";


function UserReservationDate() {
//  const [date, setDate] = useState(new Date()); // 초기 날짜 설정
//
//  const handleDateChange = (newDate) => {
//    setDate(newDate); // 날짜 변경 시 상태 업데이트
//  };
//  // 시간 선택 처리 함수
//  const handleTimeSelect = (time) => {
//    setSelectedTime(time);
//  };



  const [date, setDate] = useState(new Date()); // 초기 날짜 설정
 const [dateTime, setDateTime] = useState([]); // useState로 상태를 초기화합니다.

    const handleDateChange = (newDate) => {
        setDate(newDate);
  const adjustedDate = addHours(newDate, 9);
    const formattedDate = format(adjustedDate, 'yyyy-MM-dd');
      console.log(formattedDate);
        // axios로 API 호출
        axios.post('/userReservation/getDateTime', { date: formattedDate })
            .then(response => {
            setDateTime(response.data);
                console.log('API 호출 성공:', response.data);
            })
            .catch(error => {
                console.error('API 호출 실패:', error);
            });
    };




 return (
    <div className="user-main-container">
      <div className="user-top-nav">
        <div className="user-top-btns">
          <button type="button"> &lt; </button>
          <div className="logo">HandyLink</div>
          <button type="button"> &gt; </button>
        </div>
      </div>

      <div className="user-main-content">
        <div className="user-content-first">
          <div className="user-content-first-img">
            {/* 이미지 부분에 필요한 경우 src 설정 */}
            {/* <img src="../img3.jpg" alt="가게 이미지" width="100%" height="300px" /> */}
          </div>
          <div className="user-content-first-img-num">

          </div>

          <div className="user-content-first-content">
            <div className="store-name">
              <div>팬케이크샵 가로수길점</div>
              <button type="button"><i className="bi bi-star"></i></button>
            </div>
            <div><i className="bi bi-shop"></i> 서울 강남구 강남대로162길 21 1층 </div>
            <hr />
            <div><i className="bi bi-alarm-fill"></i> 09:00 ~ 21:00 </div>
            <div><i className="bi bi-telephone-fill"></i> 070 - 1236 -7897</div>
          </div>
        </div>

        <div className="store-detail-menu">
          <button type="button">홈</button>
          <button type="button">정보</button>
          <button type="button">예약</button>
          <button type="button">리뷰</button>
        </div>

        <div className="user-reserve-menu-img">
          <img src="../img1.jpg" alt="메뉴 이미지 1" />
          <img src="../img1.jpg" alt="메뉴 이미지 2" />
          <img src="../img1.jpg" alt="메뉴 이미지 3" />
          <img src="../img1.jpg" alt="메뉴 이미지 4" />
        </div>

        <div className="user-content-container">
          <div className="user-reserve-date-title">예약일</div>
          <div className="user-reserve-data">
            <div><i className="bi bi-calendar-check-fill"></i>{date.toLocaleDateString()}</div>
            <div><i className="bi bi-clock-fill"></i>오후 02:30</div>
          </div>
          <div className="user-reserve-date-calender">
                    <div>
                       <Calendar
                         onChange={handleDateChange} // 날짜 변경 핸들러
                         value={date} // 선택된 날짜
                       />

                     </div>
          </div>

          <div className="user-reserve-date-time">
            {dateTime.map(slot => (
                              <div key={slot.key}>
                                      <button type="button" > {slot.time}   <div> ( {slot.slotStatus} / {slot.slotCount} ) </div>  </button>

                              </div>
                          ))}


          </div>
        </div>

        <div className="user-content-last">
          <button type="button">다음 <i className="bi bi-chevron-right"></i></button>
        </div>
      </div>


      <div className="user-bottom-nav">
        <a href="#"><span>메인</span></a>
        <a href="#"><span>검색</span></a>
        <a href="#"><span>예약</span></a>
        <a href="#"><span>문의</span></a>
        <a href="#"><span>MY</span></a>
      </div>
    </div>
  );
};

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <UserReservationDate />
);




