import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom/client";
import './UserMain.css';

function UserMain() {
  const [store, setStore] = useState([]);

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

  const parseImageUrl = (urlString) => {
    return urlString.replace(/{|}/g, "").split(",").map(url => url.trim());
  };

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
          {store.length > 0 && store.map((store) => {
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
                  <div className="store-distance">내 위치에서 {store.storeDistance || '정보 없음'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 인기 서비스/트렌드 */}
      <div className="user-main-content">
        <button className="nav-button left" ref={btnLeftStoreRef2} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" ref={btnRightStoreRef2} aria-label="오른쪽으로 이동">›</button>
        <h3>인기 서비스/트렌드</h3>

        <div className="user-main-list-wrap" ref={storeListRef2}>
          {store.length > 0 && store.map((store) => {
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
          })}
        </div>
      </div>

      {/* 이벤트/할인  */}
      <div className="user-main-content last-content">
        <button className="nav-button left" ref={btnLeftStoreRef3} aria-label="왼쪽으로 이동">‹</button>
        <button className="nav-button right" ref={btnRightStoreRef3} aria-label="오른쪽으로 이동">›</button>
        <h3>이벤트/할인</h3>

        <div className="user-main-list-wrap" ref={storeListRef3}>
          {store.length > 0 && store.map((store) => {
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
          })}
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
