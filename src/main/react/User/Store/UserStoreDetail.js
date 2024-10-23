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
  const goToAdminPage = (id) => {
    sessionStorage.setItem('storeCloseTime',storeInfo.storeCloseTime);
    sessionStorage.setItem('storeOpenTime', storeInfo.storeOpenTime);
    window.location.href = `/UserReservationDate.user/${id}`;
  };

  const [cateId, setCateId] = useState(0);
  const [reservationList, setReservationList] = useState([]);
  const [storeInfo, setStoreInfo] = useState([]);
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
            <button type="button" onClick={() => setActiveSection('info')}>문의</button>
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
            </div>
          )}


          {/* 예약 */}
          {activeSection === 'reservation' && (
            <>
              {reservationList.map((value, index) => (
                <div className="user-content-container" key={index} onClick={() => goToAdminPage(value.categoryId)}>
                  <div className="user-reserve-menu">
                    <div className="user-reserve-menu-img">
                    <img src={`${value.imageUrl}`} alt="My Image" />

                    </div>
                    <div className="user-reserve-menu-content">
                      <div>{value.serviceName}</div>
                      <div>{value.serviceContent}</div>
                      <div>{value.servicePrice} 원 ~</div>
                    </div>
                  </div>
                </div>
              ))}
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

