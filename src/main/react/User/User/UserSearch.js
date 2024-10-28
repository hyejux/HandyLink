import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom/client";
import useKakaoLoader from '../Payment/useKakaoLoader';
import './UserSearch.css';

function UserSearch() {
  const [store, setStore] = useState([]);
  const [distances, setDistances] = useState({});
  const [currentPosition, setCurrentPosition] = useState(null);
  const [level1Categories, setLevel1Categories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어 입력 핸들러
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 검색 URL 생성 함수
  const generateSearchUrl = (term) => {
    return `/userSearchResult.user?searchTerm=${encodeURIComponent(term)}`;
  };


  // 검색 버튼 클릭 시 검색어를 쿼리 파라미터로 전달하며 페이지 이동
  const handleSearch = () => {
    if (searchTerm) {
      window.location.href = generateSearchUrl(searchTerm);
    }
  };

  // 추천 해시태그, 카테고리 배너 클릭 시 즉시 검색 실행
  const handleHashtagClick = (serviceName) => {
    window.location.href = generateSearchUrl(serviceName);
  };

  // 각 섹션마다 다른 ref를 사용
  const storeListRef1 = useRef(null);
  const storeListRef2 = useRef(null);

  const btnLeftStoreRef1 = useRef(null);
  const btnLeftStoreRef2 = useRef(null);
  const btnRightStoreRef1 = useRef(null);
  const btnRightStoreRef2 = useRef(null);

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
  }, [store]);


  // Kakao Maps API 로드
  useKakaoLoader();

  useEffect(() => {
    // 데이터 fetch
    fetch('/getStoreInfo')
      .then((response) => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return response.json();
      })
      .then((data) => {
        const activeStores = data.filter((store) => store.storeStatus === '활성화');
        setStore(activeStores);
        console.log('활성화된 업체 목록:', activeStores);
      })
      .catch((error) => console.error('업체 목록을 가져오는 중 오류 발생:', error));
  }, []);
  
  useEffect(() => {
    fetch('/userSearch/categories/level1')
      .then((response) => {
        if (!response.ok) {
          throw new Error('카테고리를 가져오는 중 오류 발생');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const formattedData = data.map(([serviceName, storeNo, servicePrice]) => ({
          serviceName,
          storeNo,
          servicePrice, // servicePrice 추가
        }));
        setLevel1Categories(formattedData);
      })
      .catch((error) => console.error('카테고리를 가져오는 중 오류 발생:', error));
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

        // storeAddr 파싱 (storeAddr를 직접 사용)
        const addrOnly = storeAddr; // 주소를 직접 사용

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
        getStoreDistance(store.addr); // addr 필드를 사용하여 거리 계산
      });
    }
  }, [store, currentPosition]);


  const ads = ['./img/event1.jpg', './img/event4.jpg', './img/event2.jpg', './img/event3.jpg', './img/event4.jpg'];


  return (
    <div className="user-main-container">

      <div className="search-top">
        <div className='left'>검색</div>
        <div className='right'><i className="bi bi-bell-fill"></i></div>
      </div>

      <div className="store-search-bar">
        <button className="search-btn" onClick={handleSearch}><i className="bi bi-search"></i></button>
        <input type="text" placeholder="찾으시는 가게가 있나요?" value={searchTerm} onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }} />
      </div>

      {/* 카테고리 배너 */}
      <div className="user-search-content">
        <button className="nav-button left" ref={btnLeftStoreRef1} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" ref={btnRightStoreRef1} aria-label="오른쪽으로 이동">›</button>

        <div className="list-header">어떤 가게를 찾으세요?</div>
        <div className="user-main-list-wrap store-cate-list" ref={storeListRef1}>
          {ads.map((image, index) => (
            <div className="user-main-list-container event-container" key={index}>
              <div className="user-category-menu" onClick={() => handleHashtagClick(store[index]?.storeCate)}>
                <div className="user-category-menu-img">
                  <img src={image} alt={`카테고리 배너 ${index + 1}`} />
                  <div className="store-category-name">{store[index]?.storeCate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 추천 해시태그 */}
      <div className='"user-search-content' ref={storeListRef2}>
        <button className="nav-button left" ref={btnLeftStoreRef2} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" ref={btnRightStoreRef2} aria-label="오른쪽으로 이동">›</button>

        <div className="list-header">추천 해시태그</div>
        <div className="user-hashtag-list-wrap">
          <div className="user-hashtag-list">
            {level1Categories.map((category, index) => (
              <button type="button" className="btn-hashtag" key={index} onClick={() => handleHashtagClick(category.serviceName)}>
                <i className="bi bi-hash"></i> {category.serviceName}
              </button>
            ))}
          </div>

        </div>
      </div>


      {/* 이 달 인기가게 */}
      <div className="user-hit-search-list">
        <h4> <img src='/img/icon-fire.png' /> 10월 인기 가게</h4>
        <ol className="store-list">
          {store.map((store, index) => (
            <li key={store.storeId}> {/* 여기에 key 추가 */}
              {index + 1} <a href={`/userStoreDetail.user/${store.storeNo}`}>{store.storeName}</a>
            </li>
          ))}
        </ol>
      </div>



    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<UserSearch />);
