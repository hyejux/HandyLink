import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminReserveSettingDetailSlot.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // 기본 스타일
import 'react-date-range/dist/theme/default.css'; // 기본 테마
// import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ko from 'date-fns/locale/ko'; // 한국어 로케일
// import {DateRangePicker} from '@adobe/react-spectrum'
// import { Provider } from '@adobe/react-spectrum';
// import { DateRangePicker } from '@adobe/react-spectrum';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import slotShouldForwardProp from '@mui/material/styles/slotShouldForwardProp';

function AdminReserveSettingDetailSlot() {


    const [startDate, setStartDate] = useState(new Date()); // 시작일
    const [endDate, setEndDate] = useState(new Date()); // 종료일 
    const [date, setDate] = useState(); // 시작일과 종료일 배열로 관리

  
    const handleDateChange = (newDate) => {
        setDate(newDate);
        
        // setIsRange(true);
        console.log(newDate);
        // console.log(JOSN.stringify(date));
        handleDateClick(null);
      
    };

    const [slotCounts, setSlotCounts] = useState(0);
    const [limitTimes, setLimitTimes] = useState(0);

        
    // 수정 완료 핸들러
    const handleSaveChanges = (reservationKey) => {
        
        axios.post(`/userReservation/updateSlotCount1/${cateId}`,{
            reservationSlotDate : date,
            slotCount :  slotCounts,
            limitTime : limitTimes
        })
        .then(response => {
                console.log("성공");
        })
        .catch(error => {
            console.log('Error fetching reservation list', error);
        });
  
    };


    



    // -----------------------------------------------------

    const [viewMode, setViewMode] = useState('calendar');
    const [reservationList, setReservationList] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [startMonth] = useState(new Date());

    const [serviceDate, setServiceDate] = useState(''); // 날짜 상태
    const [serviceHour, setServiceHour] = useState(''); // 시간 상태


    const [cateId, setCateId] = useState(0);
    useEffect(() => {
      const path = window.location.pathname;
      const pathSegments = path.split('/');
      const categoryId = pathSegments[pathSegments.length - 1];
      setCateId(categoryId);
      axios.get(`/userReservation/getAllDateTime/${categoryId}`)
      .then(response => {
          console.log(response.data);
          let startDate = '';
          if (response.data.length > 0) {
            const firstServiceStart = response.data[0].serviceStart; // 첫 번째 객체의 serviceStart
            startDate = firstServiceStart; // 상태 업데이트
        }
          const serviceStart = new Date(startDate);
          const formattedDate = `${serviceStart.getFullYear()}-${String(serviceStart.getMonth() + 1).padStart(2, '0')}-${String(serviceStart.getDate()).padStart(2, '0')}`; // YYYY-MM-DD 형식
          const formattedHour = `${String(serviceStart.getHours()).padStart(2, '0')}`; // HH 형식만 설정
            console.log(formattedDate, formattedHour);
          setServiceDate(formattedDate); // 날짜 상태 설정
          setServiceHour(formattedHour); // 시간 상태 설정
          setReservationList(response.data);
      })
      .catch(error => {
          console.log('Error fetching reservation list', error);
      });
      axios
      .get(`/adminReservation/getListDetail/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setReserveModi(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });

    }, []);


    // 예약을 날짜에 맞춰 반환하는 함수
    const getReservationsForDate = (date) => {
          // 날짜를 하루 전으로 조정
        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + 1); //

        const dateString = adjustedDate.toISOString().split('T')[0]; // 조정된 날짜를 ISO 형식으로 변환
        return reservationList
            .filter(reservation =>
                reservation.reservationSlotDate === dateString
            )
            .sort((a, b) => new Date(a.reservationSlotDate) - new Date(b.reservationSlotDate));
    };


    const handleDateClick = (date) => {
        if (date !== null){

            const dateString = date.toLocaleDateString();
            setSelectedDates(() => {
      
                    return [dateString];
                
            });
        }
    };



    const btnUpdateStart = () => {
        const localDateTimeString = `${serviceDate}T${serviceHour}:00:00`; // YYYY-MM-DDTHH:MM:SS 형식

        console.log(localDateTimeString);
        axios.post('/userReservation/setUpdateStart', { serviceStart :  localDateTimeString , categoryId : cateId} )
        .then(response => {
            console.log(response.data);
            
        }).catch(error => {
            console.log('Error fetching reservation list', error);
        });
        axios.get(`/userReservation/getAllDateTime/${cateId}`)
        .then(response => {
            console.log(response.data);
            let startDate = '';
            if (response.data.length > 0) {
              const firstServiceStart = response.data[0].serviceStart; // 첫 번째 객체의 serviceStart
              startDate = firstServiceStart; // 상태 업데이트
          }
            const serviceStart = new Date(startDate);
            const formattedDate = `${serviceStart.getFullYear()}-${String(serviceStart.getMonth() + 1).padStart(2, '0')}-${String(serviceStart.getDate()).padStart(2, '0')}`; // YYYY-MM-DD 형식
            const formattedHour = `${String(serviceStart.getHours()).padStart(2, '0')}`; // HH 형식만 설정
              console.log(formattedDate, formattedHour);
            setServiceDate(formattedDate); // 날짜 상태 설정
            setServiceHour(formattedHour); // 시간 상태 설정
            setReservationList(response.data);
        })
        .catch(error => {
            console.log('Error fetching reservation list', error);
        });
        
    }

 
  
    // 오늘 날짜 가져오기
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
  
    // 시간 비교를 위한 현재 시간 가져오기 (24시간 형식)
    const currentHour = today.getHours();
  
    // 날짜와 시간을 비교하여 비활성화 조건 확인
    const isDatePastOrToday = serviceDate && serviceDate <= formattedToday;
    const isTimePast = serviceDate === formattedToday && serviceHour !== "" && parseInt(serviceHour) <= currentHour;
  
    // input과 select 비활성화 조건
    const isDisabled = isDatePastOrToday && isTimePast;
  


    


    
  const setName = (value) => {
    setReserveAdd((prevState) => ({
      ...prevState,
      serviceName: value
    }));
  };

  const setPrice = (value) => {
    setReserveAdd((prevState) => ({
      ...prevState,
      servicePrice: value
    }));
  };

  const setDescription = (value) => {
    setReserveAdd((prevState) => ({
      ...prevState,
      serviceContent: value
    }));
  };
  const [reserveModi, setReserveModi] = useState('');
  

 // 날짜를 'YYYY/MM/DD' 형식으로 변환하는 함수
 const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줌
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };


    return (
        <div>
            <div className="main-content-title">
                <h1> 서비스 시간 슬롯 관리 </h1>
              
            </div>
            <div className="reserve-container">
        <div className="reserve-img">
            {/* <img src={http://localhost:8585/img/${reserveModi.imageUrl}} alt="My Image" /> */}
            {/* <button type="button" className="btn-st btn-imgChg">사진 변경하기</button> */}
          </div>
          <div className="reserve-content">
            <div className="reserve-content-title">
              <div className="reserve-content-title-name">
                <input
                  type="text"
                  value={reserveModi.serviceName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='서비스 명'
                />
              </div>
              <div className="reserve-content-title-price">
                <input
                  type="number"
                  value={reserveModi.servicePrice}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder='서비스 가격'
                />
              </div>
            </div>
            <div className="reserve-content-text">
              <textarea
                value={reserveModi.serviceContent}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='서비스 설명'
              />
            </div>
          </div>
        </div>

{/* 서비스 변경 */}
            <div className='main-slot-box'>
                {/*  서비스 변경  */}
            <div className="main-slot2">

                <div className='main-slot-title'>
                <div>서비스 시작일 </div>
                </div>
                <div  className='main-slot-input'>
                        <input 
                        type="date" 
                        value={serviceDate} 
                        onChange={(e) => setServiceDate(e.target.value)} 
                        disabled={isDatePastOrToday} // 이미 지난 날짜라면 비활성화
                    />

                    {/* 시간 입력을 위한 드롭다운 */}
                    <select 
                    id="time-select" value={serviceHour} 
                    onChange={(e) => setServiceHour(e.target.value)} 
                    disabled={isDatePastOrToday}>
                        <option value="">시간 선택</option> {/* 기본 옵션 */}
                        {[...Array(24)].map((_, index) => (
                            <option key={index} value={String(index).padStart(2, '0')}>
                                {String(index).padStart(2, '0')}:00 {/* 두 자리로 표현 */}
                            </option>
                        ))}
                    </select>
                    {!isDatePastOrToday && (
                                <button onClick={btnUpdateStart}>수정 완료</button>
                            )}
                </div>

           

          

            </div>
            <hr/>
            </div>

            <div className="main-contents">
                <div className="calendar-and-reservation-info">

                    {/* 빅 캘린더 */}
                    <div className="custom-calendar">
                        <h3>{startMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>

                        <div className='date-range'>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} 
                  dateFormat="yyyy/MM/dd" // Set the desired date format
                  placeholderText="날짜를 선택하세요"/>
                         
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy/MM/dd" // Set the desired date format
                  placeholderText="날짜를 선택하세요" />
                         </div>
                      
                        <Calendar
                            value={date}
                            locale="en-US"
                            tileClassName={({ date, view }) => {
                                if (view === 'month') {
                                    const dateString = date.toISOString().split('T')[0];
                                    if (selectedDates.includes(dateString)) {
                                        return 'selected-date';
                                    }
                                }
                                return null;
                            }}
                            tileContent={({ date, view }) => {
                                if (view === 'month') {
                                    const reservations = getReservationsForDate(date);
                                    if (reservations.length > 0) {
                                        return (
                                            <ul className="reservation-list">
                                                {reservations.map((reservation) => (
                                                    <li key={reservation.reservationSlotKey} className={reservation.slotCount === reservation.slotStatusCount ? 'equal-slot-count' : ''}>
                                                        {/* {reservation.reservationSlotDate} <br />
                                                        {reservation.storeId} <br /> */}
                                                      ( {reservation.slotStatusCount}  / {reservation.slotCount} )
                                                       <p> <i class="bi bi-stopwatch"></i> {reservation.limitTime} </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                }
                                return null;
                            }}
                            onClickDay={handleDateClick}
                            // selectRange={isRange}
                            // selectRange={true} // 범위 선택을 허용
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className="reservation-info-container">
                        <h3>예약 정보</h3>
                        
                        
                        <h3>Selected Dates</h3>
                        {/* 화면에 포맷된 startDate와 endDate의 값을 출력 */}
                        <div>Start Date: {formatDate(startDate)}</div>
                        <div>End Date: {formatDate(endDate)}</div>
                        
                        {selectedDates.map((dateString, index) => (
    <div key={index}>
        <h1>{dateString}</h1>

        <ul>
            {getReservationsForDate(new Date(dateString)).map(reservation => {
                // Log the date and reservation details
                console.log(`날짜: ${dateString}, 일별 예약 제한: ${reservation.slotCount}, 시간별 예약 제한: ${reservation.limitTime}`);

                return (
                    <li 
                        key={reservation.reservationSlotKey} 
                    >
                       

                       <div className='slot-num-status'>
                <strong>일별 예약 제한</strong>
                <input
                    type='number'
                    value={slotCounts !== undefined 
                        ? slotCounts // 상태에서 값을 가져옴
                        : reservation.slotCount} // 기본값으로 reservation.slotCount 사용
                    onChange={(e) => setSlotCounts(Number(e.target.value))} // 직접 slotCount 업데이트
                />
            </div>
            <br />
            <strong>시간별 예약 제한</strong>
            <input
                type='number'
                value={limitTimes !== undefined 
                    ? limitTimes // limitTime 상태 값 사용
                    : reservation.limitTimes} // 기본값으로 reservation.limitTime 사용
                onChange={(e) => setLimitTimes(Number(e.target.value))} // 직접 limitTime 업데이트
            />
            <button type="button" onClick={() => handleSaveChanges(reservation.reservationSlotKey)}>
                수정 완료
            </button>
        </li>
                );
            })}
        </ul>
    </div>
))}
                    </div>

                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminReserveSettingDetailSlot />
);
