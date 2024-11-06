import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useEffect } from 'react';
import './AdminMain.css';

function AdminMain() {
  const storeId = sessionStorage.getItem('storeId');
  const storeNo = sessionStorage.getItem('storeNo');

  const events = [
    { title: '예약 1', date: '2024-11-10' },
    { title: '예약 23', date: '2024-11-10' },
    { title: '예약 2', date: '2024-11-15' },
  ]; //달력게 띄울 예약 건

  const [count, setCount] = useState({}); //운영현황
  const [selectedDate, setSelectedDate] = useState(''); //검색할 날짜 받기
  const [reservationNo, setReservationNo] = useState([]); //해당날짜 예약번호
  const [customerBookInfo, setCustomerBookInfo] = useState([]); //해당 날짜 예약자정보
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null); //클릭한 예약자정보

  useEffect(()=>{
    const fetchCount = async() => {
      const resp = await axios.get(`/adminStore/getMainCount?storeNo=${storeNo}`);
      setCount(resp.data);
    };

    fetchCount();
  },[]);

  //날짜 받기
  const handleChangeDate = (e) => {
    const {value} = e.target;
    setSelectedDate(value);
  };

  //날짜별 예약정보 보기
  const handleClickBook = async() => {
    const reservationSlotDate = selectedDate;
    try {
      const resp = await axios.get(`/adminStore/getReservationNo?storeNo=${storeNo}&reservationSlotDate=${reservationSlotDate}`);
      const reservationNo = resp.data;
      setReservationNo(reservationNo);

      if (Array.isArray(reservationNo) && reservationNo.length > 0) {
        const response = await axios.get('/adminStore/getTodayCustomer', {
          params: {
            reservationNo: reservationNo.join(',') // Convert array to comma-separated string
          }
        });
        setCustomerBookInfo(response?.data || []); // Optional chaining and fallback to empty array
      }else{
        setCustomerBookInfo([]);
      }
    }catch (error){
      console.error("해당날짜 예약정보 부르는 중 error ", error);
    }
  };

  //개별 예약정보 보기
  const handleChangeRadio = (e) => {
    const selectedReservationNo = e.target.value; // 예약 번호 (문자열일 수 있음)
    console.log("이거 예약번호", selectedReservationNo);

    // 예약 번호를 기준으로 예약자 정보를 찾음
    const selectedCustomer = customerBookInfo.find(customer => {
      return customer.reservationNo.toString() === selectedReservationNo;//문자열 비교
    });

    setSelectedCustomerInfo(selectedCustomer || null);
  };

  console.log("클릭한 예약자 ",selectedCustomerInfo);




  return(
  <div className="admin-store-regist-container">
    <div className="container">
      <div className="operation-status">
        <h3><i className="bi bi-bar-chart-line-fill"></i>운영 현황</h3>
        <div className="status-container">
          <div className="status-item">
            <p>{count.waitCount}</p> <p className="new">New</p>
          </div>
          <div className="status-item">
            <p>{count.cancledCount}</p> <p className="cancle">예약취소</p>
          </div>
          <div className="status-item">
            <p>5</p> <p className="chat">채팅문의</p>
          </div>
        </div>
      </div>

      <div className="operation-status">
        <div className="calendar">
          <div className="calendar-header">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="ko" // 한글로 설정
              events={events}
              dayCellContent={(arg) => (
                <div style={{ padding: '10px' }}>
                  <span>{arg.dayNumberText}</span>
                </div>
              )}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="auto" // 여유 공간을 위한 높이 조정
              contentHeight="auto"
            />
          </div>
        </div>
      </div>

      <div className="operation-status today-customer">
        <div className="customer-reservation-check">
          <div className="today-booking2">
            <h3><i className="bi bi-shop-window"></i>Today 예약</h3>
            <div className="date-search-box">
              <input type="date" value={selectedDate} onChange={handleChangeDate}/>
              <button type="button" className="btn today" onClick={handleClickBook}>예약보기</button>
            </div>

            <div className="table-wrapper2">
              <table>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>예약시간</th>
                    <th>보기</th>
                  </tr>
                </thead>
                <tbody>
                  {customerBookInfo.length > 0 ? (
                      customerBookInfo.map((customer, index)=>(
                          <tr key={index}>
                            <td>{customer.userName}</td>
                            <td>{customer.reservationTime}</td>
                            <td><input type="radio" name="reservation" value={customer.reservationNo} onChange={handleChangeRadio}/></td>
                          </tr>
                      ))
                  ) : (
                        <tr>
                          <td colSpan="3">예약정보가 없습니다.</td>
                        </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="customer-info-container">
            <h3>예약 정보</h3>
            <div className="customer-info">
              <div className="customer-detail">
                <div className="customer-group">
                  <label>예약자</label>
                  <div>  <input type="text" value={selectedCustomerInfo?.userName || ''} disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>연락처</label>
                  <div> <input type="text" value={selectedCustomerInfo?.userPhoneNum || ''} disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>방문시간</label>
                  <div> <input type="text" value={selectedCustomerInfo?.reservationTime || ''} disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>결제방식</label>
                  <div> <input type="text" value={selectedCustomerInfo?.paymentMethod || ''} disabled/> </div>
                </div>
                <div className="customer-group">
                  <label>결제금액</label>
                  <div> <input type="text" value={selectedCustomerInfo?.paymentAmount || ''} disabled/> </div>
                </div>
              </div>

              <div className="customer-reservation">

                <div className="reservation-content">
                  <label>상품명</label>
                  <div>
                    <input type="text" value={selectedCustomerInfo?.options?.find(option => option.categoryLevel === '1')?.serviceName || ''} disabled/>
                  </div>
                </div>

                <div className="reservation-content">
                  <label>옵션</label>
                  <div className="reservation-option">

                    {/* 레벨 2 옵션과 그 하위 레벨 3 옵션을 묶어서 출력 */}
                    {selectedCustomerInfo?.options
                      ?.filter(option => option.categoryLevel === '2')
                      .map((level2Option) => (
                        <div className="option" key={level2Option.categoryId}>
                          <p>{level2Option.serviceName}</p>
                          {/* 레벨 2 하위에 해당하는 레벨 3 옵션 출력 */}
                          {selectedCustomerInfo?.options
                            ?.filter(option => option.parentCategoryId === level2Option.categoryId && (option.categoryLevel === '3' || option.categoryLevel === '0'))
                            .map((level3Option) => (
                              <div className="option-detail" key={level3Option.categoryId}>
                                <p>
                                {level3Option.categoryLevel === '3'
                                  ? level3Option.serviceName
                                  : level3Option.middleCategoryValue || '정보 없음'}
                                </p>
                              </div>
                          ))}
                        </div>
                    ))}

                  </div>
                </div>

                <div className="reservation-content">
                  <label>요청사항</label>
                  <div> <input type="text" value="모서리 둥글게 해주세요." disabled/> </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminMain />
);