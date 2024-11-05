import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminReserveManage.css';
import { useRef } from 'react';

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
    const [filterServiceName, setFilterServiceName] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [displayedDates, setDisplayedDates] = useState([]); // 선택된 날짜를 표시할 상태 추가
    const [startMonth] = useState(new Date());
    const [updatingReservationId, setUpdatingReservationId] = useState(null); // 현재 업데이트 중인 예약 ID
    const [newStatus, setNewStatus] = useState(''); // 새로운 예약 상태
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReservationList, setFilteredReservationList] = useState(reservationList);
    const [filterStatus, setFilterStatus] = useState('');



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


            axios.post('/adminReservation/getManageFilterList', { storeNo: storeNo })
            .then(response => {
                console.log(response.data);
                setFilterServiceName(response.data);
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
            const paymentStatus = (status === '확정') ? '결제완료' : (status.startsWith('취소')) ? '결제취소' : '';

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
                        const customerOrCompanyCancel = (status === '취소(업체)') ? '취소(업체)' : '취소(고객)';
                        return axios.post(`/userPaymentCancel/updatePaymentStatus/${reservationNo}`, {
                            paymentStatus: paymentStatus,
                            storeName: storeName,
                            reservationStatus: customerOrCompanyCancel
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


    // ------------------ 정렬 ------------------
    const handleSort = (field, type) => {
        let order = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(order);

        // 정렬 대상 리스트를 filteredReservationList로 설정
        const sortedList = [...filteredReservationList].sort((a, b) => {
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

        setFilteredReservationList(sortedList); // 필터링된 리스트 업데이트
    };


    // ------------------ 검색 ------------------
    useEffect(() => {
        setFilteredReservationList(reservationList);
    }, [reservationList]);

    // 검색
    const handleSearch = () => {
        console.log("Searching for:", searchTerm);
        const filteredList = reservationList.filter((reservation) => {
            const reservationNoMatch = reservation.reservationNo.toString().includes(searchTerm);
            const userIdMatch = reservation.userId.includes(searchTerm);
            const regTimeMatch = reservation.regTime.includes(searchTerm);

            return reservationNoMatch || userIdMatch || regTimeMatch;
        });

        setFilteredReservationList(filteredList); // 필터링된 리스트 상태 업데이트
    };

    // // 필터링 함수
    // const handleFilter = (status) => {
    //     setFilterStatus(status); // 선택한 필터 상태 설정
    //     const filteredList = reservationList.filter((reservation) => {
    //         if (status === '대기') return reservation.reservationStatus === '대기';
    //         if (status === '입금대기') return reservation.reservationStatus === '입금대기';
    //         if (status === '확정') return reservation.reservationStatus === '확정';
    //         if (status === '완료') return reservation.reservationStatus === '완료';
    //         if (status === '취소') return reservation.reservationStatus === '취소';
    //         return true; // 모든 상태를 포함
    //     });

    //     setFilteredReservationList(filteredList); // 필터링된 리스트 상태 업데이트
    // };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // // 초기화 함수
    // const resetFilter = () => {
    //     setFilterStatus(''); // 필터 상태 초기화
    //     setFilteredReservationList(reservationList); // 원래의 예약 목록으로 복원
    // };




    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 초 추가
    
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`; // 초 포함
    };
    


    const componentRef = useRef();

  
    // const handleDateFilter = (days) => {
    //     const now = new Date();
    //     now.setHours(0, 0, 0, 0); // 오늘 자정으로 설정하여 시간 비교를 방지합니다.
    
    //     const filteredList = reservationList.filter(reservation => {
    //         const regDate = new Date(reservation.regTime);
    //         regDate.setHours(0, 0, 0, 0); // 예약 날짜도 자정으로 설정하여 시간 부분을 제거합니다.
    
    //         const dayDifference = (now - regDate) / (1000 * 60 * 60 * 24);
            
    //         // days가 0일 때 오늘을 의미하며, 차이가 0인 경우만 포함
    //         return days === 0 ? dayDifference === 0 : dayDifference >= 0 && dayDifference <= days;
    //     });
    
    //     setFilteredReservationList(filteredList);
    // };
    
 
    // 
    const [selectedDays, setSelectedDays] = useState(365);

    // const handleDateFilter = (days) => {
       
    // };

     // 날짜 필터 핸들러 (상위 필터)
     const handleDateFilter = (days) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // 자정을 기준으로 시간 초기화

            // days가 365인 경우 모든 예약을 반환
            if (days === 365) {
                setFilteredReservationList(reservationList);
                setSelectedDays(days); // 현재 선택된 필터 값으로 업데이트
                return;
            }
        

        const filteredList = reservationList.filter(reservation => {
            const regDate = new Date(reservation.regTime);
            regDate.setHours(0, 0, 0, 0);

            const dayDifference = (now - regDate) / (1000 * 60 * 60 * 24);
            
            return days === 0 ? dayDifference === 0 : dayDifference >= 0 && dayDifference <= days;
        });

        setFilteredReservationList(filteredList);
        setSelectedDays(days); // 현재 선택된 필터 값으로 업데이트
    };

    // 상태 필터 핸들러 (하위 필터)
    const handleFilter = (status) => {
        setFilterStatus(status); // 선택한 상태 필터 값 설정
    };

    // 필터링 로직: 날짜와 상태 기준으로 필터링
    useEffect(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // 자정 기준으로 시간 초기화

        const filteredList = reservationList.filter(reservation => {
            // 날짜 필터링
            const regDate = new Date(reservation.regTime);
            regDate.setHours(0, 0, 0, 0);
            const dayDifference = (now - regDate) / (1000 * 60 * 60 * 24);
            const dateCondition = selectedDays === null || 
                (selectedDays === 0 ? dayDifference === 0 : dayDifference >= 0 && dayDifference <= selectedDays);
            
            // 상태 필터링
            const statusCondition = !filterStatus || reservation.reservationStatus === filterStatus;
            
            // 두 조건 모두 만족하는 경우만 포함
            return dateCondition && statusCondition;
        });

        setFilteredReservationList(filteredList); // 필터링된 리스트 상태 업데이트
    }, [selectedDays, filterStatus, reservationList]);

    // 초기화 함수
    const resetFilter = () => {
        setFilterStatus('');
        setSelectedServiceName(''); // 서비스명 초기화
        setStartDate(''); // 시작 날짜 초기화
        setEndDate(''); // 종료 날짜 초기화
        // setFilteredReservationList(reservationList); // 원래의 예약 목록으로 복원
        setFilterStatus(''); // 상태 필터 초기화
        // setSelectedDays(null); // 날짜 필터 초기화
        setFilteredReservationList(reservationList); // 원래의 예약 목록으로 복원
    };




    const handlePrint = (reservation) => {
        const printContent = `
            예약 번호: ${reservation.reservationNo}
            서비스 이름: ${reservation.serviceName}
            사용자 ID: ${reservation.userId}
            등록 시간: ${formatDate(reservation.regTime)}
            예약 가격: ${reservation.reservationPrice}
            고객 요청: ${reservation.customerRequest}
            예약 상태: ${reservation.reservationStatus}
        `;
    
        const printWindow = window.open('', '', 'width=600,height=400');
        printWindow.document.write(`<pre>${printContent}</pre>`);
        printWindow.document.close();
        printWindow.print();
    };
    

    // ------------------------
    const [selectedServiceName, setSelectedServiceName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // 서비스 이름 선택 핸들러
    const handleServiceChange = (e) => {
        const serviceName = e.target.value;
        setSelectedServiceName(serviceName);
    };
    
    // 날짜 범위 핸들러
    const handleDateRangeChange = () => {
        // 시작 날짜와 종료 날짜가 모두 선택되면 상태를 업데이트합니다.
        if (startDate && endDate) {
            const filteredList = reservationList.filter(reservation => {
                const regDate = new Date(reservation.regTime);
                return regDate >= new Date(startDate) && regDate <= new Date(endDate);
            });
            setFilteredReservationList(filteredList);
        }
    };
    
    // 필터링 로직 업데이트
    useEffect(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // 자정 기준으로 시간 초기화
    
        const filteredList = reservationList.filter(reservation => {
            // 날짜 필터링
            const regDate = new Date(reservation.regTime);
            regDate.setHours(0, 0, 0, 0);
            const dayDifference = (now - regDate) / (1000 * 60 * 60 * 24);
            const dateCondition = selectedDays === null || 
                (selectedDays === 0 ? dayDifference === 0 : dayDifference >= 0 && dayDifference <= selectedDays);
    
            // 서비스명 필터링
            const serviceCondition = !selectedServiceName || reservation.serviceName === selectedServiceName;
    
            // 상태 필터링
            const statusCondition = !filterStatus || reservation.reservationStatus === filterStatus;
    
            return dateCondition && serviceCondition && statusCondition;
        });
    
        setFilteredReservationList(filteredList); // 필터링된 리스트 상태 업데이트
    }, [selectedDays, filterStatus, selectedServiceName, startDate, endDate, reservationList]);
    

    // --------------------------------------------------

    return (
        <div>


<div>
      {/* <div ref={componentRef}>
        <h1>프린트할 내용</h1>
        <p>이 영역의 내용을 프린트할 수 있습니다.</p>
      </div> */}
    
    </div>

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

          

            <div className="main-contents">

                {viewMode === 'list' ? (
                    <div className="management-container">

                     <div className="reservation-interface">
                        {/* Date Selection Buttons */}

                        <div className='filter-top2'>
                            

                
                    <div className="dropdown-menu">
                    <select onChange={handleServiceChange} value={selectedServiceName}>
                                {filterServiceName.map((value, index) => (
                                    <option key={index} value={value.serviceName}>{value.serviceName}</option>
                                ))}
                                </select>
                            </div>

                        
                            <div className="search-bar-box">
                                <input type='text' placeholder='예약번호, 고객명, 예약일...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} />
                                <button onClick={handleSearch}> <i className="bi bi-search"></i> </button>
                            </div>
                            </div>
                       

                    <div className='filter-top'>
                        <div className="date-selection">
                        <button
                                className={selectedDays === 365 ? 'active' : ''}
                                onClick={() => handleDateFilter(365)}
                            >
                                전체
                            </button>
                            <button
                                className={selectedDays === 0 ? 'active' : ''}
                                onClick={() => handleDateFilter(0)}
                            >
                                오늘
                            </button>
                            <button
                                className={selectedDays === 3 ? 'active' : ''}
                                onClick={() => handleDateFilter(3)}
                            >
                                3일
                            </button>
                            <button
                                className={selectedDays === 7 ? 'active' : ''}
                                onClick={() => handleDateFilter(7)}
                            >
                                1주일
                            </button>
                            <button
                                className={selectedDays === 30 ? 'active' : ''}
                                onClick={() => handleDateFilter(30)}
                            >
                                1개월
                            </button>
                            <button
                                className={selectedDays === 90 ? 'active' : ''}
                                onClick={() => handleDateFilter(90)}
                            >
                                3개월
                            </button>
                          
                        </div>

                        {/* Date Range Picker */}
                        <div className="date-range">
                        <div className="date-range">
        <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
        /> 
        <span> - </span>
        <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            onBlur={handleDateRangeChange} // 날짜가 변경되면 필터링
        />
            <button onClick={resetFilter}><i class="bi bi-arrow-clockwise"></i></button>
    </div>
                        </div>
                    </div>

                    <div className="reserve-manage-top">
                            <div className="filter-btn-box">
                                <button onClick={resetFilter}><i class="bi bi-arrow-clockwise"></i></button>
                                <button className={filterStatus === '대기' ? 'active' : ''} onClick={() => handleFilter('대기')}>대기</button>
                                <button className={filterStatus === '입금대기' ? 'active' : ''} onClick={() => handleFilter('입금대기')}>입금대기</button>
                                <button className={filterStatus === '확정' ? 'active' : ''} onClick={() => handleFilter('확정')}>확정</button>
                                <button className={filterStatus === '완료' ? 'active' : ''} onClick={() => handleFilter('완료')}>완료</button>
                                <button className={filterStatus === '취소' ? 'active' : ''} onClick={() => handleFilter('취소')}>취소</button>
                            </div>
                            <div className="dropdown-menu">
                                <select>
                                <option value="옵션3">20개씩 보기</option>
                                <option value="옵션1">50개씩 보기</option>
                                <option value="옵션2">100개씩 보기</option>
                                </select>
                            </div>
                       
                        </div>
                            
                        </div>
                       
                        <table className="management-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>예약번호<span onClick={() => handleSort('reservationNo', 'number')}><i className="bi bi-chevron-expand"></i></span></th>
                                    <th> 서비스명 </th>
                                    <th>고객 명<span onClick={() => handleSort('userId', 'string')}><i className="bi bi-chevron-expand"></i></span></th>
                                    <th>예약일<span onClick={() => handleSort('regTime', 'date')}><i className="bi bi-chevron-expand"></i></span></th>
                                    <th>총액<span onClick={() => handleSort('reservationPrice', 'number')}><i className="bi bi-chevron-expand"></i></span></th>
                                    <th>요청사항 </th>
                                    <th> 결제 상태 </th>
                                    {/* <th>예약 상태</th> */}
                                    <th>상태 변경</th>
                                    <th> <i class="bi bi-printer"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservationList.map((value, index) => (
                                    <tr key={index} onDoubleClick={() => { goToDetail(value.reservationNo) }}>
                                        <td><input type="checkbox" /></td>
                                        <td>{value.reservationNo}</td>
                                        <td> {value.serviceName}</td>
                                        <td>{value.userId}</td>
                                        <td>{formatDate(value.regTime)}</td>
                                        <td>{value.reservationPrice}</td>
                                        <td>{value.customerRequest}</td>
                                        <td> {value.paymentStatus} </td>
                                        {/* <td>{value.reservationStatus}</td> */}
                                        <td>
                                            <div>
                                                <select
                                                className='status-select'
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
                                        <td >    <button className='print-btn' onClick={() => handlePrint(value)}><i class="bi bi-printer"></i></button> </td>
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
                                                    {/* <strong>업체아이디:</strong> {reservation.storeId} <br /> */}
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
