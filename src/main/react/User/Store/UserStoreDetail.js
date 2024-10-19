import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import "./UserStoreDetail.css";

function UserStoreDetail() {

  const [reservationList, setReservationList] = useState([]);

  useEffect(() => {
    axios.post('/UserStoreDetail/getStoreMainCategory',{StoreId : 'bbb123'})
      .then(response => {
        console.log(response.data);
        setReservationList(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });
  }, []);

  const goToAdminPage = (id) => {
    window.location.href = `/UserReservationDate.user/${id}`;
  };





  const [activeSection, setActiveSection] = useState('home'); 

  return (
    <div>
      <div className="user-main-container">
        <div className="user-top-nav">
          <div className="user-top-btns">
            <button type="button"> &lt; </button>
            <div className="logo">HandyLink</div>
            <button type="button"> &gt; </button>
          </div>
        </div>

        <div className="user-main-content">
          <div className="user-content-first">
            <div className="user-content-first-img">
              {/* 이미지 부분에 필요한 경우 src 설정 */}
             <img src="/img/store001.jpeg" alt="가게 이미지" width="100%" height="300px" />
            </div>
            <div className="user-content-first-img-num"></div>

            <div className="user-content-first-content">
              <div className="store-name">
                <div>팬케이크샵 가로수길점</div>
                <button type="button"><i className="bi bi-star"></i></button>
              </div>
              <div><i className="bi bi-shop"></i> 서울 강남구 강남대로162길 21 1층 </div>
              <hr />
              <div><i className="bi bi-alarm-fill"></i> 09:00 ~ 21:00 </div>
              <div><i className="bi bi-telephone-fill"></i> 070 - 1236 -7897</div>
            </div>
          </div>

          <div className="store-detail-menu">
            <button type="button" onClick={() => setActiveSection('home')}>홈</button>
            <button type="button" onClick={() => setActiveSection('info')}>정보</button>
            <button type="button" onClick={() => setActiveSection('reservation')}>예약</button>
            <button type="button" onClick={() => setActiveSection('review')}>리뷰</button>
          </div>

          {/* Section 1: Store Information */}
          {activeSection === 'home' && (
            <div>

              <div className="user-content-container">
              <div>
                매장정보 자세히 뿌려줌
              </div>
            </div>
            
            <div className="user-content-container">
              <div>
                <i className="bi bi-emoji-smile"></i> 팬케이크샵 가로수길점
              </div>
              <div>
                안녕하세요 팬케이크샵입니다 팬케이크 반죽, 버터 크림, 시럽 등은 엄선된 재료로 자체 제작하며 맛, 유통 기한, 위생 관리를 위해 매일 소량 생산 중으로 반죽이나 부재료 등이 품절될 수 있는 점 양해 부탁드립니다 항상 팬케이크처럼 달콤한 일들만 가득하시길 바라요!
              </div>
            </div>
            </div>
          )}

          {/* Section 2: Reservation List */}
          {activeSection === 'reservation' && (
            <>
              {reservationList.map((value, index) => (
                <div className="user-content-container" key={index} onClick={() => goToAdminPage(value.categoryId)}>
                  <div className="user-reserve-menu">
                    <div className="user-reserve-menu-img">
                      <img src="/img/user_basic_profile.jpg" alt="Profile" />
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
