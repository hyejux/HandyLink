import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminReserveManageDetail.css';

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
  const [reservationDetail, setReservationDetail] = useState({});
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const categoryId = pathSegments[pathSegments.length - 1];
    setCateId(categoryId);

    // 예약 정보 가져오기
    axios.get(`/userMyReservation/getMyReservationDetail/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setReservationList(response.data);
      })
      .catch(error => {
        console.log('Error fetching reservation list:', error);
      });

    // 결제 정보 가져오기
    axios.get(`/userPaymentInfo/getPaymentInfo/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setPaymentInfo(response.data);
      })
      .catch(error => {
        console.log('Error fetching payment info:', error);
      });

    // 예약 상세 정보 가져오기
    axios.get(`/userReservation/getReservationDetail/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setReservationDetail(response.data);

        // 예약 상세 정보에서 userId 추출
        const userId = response.data.userId;
        setUserId(userId);
        console.log("userId: " + userId);

        // 사용자 정보 가져오기 (userId를 사용하여 요청)
        return axios.get(`/getUser/${userId}`);
      })
      .then(response => {
        console.log(response.data);
        setUserInfo(response.data);
      })
      .catch(error => {
        console.log('Error fetching reservation detail or user profile:', error);
      });

  }, []);

  // 결제 일시 포맷 (년.월.일 시:분:초)
  const formatDate1 = (dateString) => {
    const [date, time] = dateString.split('T');
    const formattedDate = date.replace(/-/g, '.'); // '-'을 '/'로 변경
    return `${formattedDate} ${time.substring(0, 8)}`; // 'YYYY/MM/DD HH:MM:SS' 형식으로 반환
  };

  // 예약 일시 포맷 (년.월.일 시:분:초)
  const formatDate2 = (isoDateString) => {
    const date = new Date(isoDateString);
    return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours() + 9).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
  };



  return (
    <div>
      <div className="main-contents">

        <div className="reserve-status-container">
          <div className="left">승인 상태</div>
          <div className="left">{reservationDetail.reservationStatus}</div>
          <select className="right">
            <option value="vip">어찌고</option>
            <option value="vip">저찌고</option>
          </select>
        </div>




        <div className="flex-container">
          {/* 예약자 정보 */}
          <table className="reserve-table">
            <tbody>
              <tr>
                <th colSpan="2">예약자 정보</th>
              </tr>
              <tr>
                <th>이름</th>
                <td>{userInfo.userName}</td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>{userInfo.userPhonenum}</td>
              </tr>
            </tbody>
          </table>

          {/* 예약 날짜 */}
          <table className="reserve-table">
            <tbody>
              <tr>
                <th colSpan="2">예약 날짜</th>
              </tr>
              <tr>
                <th>날짜</th>
                <td>{formatDate2(reservationDetail.regTime)} </td>
              </tr>
              <tr>
                <th>시간</th>
                <td>{(reservationDetail.reservationTime || '정보 없음').slice(0, 5)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결제 정보 */}
        <table className="reserve-table">
          <tbody>
            <tr>
              <th colSpan="2">결제 정보</th>
            </tr>
            {paymentInfo.length > 0 && paymentInfo.map((payment, index) => (
              <tr key={index}>
                <th>결제 일시</th>
                <td>{formatDate1(payment.paymentDate)}</td>
              </tr>
            ))}
            {paymentInfo.length > 0 && paymentInfo.map((payment, index) => (
              <tr key={index}>
                <th>결제 수단</th>
                <td>{payment.paymentMethod}</td>
              </tr>
            ))}
            {paymentInfo.length > 0 && paymentInfo.map((payment, index) => (
              <tr key={index}>
                <th>결제 상태</th>
                <td>{payment.paymentStatus}</td>
              </tr>
            ))}
            {paymentInfo.length > 0 && paymentInfo.map((payment, index) => (
              <tr key={index}>
                <th>결제 금액</th>
                <td>{payment.paymentAmount.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 예약 정보 */}
        <table className="reserve-table">
          <tbody>
            <tr>
              <th colSpan="6">예약 정보</th>
            </tr>
            {/* 대분류 이름과 가격 출력 */}
            {reservationList.map((item, index) => {
              const isFirstInGroup = index === 0 || reservationList[index - 1].mainCategoryName !== item.mainCategoryName;
              return (
                <React.Fragment key={index}>
                  {isFirstInGroup && (
                    <tr>
                      <th colSpan="5">{item.mainCategoryName}</th>
                      <td colSpan="1">{item.mainPrice}원</td>
                    </tr>
                  )}
                  {/* 서브카테고리 출력 */}
                  <tr>
                    <th colSpan="2">{item.middleCategoryName}</th>
                    <td colSpan="3">{item.subCategoryName}</td>
                    <td colSpan="1">{item.subPrice}원</td>
                  </tr>
                </React.Fragment>
              );
            })}
            {/* 요청사항 및 총액 */}
            <tr>
              <th colSpan="2">요청사항</th>
              <td colSpan="4">{reservationDetail.customerRequest || '없음'}</td>
            </tr>
            <tr>
              <th colSpan="5">총액</th>
              {paymentInfo.length > 0 && paymentInfo.map((payment, index) => (
                <td colSpan="1" key={index}>{payment.paymentAmount.toLocaleString()} 원</td>
              ))}
            </tr>
          </tbody>
        </table>




      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminReserveManageDetail />
);
