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

    const [viewMode, setViewMode] = useState('list');
    const [reservationList, setReservationList] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [displayedDates, setDisplayedDates] = useState([]); // 선택된 날짜를 표시할 상태 추가
    const [startMonth] = useState(new Date());
    const [updatingReservationId, setUpdatingReservationId] = useState(null); // 현재 업데이트 중인 예약 ID
    const [newStatus, setNewStatus] = useState(''); // 새로운 예약 상태
    const [sortOrder, setSortOrder] = useState('asc');


    useEffect(() => {
        const storeId = sessionStorage.getItem('storeId');
        const storeNo = sessionStorage.getItem('storeNo');
        console.log("세션 storeId: ", storeId);
        console.log("세션 storeNo: ", storeNo);


        axios.post('/adminReservation/getManageList', { storeNo: storeNo })
            .then(response => {
                console.log(response.data);
                setReservationList(response.data);
            })
            .catch(error => {
                console.log('Error Category', error);
            });
    }, []);

    // 캘린더에 예약건 반환
    const getReservationsForDate = (date) => {
        return reservationList
            // reservationList에서 각 예약(reservation)의 등록 시간(regTime)을 Date 객체로 변환합니다.
            .filter(reservation =>
                // toLocaleDateString() 메서드를 사용하여 해당 날짜를 문자열로 변환합니다.
                // 주어진 date와 같은 날짜인 예약만 필터링합니다.
                new Date(reservation.regTime).toLocaleDateString() === date.toLocaleDateString()
            )
            // 필터링된 예약 목록을 등록 시간에 따라 정렬합니다
            .sort((a, b) => new Date(a.regTime) - new Date(b.regTime));
    };


    const handleDateClick = (date) => {
        const dateString = date.toLocaleDateString();
        setSelectedDates((prevSelected) => {
            if (prevSelected.includes(dateString)) {
                return prevSelected.filter(d => d !== dateString);
            } else {
                return [...prevSelected, dateString];
            }
        });
    };

    // 선택된 날짜를 화면에 띄우고 선택된 날짜 초기화
    const handleShowSelectedDates = () => {
        setDisplayedDates(selectedDates);
        setSelectedDates([]); // 선택된 날짜 초기화
    };

    // 예약 상태 변경
    const handleStatusChange = (reservationNo, status, storeName) => {
        console.log(reservationNo, status);
        if (window.confirm(`${reservationNo} 주문건을 ${status}로 변경하시겠습니까?`)) {
            // 결제 상태 결정
            const paymentStatus = (status === '확정') ? '결제완료' : (status === '취소(업체)' || status === '취소(고객)') ? '결제취소' : '';

            // 예약 상태 업데이트
            axios.post('/adminReservation/updateStatus', {
                reservationId: reservationNo,
                newStatus: status,
            })
                .then(response => {
                    // 결제 상태 업데이트
                    return axios.post('/userPayment/updateStatus', null, {
                        params: {
                            reservationNo: reservationNo,
                            newStatus: paymentStatus,
                        },
                    });
                })
                .then(response => {
                    setReservationList(prevList => prevList.map(item =>
                        item.reservationNo === reservationNo ? { ...item, reservationStatus: status } : item
                    ));

                    // 결제취소일 경우 환불 처리
                    if (paymentStatus === '결제취소') {
                        return axios.post(`/userPaymentCancel/updatePaymentStatus/${reservationNo}`, {
                            paymentStatus: paymentStatus,
                            storeName: storeName,
                        });
                    }
                })
                .then(response => {
                    console.log('환불 처리 완료:', response.data);
                    setUpdatingReservationId(null); // 업데이트 완료 후 ID 초기화
                    setNewStatus(''); // 새로운 상태 초기화
                })
                .catch(error => {
                    console.error('Error updating reservation, payment, or refund status:', error);
                });
        } else {
            setUpdatingReservationId(null);
            setNewStatus('');
        }
    };





    // 예약 상태 변경 취소 버튼
    const handleCancelUpdate = () => {
        setUpdatingReservationId(null);
        setNewStatus('');
    };

    console.log(reservationList);

    const goToDetail = (no) => {
        window.location.href = `/AdminReserveManageDetail.admin/${no}`;
    };


    // 정렬
    const handleSort = (field, type) => {
        let order = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(order);

        const sortedList = [...reservationList].sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];

            // 숫자 타입 정렬
            if (type === 'number') {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            }

            // 날짜 타입 정렬
            if (type === 'date') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            }

            // 문자 타입 정렬
            if (type === 'string') {
                return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            return 0; // 기본적으로 같으면 0 반환
        });
        setReservationList(sortedList);
    };



    return (
        <div>
            <div className="main-content-title">
                <div className='header-title'> 예약 관리 </div>
                <hr />
                <div className="icon-buttons">
                    <button className="icon-button calendar-button" onClick={() => setViewMode('calendar')}>
                        <span className="material-symbols-outlined">calendar_today</span>
                    </button>
                    <button className="icon-button list-button" onClick={() => setViewMode('list')}>
                        <span className="material-symbols-outlined">view_list</span>
                    </button>
                </div>
            </div>

            {/* <div className="main-btns">
                <button type="button" className="btn-st" onClick={handleShowSelectedDates}>
                    선택한 날짜
                </button>
            </div> */}

            {/* 선택된 날짜를 버튼 아래에 표시 */}
            {/* {displayedDates.length > 0 && (
                <div className="selected-dates-display">
                    <h4>선택된 날짜:</h4>
                    <ul>
                        {displayedDates.map((date, index) => (
                            <li key={index}>{date}</li>
                        ))}
                    </ul>
                </div>
            )} */}

            <div className="main-contents">
                <div className="search-bar-box">
                    <input type='text' placeholder='검색할 내용을 입력해주세요' />
                    <button>  <i class="bi bi-search"></i> </button>
                </div>

                {viewMode === 'list' ? (
                    <div className="management-container">
                        <table className="management-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>예약번호<button onClick={() => handleSort('reservationNo', 'number')}><i className="bi bi-chevron-expand"></i></button></th>
                                    <th>고객 명<button onClick={() => handleSort('userId', 'string')}><i className="bi bi-chevron-expand"></i></button></th>
                                    <th>예약일<button onClick={() => handleSort('regTime', 'date')}><i className="bi bi-chevron-expand"></i></button></th>
                                    <th>총액<button onClick={() => handleSort('reservationPrice', 'number')}><i className="bi bi-chevron-expand"></i></button></th>
                                    <th>요청사항 </th>
                                    {/* <th>예약 상태</th> */}
                                    <th>상태 변경</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservationList.map((value, index) => (
                                    <tr key={index} onDoubleClick={() => { goToDetail(value.reservationNo) }}>
                                        <td><input type="checkbox" /></td>
                                        <td>{value.reservationNo}</td>
                                        <td>{value.userId}</td>
                                        <td>{value.regTime}</td>
                                        <td>{value.reservationPrice}</td>
                                        <td>{value.customerRequest}</td>
                                        {/* <td>{value.reservationStatus}</td> */}
                                        <td>
                                            <div>
                                                <select
                                                    value={newStatus}
                                                    onChange={(e) => {
                                                        const selectedStatus = e.target.value;
                                                        setNewStatus(selectedStatus);
                                                        handleStatusChange(value.reservationNo, selectedStatus);
                                                    }}
                                                    disabled={
                                                        value.reservationStatus === '완료' ||
                                                        value.reservationStatus === '취소(업체)' ||
                                                        value.reservationStatus === '취소(고객)'
                                                    }
                                                >
                                                    <option value={value.reservationStatus}>{value.reservationStatus}</option>
                                                    {value.reservationStatus !== '확정' && <option value="확정">확정</option>}
                                                    {value.reservationStatus !== '완료' && <option value="완료">완료</option>}
                                                    {value.reservationStatus !== '취소(업체)' && <option value="취소(업체)">취소(업체)</option>}
                                                </select>
                                            </div>


                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="calendar-and-reservation-info">
                        <div className="custom-calendar">
                            <h3>{startMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                            <Calendar
                                onChange={() => { }}
                                value={startMonth}
                                locale="en-US"
                                tileClassName={({ date, view }) => {
                                    if (view === 'month') {
                                        const dateString = date.toLocaleDateString();
                                        if (selectedDates.includes(dateString)) {
                                            return 'selected-date';
                                        }
                                    }
                                    return null;
                                }}
                                // tileContent: 각 날짜에 예약 정보를 표시하는 로직입니다. getReservationsForDate(date) 함수를 호출하여 현재 날짜의 예약 목록을 가져와서, 예약이 있을 경우 이를 <ul> 리스트로 렌더링합니다.
                                tileContent={({ date, view }) => {
                                    // tileClassName: 현재 월 뷰(view === 'month')일 때, 날짜가 선택된 날짜(selectedDates) 배열에 포함되어 있으면 selected-date 클래스를 반환하여 해당 날짜를 강조합니다.
                                    if (view === 'month') {
                                        const reservations = getReservationsForDate(date);
                                        if (reservations.length > 0) {
                                            return (
                                                <ul className="reservation-list">
                                                    {reservations.map((reservation) => {
                                                        return (
                                                            <li key={reservation.reservationNo}>
                                                                {reservation.reservationTime} <br /> {reservation.userId} <br />{reservation.reservationStatus}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            );
                                        }
                                    }
                                    return null;
                                }}
                                // onClickDay: 날짜를 클릭했을 때 호출되는 함수로, handleDateClick을 통해 선택된 날짜를 업데이트합니다.
                                onClickDay={handleDateClick}
                            />
                        </div>

                        {/* 선택된 날짜가 있을 때만 예약 정보 리스트 표시 */}
                        {selectedDates.length > 0 && (
                            <div className="reservation-info-container">
                                <h3>예약 정보</h3>
                                {selectedDates.map((dateString, index) => (
                                    <div key={index}>
                                        <h4>{dateString}</h4>
                                        <ul>
                                            {getReservationsForDate(new Date(dateString)).map(reservation => (
                                                <li key={reservation.reservationNo}>
                                                    <strong>예약번호:</strong> {reservation.reservationNo} <br />
                                                    <strong>예약상태:</strong> {reservation.reservationStatus} <br />
                                                    <strong>예약시간:</strong> {reservation.reservationTime} <br />
                                                    <strong>예약등록일시:</strong> {reservation.regTime} <br />
                                                    <strong>요청사항:</strong> {reservation.customerRequest} <br />
                                                    <strong>총액:</strong> {reservation.reservationPrice} <br />
                                                    <strong>업체아이디:</strong> {reservation.storeId} <br />
                                                    <strong>사용자아이디:</strong> {reservation.userId} <br />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminReserveManage />
);
