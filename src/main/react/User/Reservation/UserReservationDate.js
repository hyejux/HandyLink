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

    axios.post('/userReservation/getDateTime', { reservationSlotDate: formattedDate })
    .then(response => {
      console.log('첫 번째 API 응답 데이터:', response.data); // 응답 데이터 전체를 출력
      const firstItem = response.data[0]; 
      const { reservationSlotKey } = firstItem;
  
      setRSloyKey(reservationSlotKey);
      setDateTime(response.data);
      console.log('reservationSlotKey:', reservationSlotKey); // reservationSlotKey 값을 확인
  
      // reservationSlotKey를 받아온 후에 두 번째 API 호출
      return axios.post('/userReservation/getSlotTime', { reservationSlotKey: reservationSlotKey });
    })
    .then(response => {
      const reservedTimes = response.data.map(slot => slot.reservationTime);
      // 모든 시간 변환
      
      const formattedReservedTimes = reservedTimes.map(convertTo12HourFormat);

      console.log('변환된 예약 시간:', formattedReservedTimes);
    
      setDisabledTimes(formattedReservedTimes); // 상태로 저장
      console.log('예약된 시간:', reservedTimes);

      // console.log('Slot Time API 호출 성공:', response.data);
    })
    .catch(error => {
      console.error('API 호출 실패:', error);
    });

  };

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // 12시 처리
    return `${period} ${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  
  const [disabledTimes, setDisabledTimes] = useState([]); // disabled 시킬 시간을 관리하는 상태

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
  
  

    while (start <= end) {
      const timeString = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // 예약된 시간과 비교해서 일치하면 해당 시간을 disabled 시킴
      // console.log(timeString);
      const isDisabled = disabledTimes.includes(timeString);
  
      slots.push({
        time: timeString,
        disabled: isDisabled, // 이 값에 따라 disabled 처리
      });
      
      start.setMinutes(start.getMinutes() + 30); // 30분 추가
    }
    
    return slots;
  };
  
  // 시간 슬롯을 렌더링하는 부분
  const timeSlots = generateTimeSlots('09:00', '17:00'); // 시작 및 종료 시간 설정
  

  // 선택된 슬롯의 인덱스를 저장
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectSlot2, setSelectSlot2] = useState('00:00');
  const [rSloyKey, setRSloyKey] = useState(0);

  const handleSlotClick = (index) => {
    setSelectedSlot(index === selectedSlot ? null : index);  // 슬롯 선택/해제
  };

  const handleSlotClick2 = (slot) => {
    // console.log(`Selected time slot: ${slot}`);
    setSelectSlot2(slot);
  };

  const handleSlotClick3 = (reservationSlotKey) => {
    // console.log(`Selected time slot: ${reservationSlotKey}`);
  };

  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  const goToAdminPage = (id) => {
    sessionStorage.setItem('reservationSlotKey',rSloyKey);
    sessionStorage.setItem('selectSlot', selectSlot3);
    sessionStorage.setItem('formattedDate', formattedDate);
    window.location.href = `../UserReservationOption.user/${id}`;
  };

  const [selectSlot3, setSelectSlot3] = useState('00:00');

  useEffect(() => {
    const formattedSlot = selectSlot2.replace(/오전\s+|오후\s+/g, '').trim();
  
    // "오후 03:00" 또는 "오전 03:00"에서 "15:00" 또는 "03:00"으로 변환
    const timeParts = formattedSlot.split(':');
    let hours = parseInt(timeParts[0]);
    const isAfternoon = selectSlot2.includes('오후');
  
    if (isAfternoon && hours < 12) {
      hours += 12; // 12시간 형식에서 24시간 형식으로 변환
    } else if (!isAfternoon && hours === 12) {
      hours = 0; // 12AM을 00으로 변환
    }
  
    const resultSlot = `${String(hours).padStart(2, '0')}:${timeParts[1]}`;
  
    console.log(`Selected time slot: ${resultSlot}`);
    setSelectSlot3(resultSlot);
  },[selectSlot2]);
  

  const [reserveModi, setReserveModi] = useState('');

  useEffect(() => {
    axios
      .get(`/adminReservation/getListDetail/${cateId}`)
      .then(response => {
        console.log(response.data);
        setReserveModi(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });

    }, [cateId]);

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
             <div className="user-reserve-menu">
               <div className="user-reserve-menu-img">
               <img src={`${reserveModi.imageUrl}`} alt="My Image" />
               </div>
               <div className="user-reserve-menu-content">
                 <div>{reserveModi.serviceName} </div> 
                 <div>
                   {reserveModi.serviceContent}
                 
                 </div>
                 <div> {reserveModi.servicePrice} 원 ~</div>
                 
               </div>
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
  <div key={slot.reservationSlotKey}> {/* slot.key 대신 slot.reservationSlotKey 사용 */}
    <button type="button">
      <div> 임시 ) 해당 날짜 슬롯 상태: ({slot.slotStatusCount} / {slot.slotCount})</div>
    </button>

    <div className="user-reserve-date-time">
      {timeSlots.map((timeSlot, index) => (
        slot.slotStatusCount !== slot.slotCount ? (
          <button
            key={index}
            type="button"
            onClick={() => {
              handleSlotClick(index);  // 슬롯 선택 관리
              handleSlotClick2(timeSlot.time); // 슬롯 시간 출력
              handleSlotClick3(slot.reservationSlotKey);
            }}
            disabled={disabledTimes.includes(timeSlot.time)} // 비활성화 조건 추가
            style={{
              backgroundColor: selectedSlot === index ? '#2C348F' : 'transparent',
              color: selectedSlot === index ? 'white' : 'black',
              opacity: disabledTimes.includes(timeSlot.time) ? 0.5 : 1, // 비활성화된 슬롯의 투명도 조절
            }}
          >
            {timeSlot.time} {/* 슬롯 시간 표시 */}
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
