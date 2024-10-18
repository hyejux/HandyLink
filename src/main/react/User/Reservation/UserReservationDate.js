import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { format, addHours } from 'date-fns';
import "./UserReservationDate.css";

function UserReservationDate() {
  const [cateId, setCateId] = useState(0);

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const categoryId = pathSegments[pathSegments.length - 1];
    setCateId(categoryId);
  }, []);

  const [date, setDate] = useState(new Date());
  const [dateTime, setDateTime] = useState([]);

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
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    while (start <= end) {
      slots.push(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      start.setMinutes(start.getMinutes() + 30); // 30분 추가
    }
    return slots;
  };

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots('15:00:00', '20:00:00');

  // 선택된 슬롯의 인덱스를 저장
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotClick = (index) => {
    setSelectedSlot(index === selectedSlot ? null : index);  // 슬롯 선택/해제
  };

  const [selectSlot2, setSelectSlot2] = useState('00:00');

  const handleSlotClick2 = (slot) => {
    console.log(`Selected time slot: ${slot}`);
    setSelectSlot2(slot);
  };

  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const goToAdminPage = (id) => {
    sessionStorage.setItem('selectSlot', selectSlot2);
    sessionStorage.setItem('formattedDate', formattedDate);
    window.location.href = `../UserReservationOption.user/${id}`;
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
          <div className="user-content-first-img"></div>
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

        <div className="user-content-container">
          <div className="user-reserve-date-title">예약일 선택</div>
          <hr/>
         
          <div className="user-reserve-date-calender">
            <Calendar
              onChange={handleDateChange}
              value={date}
            />
          </div>

          {dateTime.map((slot) => (
            <div key={slot.key}>
              <button type="button">
                <div> 임시 ) 해당 날짜 슬롯 상태: ({slot.slotStatusCount} / {slot.slotCount})</div>
              </button>

              <div className="user-reserve-date-time">
                {timeSlots.map((slots, index) => (
                  slot.slotStatusCount !== slot.slotCount ? (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        handleSlotClick(index);  // 슬롯 선택 관리
                        handleSlotClick2(slots); // 슬롯 시간 출력
                      }}
                      style={{
                        backgroundColor: selectedSlot === index ? '#2C348F' : 'transparent',
                        color: selectedSlot === index ? 'white' : 'black',
                      }}
                    >
                      {slots} {/* 슬롯 시간 표시 */}
                    </button>
                  ) : (
                    <div key={index} style={{ display: 'none' }} /> // 예약이 가득 차면 숨김
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="user-content-container">
        <div className="user-reserve-data">
            <div><i className="bi bi-calendar-check-fill"></i>{date.toLocaleDateString()}</div>
            <div><i className="bi bi-clock-fill"></i>{selectSlot2}</div>
          </div>
          </div>


        <div className="user-content-last">
          <button type="button" onClick={() => goToAdminPage(cateId)}>다음 <i className="bi bi-chevron-right"></i></button>
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

// 페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UserReservationDate />
);
