import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import "./UserStoreDetail.css";

function UserStoreDetail() {

  const [activeSection, setActiveSection] = useState('home');
  const [cateId, setCateId] = useState(0);
  const [reservationList, setReservationList] = useState([]);
  const [storeInfo, setStoreInfo] = useState([]);

  const goToAdminPage = (id) => {
    sessionStorage.setItem('storeCloseTime', storeInfo.storeCloseTime);
    sessionStorage.setItem('storeOpenTime', storeInfo.storeOpenTime);
    sessionStorage.setItem('storeNo', storeInfo.storeNo);
    sessionStorage.setItem('storeInfo', JSON.stringify(storeInfo));
    window.location.href = `/UserReservationDate.user/${id}`;
  };

  // ------------------------------------------------------

  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const categoryId = pathSegments[pathSegments.length - 1];
    setCateId(categoryId);

    axios.get(`/UserStoreDetail/getStoreMainCategory/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setReservationList(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });
    axios.get(`/UserStoreDetail/getStoreInfo/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setStoreInfo(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });


    // categoryId  << 로 요청 보내서 가게 정보 값  가져오세요 !

  }, []);

  // const formatServiceStartDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hours = String(date.getHours()).padStart(2, '0');

  //   return `${year}/${month}/${day} ${hours}시 `;
  // };

  // ------------------------------------------------------


  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (storeInfo && storeInfo.storeImg && storeInfo.storeImg.length > 0) {
      const totalSlides = storeInfo.storeImg.length;

      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000); // 3초마다 슬라이드 변경

      return () => clearInterval(slideInterval); // 컴포넌트 언마운트 시 클리어
    }
  }, [storeInfo]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storeInfo.storeImg.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storeInfo.storeImg.length) % storeInfo.storeImg.length);
  };

  // 남은 시간을 계산하는 함수
  const calculateRemainingTime = (serviceStart) => {
    const serviceStartDate = new Date(serviceStart);
    const today = new Date();


    // 두 날짜 간의 차이 계산
    const timeDifference = serviceStartDate - today;

    // 남은 시간, 일, 시간, 분, 초 계산
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // 음수인 경우 0으로 설정
    return {
      days: Math.max(days, 0),
      hours: Math.max(hours, 0),
      minutes: Math.max(minutes, 0),
      seconds: Math.max(seconds, 0),
    };
  };


  // // 날짜 포맷 변환 함수
  // const convertDateFormat2 = (dateString, format) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hours = String(date.getHours()).padStart(2, '0');
  //   const minutes = String(date.getMinutes()).padStart(2, '0');

  //   switch (format) {
  //     case 'YYYY/MM/DD':
  //       return `${year}/${month}/${day}`;
  //     case 'DD-MM-YYYY':
  //       return `${day}-${month}-${year}`;
  //     case 'MM-DD-YYYY':
  //       return `${month}-${day}-${year}`;
  //     case 'YYYY/MM/DD HH:mm':
  //       return `${year}/${month}/${day} ${hours}:${minutes}`; // 연/월/일 시:분
  //     default:
  //       return dateString; // 기본적으로 원본 반환
  //   }
  // };

  const calculateDaysUntilServiceStart = (serviceStart) => {
    const serviceStartDate = new Date(serviceStart);
    const today = new Date();

    // 오늘 날짜의 시간을 00:00:00으로 설정
    today.setHours(0, 0, 0, 0);

    // 두 날짜 간의 차이 계산
    const timeDifference = serviceStartDate - today;

    // 차이를 일로 변환
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // 음수인 경우 0으로 설정
    return Math.max(daysDifference, 0);
  };

  // const convertDateFormat = (dateString, format) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');

  //   switch (format) {
  //     case 'YYYY/MM/DD':
  //       return `${year}/${month}/${day}`;
  //     case 'DD-MM-YYYY':
  //       return `${day}-${month}-${year}`;
  //     case 'MM-DD-YYYY':
  //       return `${month}-${day}-${year}`;
  //     default:
  //       return dateString; // 기본적으로 원본 반환
  //   }
  // };

  // --------------------------------------------------------- 소식

  
const [noticeList, setNoticeList] = useState([]);

useEffect(() => {
        axios.get('/adminStore/getNoticeList')
            .then(response => {
                console.log(response.data);
                setNoticeList(response.data);
            })
            .catch(error => {
                console.log('Error Category', error);
            });
    }, [])

 // 각 공지의 토글 상태를 저장하는 상태 (행별로 관리)
 const [expandedRows, setExpandedRows] = useState([]);

 // 특정 행을 클릭했을 때 해당 행의 상세 내용을 표시하도록 토글
 const handleToggleRow = (index) => {
   if (expandedRows.includes(index)) {
     setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
   } else {
     setExpandedRows([...expandedRows, index]);
   }
 };






  return (
    <div>
      <div className="user-main-container">
        <div className="user-top-nav">
          <i className="bi bi-arrow-left"></i>
          <logo className="logo"> 상단바 고민중 </logo>
        </div>

        <div className="user-main-content">
          <div className="user-content-first">
            <div className="user-content-first-img">
              {storeInfo && storeInfo.storeImg && storeInfo.storeImg.length > 0 ? (
                <>
                  <div className="slides">
                    {storeInfo.storeImg.map((store, index) => (
                      <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                      >
                        <img src={store.storeImgLocation} alt="가게 이미지" width="100%" height="300px" />
                      </div>
                    ))}
                  </div>
                  <button onClick={handlePrevSlide} className="slide-button prev-button">❮</button>
                  <button onClick={handleNextSlide} className="slide-button next-button">❯</button>
                </>
              ) : (
                <p>이미지를 불러올 수 없습니다.</p>
              )}
            </div>
            <div className="user-content-first-img-num"></div>

            <div className="user-content-first-content">
              <div className="store-name">
                <div>{storeInfo.storeName}</div>
                <button type="button"><i className="bi bi-star"></i></button>
              </div>
              <div><i className="bi bi-shop"></i> {storeInfo.addr}   {storeInfo.addrdetail} </div>
              <hr />
              <div><i className="bi bi-alarm-fill"></i> {storeInfo.storeOpenTime} ~ {storeInfo.storeCloseTime}</div>
              <div><i className="bi bi-telephone-fill"></i> {storeInfo.managerPhone}</div>
            </div>
          </div>

          <div className="store-detail-menu">
            <button type="button" onClick={() => setActiveSection('home')}>홈</button>
            <button type="button" onClick={() => setActiveSection('info')}>소식</button>
            <button type="button" onClick={() => setActiveSection('reservation')}>예약</button>
            <button type="button" onClick={() => setActiveSection('review')}>리뷰</button>
          </div>

          {/* 홈 */}
          {activeSection === 'home' && (
            <div>

              <div className="user-content-container">
                <div>

                </div>
              </div>

              <div className="user-content-container">
                <div>
                  <i className="bi bi-emoji-smile"></i>{storeInfo.storeName}
                </div>
                <div>

                </div>
              </div>

              <div className="user-content-container">
              {noticeList.map((notice, index) => (
               <ul key={index} style={{listStyle:'none'}}>
                <li> <i class="bi bi-bell"></i> {notice.noticeType}  | {notice.noticeContent.slice(0, 20)}...</li>
                </ul>             
                ))}
            </div>

            </div>
          )}


  

           {activeSection === 'info' && (

              <div>
              {noticeList.map((notice, index) => (
                 <React.Fragment key={index}>
                  <div key={index} className="user-content-container">
                  <i class="bi bi-chevron-down" style={{float:'right'}} onClick={() => handleToggleRow(index)}></i>
                  {expandedRows.includes(index) ? (
                            <div>
                                {/* 확장된 내용을 표시 */}
                                <div className="expanded-content">
                                    <p>카테고리: {notice.noticeType}</p>
                                    <p>소식 내용: {notice.noticeContent}</p>
                                    <p>등록일: {notice.noticeRegdate}</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* 기본 내용, 확장되지 않았을 때 보이는 부분 */}
                                <div>{notice.noticeType}</div>
                                <div>{notice.noticeContent.slice(0, 50)}...</div>
                                <div>{notice.noticeRegdate}</div>
                            </div>
                        )}
                  </div>
                    
                </React.Fragment>
              ))}
             
              </div>

           )}

          {/* 예약 */}
          {activeSection === 'reservation' && (
            <>
              {reservationList.map((value, index) => {
                const remainingTime = calculateRemainingTime(value.serviceStart);
                // const formattedDate = convertDateFormat(serviceStart, 'YYYY/MM/DD HH:mm');
                const daysUntilServiceStart = calculateDaysUntilServiceStart(value.serviceStart);
                const serviceStartDate = new Date(value.serviceStart);
                const isServiceStarted = serviceStartDate <= new Date(); // 현재 시간이 시작일보다 큰지 체크

                return (
                  <div
                    className={`user-content-container ${isServiceStarted ? '' : 'disabled'}`}
                    key={index}
                    onClick={() => {
                      if (isServiceStarted) {
                        goToAdminPage(value.categoryId);
                      }
                    }}
                  >
                    <div className="user-reserve-menu">
                      <div className="user-reserve-menu-img">
                        <img src={`${value.imageUrl}`} alt="My Image" />
                      </div>
                      <div className="user-reserve-menu-content">
                        {/* 남은 일수 계산 및 표시 */}
                        {remainingTime.days !== 0 && remainingTime.hours !== 0 && remainingTime.minutes !== 0 && remainingTime.seconds !== 0 && (
                          <> 남은 시간: {remainingTime.days}일 {remainingTime.hours}시간 {remainingTime.minutes}분 {remainingTime.seconds}초
                            (실시간 반영할 예정)</>
                        )}
                        {/* 오픈까지 {daysUntilServiceStart}일 남음 ( {formatServiceStartDate(value.serviceStart)} ) */}
                        <div>{value.serviceName}</div>
                        <div>{value.serviceContent}</div>
                        <div>{value.servicePrice} 원 ~</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}


            {/* 리뷰 */}
            {activeSection === 'review' && (
            <>

            리뷰 페이지 이다...
            </>
          )}


        </div>
      </div>
    </div>
  );
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UserStoreDetail />
);

