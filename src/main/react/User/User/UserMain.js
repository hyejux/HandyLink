import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom/client";
import useKakaoLoader from '../Payment/useKakaoLoader';
import './UserMain.css';

function UserMain() {
  const [store, setStore] = useState([]);
  const [distances, setDistances] = useState({});
  const [currentPosition, setCurrentPosition] = useState(null);

  // 각 섹션마다 다른 ref를 사용
  const storeListRef1 = useRef(null);
  const storeListRef2 = useRef(null);
  const storeListRef3 = useRef(null);

  const btnLeftStoreRef1 = useRef(null);
  const btnLeftStoreRef2 = useRef(null);
  const btnLeftStoreRef3 = useRef(null);
  const btnRightStoreRef1 = useRef(null);
  const btnRightStoreRef2 = useRef(null);
  const btnRightStoreRef3 = useRef(null);

  const setupScrollControls = (listWrap, btnLeft, btnRight) => {
    btnLeft.addEventListener('click', () => {
      listWrap.scrollBy({ left: -200, behavior: 'smooth' });
    });

    btnRight.addEventListener('click', () => {
      listWrap.scrollBy({ left: 200, behavior: 'smooth' });
    });

    listWrap.addEventListener('scroll', () => {
      updateButtonVisibility(listWrap, btnLeft, btnRight);
    });

    updateButtonVisibility(listWrap, btnLeft, btnRight);
  };

  const updateButtonVisibility = (list, leftBtn, rightBtn) => {
    const scrollLeft = list.scrollLeft;
    const maxScrollLeft = list.scrollWidth - list.clientWidth;

    leftBtn.style.display = scrollLeft <= 0 ? 'none' : 'block';
    rightBtn.style.display = scrollLeft >= maxScrollLeft ? 'none' : 'block';
  };

  useEffect(() => {
    // 각 섹션마다 스크롤 제어 설정
    setupScrollControls(storeListRef1.current, btnLeftStoreRef1.current, btnRightStoreRef1.current);
    setupScrollControls(storeListRef2.current, btnLeftStoreRef2.current, btnRightStoreRef2.current);
    setupScrollControls(storeListRef3.current, btnLeftStoreRef3.current, btnRightStoreRef3.current);
  }, [store]);



  // parseImageUrl 함수 정의
  const parseImageUrl = (urlString) => {
    return urlString.replace(/{|}/g, "").split(",").map(url => url.trim());
  };

  const parseJson = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("JSON 파싱 오류:", error);
      return {};
    }
  };


  // Kakao Maps API 로드
  useKakaoLoader();

  useEffect(() => {
    // 데이터 fetch
    fetch('/store')
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return response.json();
      })
      .then((data) => {
        const activeStores = data.filter((store) => store.storeStatus === '활성화');
        setStore(activeStores);
      })
      .catch((error) => console.error('업체 목록을 가져오는 중 오류 발생:', error));
  }, []);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation을 지원하지 않습니다.");
    }
  }, []);

  // Kakao Map API를 이용한 거리 계산 함수
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // 지구 반지름 (킬로미터 단위)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); // 거리 반환
  };

  // 거리 계산 및 geocoder 로드
  const getStoreDistance = (storeAddr) => {
    if (currentPosition) {
      if (window.kakao) {
        const geocoder = new kakao.maps.services.Geocoder();

        // storeAddr 파싱
        const addrInfo = parseJson(storeAddr);
        const addrOnly = addrInfo.addr; // addr 필드만 추출

        geocoder.addressSearch(addrOnly, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const storeLat = result[0].y;
            const storeLng = result[0].x;
            const distance = calculateDistance(
              currentPosition.lat,
              currentPosition.lng,
              storeLat,
              storeLng
            );
            setDistances((prevDistances) => ({
              ...prevDistances,
              [storeAddr]: distance.toFixed(2), // addr 또는 storeId로 거리 저장
            }));
          } else {
            console.error(`거리 계산 불가: ${addrOnly} - ${status}`);
          }
        });
      } else {
        console.log("Kakao 객체가 정의되지 않음");
      }
    } else {
      console.log("내 위치 확인 불가");
    }
  };


  useEffect(() => {
    // Kakao Maps API 로드 후 가게 거리 계산
    if (currentPosition && store.length > 0) {
      store.forEach(store => {
        getStoreDistance(store.storeAddr);
      });
    }
  }, [store, currentPosition]);

  // 거리 변환 함수
  const formatDistance = (distance) => {
    const km = parseFloat(distance); // 거리 값을 float로 변환
    if (km >= 1) {
      return `${km.toFixed(2)} km`;  // 1km 이상일 경우 km 단위
    } else {
      return `${(km * 1000).toFixed(0)} m`;  // 1km 미만일 경우 m 단위
    }
  };



  return (
    <div className="user-main-container">
      <div className="user-top-nav">
        <logo className="logo">HandyLink!</logo>
      </div>

      <div className="store-search-bar">
        <i className="bi bi-search"></i>
        <input type="text" placeholder="찾으시는 가게가 있나요?" />
      </div>

      {/* 내 주변 가게 */}
      <div className="user-main-content">
        <button className="nav-button left" ref={btnLeftStoreRef1} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" ref={btnRightStoreRef1} aria-label="오른쪽으로 이동">›</button>
        <h3>내 주변 가게</h3>

        <div className="user-main-list-wrap" ref={storeListRef1}>
          {store.length > 0 ? (
            store.map((store) => {
              const imageUrls = parseImageUrl(store.imageUrl);
              const imageUrl = imageUrls.length > 0 ? imageUrls[0] : "/img/cake001.jpg";

              return (
                <div className="user-main-list-container" key={store.storeId}>
                  <div className="user-category-menu">
                    <div className="user-category-menu-img">
                      <button className="button bookmark-btn" aria-label="북마크 추가"><i className="bi bi-heart"></i></button>
                      <img src={imageUrl} alt={store.storeName} />
                    </div>
                    <div className="store-title-1">{store.storeName}</div>
                    <div className="store-category"> {store.storeCategory || '미등록'}</div>
                    <div className="store-distance">내 위치에서 {distances[store.storeAddr] ? formatDistance(distances[store.storeAddr]) : '정보 없음'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-stores">정보를 불러오지 못 했습니다 😭</div>
          )}
        </div>
      </div>

      {/* 인기 서비스/트렌드 */}
      <div className="user-main-content">
        <button className="nav-button left" ref={btnLeftStoreRef2} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" ref={btnRightStoreRef2} aria-label="오른쪽으로 이동">›</button>
        <h3>인기 서비스/트렌드</h3>

        <div className="user-main-list-wrap" ref={storeListRef2}>
          {store.length > 0 ? (
            store.map((store) => {
              const imageUrls = parseImageUrl(store.imageUrl);
              const imageUrl = imageUrls.length > 0 ? imageUrls[0] : "/img/cake001.jpg";

              return (
                <div className="user-main-list-container" key={store.storeId}>
                  <div className="user-category-menu">
                    <div className="user-category-menu-img">
                      <button className="button bookmark-btn" aria-label="북마크 추가"><i className="bi bi-heart"></i></button>
                      <img src={imageUrl} alt={store.storeName} />
                    </div>
                    <div className="store-title-2">{store.storeName}</div>
                    <div className="store-review-option">
                      <span className="store-review">⭐4.8</span>
                      <span className="store-option"> {store.storeCategory || '미등록'}</span> •
                      <span className="store-option"> {store.storeCategory || '미등록'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-stores">정보를 불러오지 못 했습니다 😭</div>
          )}
        </div>
      </div>

      {/* 이벤트/할인 */}
      <div className="user-main-content last-content">
        <button className="nav-button left" ref={btnLeftStoreRef3} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" ref={btnRightStoreRef3} aria-label="오른쪽으로 이동">›</button>
        <h3>이벤트/할인</h3>

        <div className="user-main-list-wrap" ref={storeListRef3}>
          {store.length > 0 ? (
            store.map((store) => {
              const imageUrls = parseImageUrl(store.imageUrl);
              const imageUrl = imageUrls.length > 0 ? imageUrls[0] : "/img/cake001.jpg";

              return (
                <div className="user-main-list-container" key={store.storeId}>
                  <div className="user-category-menu">
                    <div className="user-category-menu-img">
                      <button className="button bookmark-btn" aria-label="북마크 추가"><i className="bi bi-heart"></i></button>
                      <img src={imageUrl} alt={store.storeName} />
                      <div className="event-box">이벤트</div>
                    </div>
                    <div className="store-title-2">{store.storeName}</div>
                    <div className="store-review-option">
                      <span className="store-review">⭐4.8</span>
                      <span className="store-option"> {store.storeCategory || '미등록'}</span> •
                      <span className="store-option"> {store.storeCategory || '미등록'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-stores">정보를 불러오지 못 했습니다 😭 </div>
          )}
        </div>


      </div>


      <footer className="user-bottom-nav">
        <a href="#"><span>메인</span></a>
        <a href="#"><span>검색</span></a>
        <a href="#"><span>예약</span></a>
        <a href="#"><span>문의</span></a>
        <a href="#"><span>MY</span></a>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<UserMain />);
