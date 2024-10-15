import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import "./UserReservationDate.css";
import { test1 } from './ex';

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

const [cateId, setCateId] = useState(0);
useEffect(() => {
  const path = window.location.pathname;
  const pathSegments = path.split('/');
  const categoryId = pathSegments[pathSegments.length - 1];
  setCateId(categoryId);
}, []);





  const [date, setDate] = useState(new Date()); // 초기 날짜 설정
 const [dateTime, setDateTime] = useState([]); // useState로 상태를 초기화합니다.

    const handleDateChange = (newDate) => {
        setDate(newDate);
  const adjustedDate = addHours(newDate, 9);
    const formattedDate = format(adjustedDate, 'yyyy-MM-dd');
      console.log(formattedDate);
        // axios로 API 호출
        axios.post('/userReservation/getDateTime', { reservationSlotDate: formattedDate })
            .then(response => {
            setDateTime(response.data);
                console.log('API 호출 성공:', response.data);
            })
            .catch(error => {
                console.error('API 호출 실패:', error);
            });
    };

    const generateTimeSlots = (startTime, endTime) => {
      const slots = [];
      const start = new Date(`1970-01-01T${startTime}`); // 임의의 날짜 사용
      const end = new Date(`1970-01-01T${endTime}`);

      while (start <= end) {
          slots.push(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          start.setMinutes(start.getMinutes() + 30); // 30분 추가
      }

      return slots;
  };

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots('15:00:00', '20:00:00');

  const [selectSlot, setSelectSlot] = useState('00:00');

    // 버튼 클릭 시 시간 출력 함수
    const handleSlotClick = (slot) => {
      console.log(`Selected time slot: ${slot}`);
      setSelectSlot(slot);
  };


  const goToAdminPage = (id) => {
    test1('sdfsdfsdfsdf')
    window.location.href = `/userStoreDetailService.user`;
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
          <button type="button" onClick={() => goToAdminPage()}>홈</button>
          <button type="button">정보</button>
          <button type="button">예약</button>
          <button type="button">리뷰</button>
        </div>

        {/* <div className="user-reserve-menu-img">
          <img src="../img1.jpg" alt="메뉴 이미지 1" />
          <img src="../img1.jpg" alt="메뉴 이미지 2" />
          <img src="../img1.jpg" alt="메뉴 이미지 3" />
          <img src="../img1.jpg" alt="메뉴 이미지 4" />
        </div> */}


        <div className="user-content-container">
          <div className="user-reserve-date-title">예약일</div>
          <div className="user-reserve-data">
            <div><i className="bi bi-calendar-check-fill"></i>{date.toLocaleDateString()}</div>
            <div><i className="bi bi-clock-fill"></i>{selectSlot}</div>
          </div>
          <div className="user-reserve-date-calender">
                    <div>
                       <Calendar
                         onChange={handleDateChange} // 날짜 변경 핸들러
                         value={date} // 선택된 날짜
                       />

                     </div>
          </div>
                  {dateTime.map(slot => (
            <div key={slot.key}>
                <button type="button">
                    <div> 해당 날짜 예약 상태 : ( {slot.slotStatusCount} / {slot.slotCount} ) </div>
                </button>

                <div className="user-reserve-date-time">
                    {timeSlots.map((slots, index) => (
                        slot.slotStatusCount !== slot.slotCount ? ( // 두 값이 같지 않을 때만 버튼 표시
                            <button 
                                key={index}
                                type="button" 
                                onClick={() => handleSlotClick(slots)} 
                            >
                                {slots} {/* 슬롯 시간 표시 */}
                            </button>
                        ) : (
                            <div key={index} style={{ display: 'none' }} /> // 두 값이 같으면 빈 div로 숨김
                        )
                    ))}
                </div>
            </div>
        ))}

         



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




