import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminReserveManage.css';

function AdminReserveManage() {
    const [passengers, setPassengers] = useState([
        {
            id: 1,
            name: "Clara Smith",
            email: "tranthuy.nute@...",
            phone: "(319) 555-0115",
            airline: "ATLANTA JET Airlines",
            flightStatus: "대 기",
            date: "09/18/23",
            time: "08:40",
            seat: "18F",
            destination: "RDU",
        },
        {
            id: 2,
            name: "Floyd Miles",
            email: "vuahiuthoungnt@...",
            phone: "(405) 555-0128",
            airline: "PEGASUS Airlines",
            flightStatus: "완 료",
            date: "09/18/23",
            time: "09:45",
            seat: "1D",
            destination: "RDU",
        },
        {
            id: 3,
            name: "Jerome Bell",
            email: "manhhackit08@...",
            phone: "(252) 555-0126",
            airline: "UIA Airlines",
            flightStatus: "#5028",
            date: "09/18/23",
            time: "12:37",
            seat: "16A",
            destination: "RDU",
        },
        {
            id: 4,
            name: "Ronald Richards",
            email: "binhan628@...",
            phone: "(208) 555-0112",
            airline: "MONTANA Airways",
            flightStatus: "#5028",
            date: "09/18/23",
            time: "16:45",
            seat: "2E",
            destination: "RDU",
        },
    ]);

    const [viewMode, setViewMode] = useState('calendar');
    const [reservationList, setReservationList] = useState([]);
    const [startMonth] = useState(new Date()); // 현재 월을 시작 월로 설정

    useEffect(() => {
        axios.get('/adminReservation/getManageList')
            .then(response => {
                console.log(response.data);
                setReservationList(response.data);
            })
            .catch(error => {
                console.log('Error Category', error);
            });
    }, [])

    // 캘린더에 예약건 반환
    const getReservationsForDate = (date) => {
        return reservationList
            .filter(reservation =>
                new Date(reservation.confirmTime).toLocaleDateString() === date.toLocaleDateString()
            )
            .sort((a, b) => new Date(a.confirmTime) - new Date(b.confirmTime)); // 시간순 정렬
    };


    return (


        <div>
            <div className="main-content-title">
                예약 관리
                <div className="icon-buttons">
                    <button className="icon-button calendar-button" onClick={() => setViewMode('calendar')}>
                        <span className="material-symbols-outlined">calendar_today</span>
                    </button>
                    <button className="icon-button list-button" onClick={() => setViewMode('list')}>
                        <span className="material-symbols-outlined">view_list</span>
                    </button>
                </div>
            </div>

            <div className="main-btns">
                {/* <button type="button" className="btn-st" >
                    추가하기
                </button> */}
            </div>

            <div className="main-contents">
                {viewMode === 'list' ? (
                    <div className="management-container">
                        <table className="management-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>예약 번호</th>
                                    <th>고객 명</th>
                                    <th>예약일</th>
                                    <th>총액</th>
                                    <th>요청사항</th>
                                    <th>예약 상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservationList.map((value, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{value.reservationNo}</td>
                                        <td>{value.userId}</td>
                                        <td>{value.confirmTime}</td>
                                        <td>{value.reservationPrice}</td>
                                        <td>{value.customerRequest}</td>
                                        <td><button className="flight-btn">{value.reservationStatus}</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="custom-calendar">
                        <h3>{startMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                        <Calendar
                        onChange={() => { }}
                        value={startMonth}
                        locale="en-US" // 영어 설정
                        tileClassName={({ date, view }) => {
                            if (view === 'month') {
                                if (date.getDay() === 0) { // 일요일
                                    return 'sunday'; // 일요일에만 'sunday' 클래스 추가
                                } else if (date.getDay() === 6) { // 토요일
                                    return 'saturday'; // 토요일에만 'saturday' 클래스 추가
                                }
                            }
                            return null; // 기본값은 null
                        }}
                        tileContent={({ date, view }) => {
                            if (view === 'month') {
                                const reservations = getReservationsForDate(date);
                                if (reservations.length > 0) {
                                    return (
                                        <ul className="reservation-list">
                                            {reservations.map((reservation) => {
                                                const time = new Date(reservation.confirmTime);
                                                const formattedTime = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
                                                return (
                                                    <li key={reservation.reservationNo}>
                                                        시간: {formattedTime} <br/> 예약자: {reservation.userId} <br/> 상태: {reservation.reservationStatus} 
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    );
                                }
                            }
                            return null; // 예약이 없을 경우 null 반환
                        }}
                    />

                    </div>
                )}
            </div>
            {/* Pagination can be added here if needed */}
            {/* <div className="pagination">
                       <span>Rows per page: 14</span>
                       <span>1-4 of 4</span>
                       <button>&lt;</button>
                       <button>&gt;</button>
                   </div> */}
        </div>

    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminReserveManage />
);