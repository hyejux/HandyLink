import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import './AdminReserveManageDetail.css';

function AdminReserveManageDetail() {

    // const [viewMode, setViewMode] = useState('list');
    // const [reservationList, setReservationList] = useState([]);
    // const [selectedDates, setSelectedDates] = useState([]);
    // const [displayedDates, setDisplayedDates] = useState([]); // 선택된 날짜를 표시할 상태 추가
    // const [startMonth] = useState(new Date());
    // const [updatingReservationId, setUpdatingReservationId] = useState(null); // 현재 업데이트 중인 예약 ID
    // const [newStatus, setNewStatus] = useState(''); // 새로운 예약 상태

    // useEffect(() => {
    //     axios.get('/adminReservation/getManageList')
    //         .then(response => {
    //             console.log(response.data);
    //             setReservationList(response.data);
    //         })
    //         .catch(error => {
    //             console.log('Error Category', error);
    //         });
    // }, []);

    // // 캘린더에 예약건 반환
    // const getReservationsForDate = (date) => {
    //     return reservationList
    //         // reservationList에서 각 예약(reservation)의 등록 시간(regTime)을 Date 객체로 변환합니다.
    //         .filter(reservation =>
    //             // toLocaleDateString() 메서드를 사용하여 해당 날짜를 문자열로 변환합니다.
    //             // 주어진 date와 같은 날짜인 예약만 필터링합니다.
    //             new Date(reservation.regTime).toLocaleDateString() === date.toLocaleDateString()
    //         )
    //         // 필터링된 예약 목록을 등록 시간에 따라 정렬합니다
    //         .sort((a, b) => new Date(a.regTime) - new Date(b.regTime));
    // };


    // const handleDateClick = (date) => {
    //     const dateString = date.toLocaleDateString();
    //     setSelectedDates((prevSelected) => {
    //         if (prevSelected.includes(dateString)) {
    //             return prevSelected.filter(d => d !== dateString);
    //         } else {
    //             return [...prevSelected, dateString];
    //         }
    //     });
    // };

    // // 선택된 날짜를 화면에 띄우고 선택된 날짜 초기화
    // const handleShowSelectedDates = () => {
    //     setDisplayedDates(selectedDates);
    //     setSelectedDates([]); // 선택된 날짜 초기화
    // };

    // // 예약 상태 변경
    // const handleStatusChange = (reservationNo, status) => {
    //     console.log(reservationNo , status);
    //     if (window.confirm(`${reservationNo} 주문건을 ${status}로 변경하시겠습니까?`)){
    //         axios.post('/adminReservation/updateStatus', {
    //             reservationId: reservationNo,
    //             newStatus: status,
    //         })
    //             .then(response => {
    //                 setReservationList(prevList => prevList.map(item =>
    //                     item.reservationNo === reservationNo ? { ...item, reservationStatus: status } : item
    //                 ));
    //                 setUpdatingReservationId(null); // 업데이트 완료 후 ID 초기화
    //                 setNewStatus(''); // 새로운 상태 초기화
    //             })
    //             .catch(error => {
    //                 console.error('Error updating reservation status:', error);
    //             });
    //       } else {
    //         setUpdatingReservationId(null);
    //         setNewStatus('');
    //       }
    //     };


    // // 예약 상태 변경 취소 버튼
    // const handleCancelUpdate = () => {
    //     setUpdatingReservationId(null);
    //     setNewStatus('');
    // };
    const [cateId, setCateId] = useState(0);
    const [reservationList, setReservationList] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState([]);

    useEffect(() => {
        const path = window.location.pathname;
        const pathSegments = path.split('/');
        const categoryId = pathSegments[pathSegments.length - 1];
        setCateId(categoryId);
        axios.get(`/userMyReservation/getMyReservationDetail/${categoryId}`)
          .then(response => {
            console.log(response.data);
            setReservationList(response.data);
          })
          .catch(error => {
            console.log('Error Category', error);
          });
    
        // 결제 정보 가져옴
        axios.get(`/userPaymentInfo/getPaymentInfo/${categoryId}`)
          .then(response => {
            console.log(response.data);
            setPaymentInfo(response.data);
          })
          .catch(error => {
            console.log('Error fetching payment info', error);
          });
      }, []);
      console.log(paymentInfo);

    return (
        <div>
            {/* <div className="main-content-title">
                <h1> 예약 상세보기 </h1>
                <div className="icon-buttons">
                    <button className="icon-button calendar-button" onClick={() => setViewMode('calendar')}>
                        <span className="material-symbols-outlined">calendar_today</span>
                    </button>
                    <button className="icon-button list-button" onClick={() => setViewMode('list')}>
                        <span className="material-symbols-outlined">view_list</span>
                    </button>
                </div>
            </div> */}


            <div className="main-contents">
               

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminReserveManageDetail />
);
