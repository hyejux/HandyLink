import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom/client";
import useKakaoLoader from '../Payment/useKakaoLoader';
import './UserMain.css';

function UserMain() {
  const [store, setStore] = useState([]);
  const [distances, setDistances] = useState({});
  const [currentPosition, setCurrentPosition] = useState(null);
  const [visibleCount, setVisibleCount] = useState(2); // 가게 표시 개수 상태
  const LOAD_MORE_COUNT = 1; // 더 볼 가게 수

  // 각 섹션마다 다른 ref를 사용
  const storeListRef1 = useRef(null);
  const storeListRef2 = useRef(null);
  const storeListRef3 = useRef(null);
  const storeListRef4 = useRef(null);

  const btnLeftStoreRef1 = useRef(null);
  const btnLeftStoreRef2 = useRef(null);
  const btnLeftStoreRef3 = useRef(null);
  const btnLeftStoreRef4 = useRef(null);
  const btnRightStoreRef1 = useRef(null);
  const btnRightStoreRef2 = useRef(null);
  const btnRightStoreRef3 = useRef(null);
  const btnRightStoreRef4 = useRef(null);

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
    setupScrollControls(storeListRef4.current, btnLeftStoreRef4.current, btnRightStoreRef4.current);
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
              [storeAddr]: distance.toFixed(2),
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


  const handleLoadMore = () => {
    if (visibleCount >= store.length) {
      alert("마지막 가게 입니다.");
    } else {
      setVisibleCount((prevCount) => prevCount + LOAD_MORE_COUNT); // 상수로 증가
    }
  };

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const totalAds = 5; // 광고 배너의 개수
  const ads = ['./img/event1.jpg', './img/event4.jpg', './img/event2.jpg', './img/event3.jpg', './img/event4.jpg'];


  const handlePrev = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex === 0 ? totalAds - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex === totalAds - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const listWrap = storeListRef4.current;

    // 광고 배너 인덱스에 맞춰 스크롤 위치를 설정
    const scrollToCurrentAd = () => {
      const scrollAmount = listWrap.clientWidth * currentAdIndex;
      listWrap.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    };

    scrollToCurrentAd();
  }, [currentAdIndex]);


  const goToStoreDetail = (id) =>{
    window.location.href = `/userStoreDetail.user/${id}`;
  }


  return (
    <div>
       <div className="user-main-content2">

     
      <div className="user-top-nav">
        <logo className="logo">gd</logo>
        <div className="store-search-bar">
        <i className="bi bi-search"></i>
        <input type="text" placeholder="찾으시는 가게가 있나요?" />
      </div>
      </div>

      

      <div className="user-main-content2">
      {/* 가게 카테고리 */}
      <div className="user-category-content">
        <div className="user-category-item">
          <img src="./img/free-icon-fruits-7416631.png" alt="레터링케이크" />
          <p>레터링케이크</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-makeup-5732023.png" alt="도자기" />
          <p>도자기</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-flower-bouquet-7359059.png" alt="꽃선물" />
          <p>꽃선물</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-strawberry-cake-9997743.png" alt="주문제작" />
          <p>주문제작</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-donut-3272772.png" alt="케이크" />
          <p>케이크</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-fruits-7416631.png" alt="레터링케이크" />
          <p>레터링케이크</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-makeup-5732023.png" alt="도자기" />
          <p>도자기</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-flower-bouquet-7359059.png" alt="꽃선물" />
          <p>꽃선물</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-strawberry-cake-9997743.png" alt="주문제작" />
          <p>주문제작</p>
        </div>
        <div className="user-category-item">
          <img src="./img/free-icon-donut-3272772.png" alt="케이크" />
          <p>케이크</p>
        </div>
      </div>

      {/* 위치 카테고리 */}
      <h3>어디로 가시나요?</h3>
      <div className="user-location-content">
        <div className="user-location-item">내주변</div>
        <div className="user-location-item">압구정 청담</div>
        <div className="user-location-item">부산</div>
        <div className="user-location-item">잠실 송파</div>
        <div className="user-location-item">이태원 한남</div>
        <div className="user-location-item">성수</div>
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
                <div className="user-main-list-container" key={store.storeNo} onClick={() => goToStoreDetail(store.storeNo)}> 
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
                <div className="user-main-list-container" key={store.storeNo} onClick={() => goToStoreDetail(store.storeNo)}>
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
                <div className="user-main-list-container" key={store.storeNo} onClick={() => goToStoreDetail(store.storeNo)}>
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



      <div className="user-main-list-wrap3-header">
        <h3>배고파죽겠어요 님을 위한 추천 가게</h3>
      </div>

      <div className="user-main-list-wrap3">
        {store.length > 0 ? (
          store.slice(0, visibleCount).map((store) => {
            const imageUrls = parseImageUrl(store.imageUrl);
            const imageUrl = imageUrls.length > 0 ? imageUrls[0] : "../img3.jpg";
            const storeDistance = distances[store.storeAddr] ? formatDistance(distances[store.storeAddr]) : '정보 없음';

            return (
              <div className="user-main-list-sub-content" key={store.storeNo}>
                <i className="bi bi-heart"></i>
                <div className="sub-content-img-box">
                  <img src={imageUrl} alt={store.storeName} />
                </div>

                <div className="sub-content-top">
                  <div className="sub-content-container">
                    <div className="sub-content-title">{store.storeName}</div>
                    <div className="sub-content-category">{store.storeCategory || '미등록'}</div>
                  </div>
                  <div className="sub-content-date">
                    {/* <img src="/icon/free-icon-font-clock-five-7602662.png" alt="시계" /> */} 영업시간: {store.storeStartTime} - {store.storeCloseTime}
                  </div>
                </div>

                <div className="sub-content-mid">
                  <div className="sub-content-review">
                    ⭐<span>{store.reviewRating || '4.8'}</span>
                    <span>({store.reviewCount || '10,959'})</span>
                  </div>
                  <div className="sub-content-location">
                    {/* <img src="/icon/free-icon-font-marker-3916862.png" alt="위치" /> */} 현재 위치에서 {storeDistance}
                  </div>
                </div>

                <div className="sub-content-bottom">
                  <div className="sub-content-price">₩ {store.price || '12,000'} ~ </div>
                  <div className="sub-content-option-container">
                    {store.tags && store.tags.map((tag, index) => (
                      <React.Fragment key={index}>
                        {/* <img src="/icon/free-icon-font-hastag-5068648.png" alt="" /> */}
                        <span className="sub-content-option">{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-stores">정보를 불러오지 못 했습니다 😭</div>
        )}
      </div>

      <div className='load-more-btn-wrap'>
        <button onClick={handleLoadMore} className="load-more-btn">추천 가게 더 보기</button>
      </div>



      {/* 광고 배너 */}
      <div className="user-main-content last-content">
        <button className="nav-button left" onClick={handlePrev} ref={btnLeftStoreRef4} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" onClick={handleNext} ref={btnRightStoreRef4} aria-label="오른쪽으로 이동">›</button>
        <h3>광고</h3>

        {/* 광고 리스트 */}
        <div className="user-main-list-wrap" ref={storeListRef4}>
          {ads.map((image, index) => (
            <div
              className="user-main-list-container event-container"
              key={index}
            >
              <div className="user-category-menu">
                <div className="user-category-menu-img event-img">
                  <img src={image} alt={`광고 배너 ${index + 1}`} />
                </div>
                <div className="ad-title">특가 상품 안내</div>
                <div className="ad-description">
                  <span>50% 할인 중!</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 인디케이터 */}
        <div className="ad-indicator-container">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`ad-indicator ${index === currentAdIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>




    </div>
    </div>
    </div>

    
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<UserMain />);
