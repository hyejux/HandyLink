import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminReserveSettingDetailSlot.css';

function AdminReserveSettingDetailSlot() {
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
        const dateString = date.toLocaleDateString();
        setSelectedDates(() => {
  
                return [ dateString];
            
        });
    };

     // ... 다른 상태들 생략 ...
    const [editModes, setEditModes] = useState({}); // 예약 항목의 편집 모드 상태를 관리하기 위한 객체
    const [editedValues, setEditedValues] = useState({}); // 편집 중인 값들 저장

    // 더블 클릭 시 편집 모드 활성화 및 초기값 설정
    const handleEditToggle = (reservationKey, reservation) => {
        setEditModes(prev => ({
            ...prev,
            [reservationKey]: !prev[reservationKey] // 해당 항목의 편집 모드 토글
        }));

        if (!editModes[reservationKey]) {
            setEditedValues({
                ...editedValues,
                [reservationKey]: {
                    slotCount: reservation.slotCount,
                    limitTime: reservation.limitTime,
                },
            });
        }
    };

    // 수정 완료 핸들러
    const handleSaveChanges = (reservationKey) => {
        // 여기서 예약 정보를 서버에 저장하거나 상태를 업데이트하는 로직을 추가하세요.
        console.log(`Saving changes for ${reservationKey}:`, editedValues[reservationKey]);
        
        // 편집 모드 종료
        setEditModes(prev => ({
            ...prev,
            [reservationKey]: false,
        }));
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




    return (
        <div>
            <div className="main-content-title">
                <h1> 서비스 시간 슬롯 관리 </h1>
              
            </div>
            <div className="main-slot">
        <div> 서비스 시작일 </div>
       {/* 날짜 입력 필드 */}
       <input 
                type="date" 
                value={serviceDate} 
                onChange={(e) => setServiceDate(e.target.value)} 
            />

            {/* 시간 입력을 위한 드롭다운 */}
            <select id="time-select" value={serviceHour} onChange={(e) => setServiceHour(e.target.value)} >
                <option value="">시간 선택</option> {/* 기본 옵션 */}
                {[...Array(24)].map((_, index) => (
                    <option key={index} value={String(index).padStart(2, '0')}>
                        {String(index).padStart(2, '0')}:00 {/* 두 자리로 표현 */}
                    </option>
                ))}
            </select>
            <button onClick={btnUpdateStart}> 수정 완료 </button>
            </div>

            <div className="main-contents">
                <div className="calendar-and-reservation-info">
                    <div className="custom-calendar">
                        <h3>{startMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                        <Calendar
                            value={startMonth}
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
                        />
                    </div>
                    <div className="reservation-info-container">
                        <h3>예약 정보</h3>
                        <div className="icon-buttons">
                            <div> 기간 지정 변경 </div>
                          <input type="date" />  ~    <input type="date" /> 
                          </div>
                          <div>
                          <div className="main-slot">
                                <div> 일별 건수 </div>
                              <input type="number" /> 
                        </div>
                        <div className="main-slot">
                                <div> 시간별 예약 건수 </div>
                              <input type="number" /> 
                        </div>
                            </div>
                          
                         
                        {selectedDates.map((dateString, index) => (
                            <div key={index}>
                                <h1>{dateString}</h1>
                                <ul>
                            {getReservationsForDate(new Date(dateString)).map(reservation => (

                                <li 
                                    key={reservation.reservationSlotKey} 
                                    onDoubleClick={() => handleEditToggle(reservation.reservationSlotKey, reservation)}
                                >
                {reservation.slotCount !== reservation.slotStatusCount && (
             <div style={{fontSize: '12px', color: '#ddd',float: 'right'}} > <i class="bi bi-hand-index-thumb"> 더블클릭하여 수정 </i> </div>
                )}

                                    <div>일별 슬롯 개수 제한</div>
                                    <div className='slot-num-status'>
                                        <input 
                                            type='number' 
                                            value={reservation.slotStatusCount} 
                                            disabled 
                                        /> /
                                        <input
                                            type='number'
                                            value={editModes[reservation.reservationSlotKey] ? editedValues[reservation.reservationSlotKey]?.slotCount : reservation.slotCount}
                                            onChange={(e) => setEditedValues(prev => ({
                                                ...prev,
                                                [reservation.reservationSlotKey]: {
                                                    ...prev[reservation.reservationSlotKey],
                                                    slotCount: e.target.value,
                                                },
                                            }))}
                                            disabled={!editModes[reservation.reservationSlotKey]}
                                        />
                                    </div>
                                    <br />
                                    <strong>시간별 슬롯 제한</strong>
                                    <input
                                        type='number'
                                        value={editModes[reservation.reservationSlotKey] ? editedValues[reservation.reservationSlotKey]?.limitTime : reservation.limitTime}
                                        onChange={(e) => setEditedValues(prev => ({
                                            ...prev,
                                            [reservation.reservationSlotKey]: {
                                                ...prev[reservation.reservationSlotKey],
                                                limitTime: e.target.value,
                                            },
                                        }))}
                                        disabled={!editModes[reservation.reservationSlotKey]}
                                    /><br />
                                    
                                    {/* 수정 완료 버튼 */}
                                    {editModes[reservation.reservationSlotKey] && (
                                        <button type="button" onClick={() => handleSaveChanges(reservation.reservationSlotKey)}>
                                            수정 완료
                                        </button>
                                    )}
                                </li>
                            ))}
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
