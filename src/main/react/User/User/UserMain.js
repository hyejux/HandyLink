import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import './UserMain.css';

function UserMain() {
  const [store, setStore] = useState([]);
  const [storeInfo, setStoreInfo] = useState([]);

  useEffect(() => {
    fetch('/store')
      .then((response) => response.json())
      .then((data) => {
        // 활성화된 가게만 필터링
        const activeStores = data.filter((store) => store.storeStatus === '활성화');
        setStore(activeStores);
        const infoPromises = activeStores.map((store) =>
          fetch(`/store/info/${store.storeId}`).then((response) => response.json())
        );
        Promise.all(infoPromises)
          .then((infoData) => setStoreInfo(infoData))
          .catch((error) => console.error('업체 정보를 가져오는 중 오류 발생:', error));
      })
      .catch((error) => console.error('업체 목록을 가져오는 중 오류 발생:', error));
  }, []);

  return (
    <div className="user-main">
      <header className="header">
        <h1>HandyLink!</h1>
        <div className="search-container">
          <input type="text" placeholder="찾으시는 가게가 있나요?" className="search-input" />
          <button className="search-button">검색</button>
        </div>
      </header>

      <section className="section">
        <h2>내 주변 가게</h2>
        <div className="store-list">
          {store.length > 0 && (
            store.map((store, index) => {
              const info = storeInfo[index] || {};
              return (
                <div className="store-card" key={store.storeId}>
                  <img src={info.image_url || "path/to/default-image.jpg"} alt={store.storeName} />
                  <h3>{store.storeName}</h3>
                  <p>{info.storeIntro || '소개가 없습니다.'}</p>
                  <p>{info.storeParkingYn === 'Y' ? '주차 가능' : '주차 불가'}</p>
                </div>
              );
            })
          )}
        </div>

      </section>

      <section className="section">
        <h2>인기 서비스/트렌드</h2>
        <div className="trend-list">
          <div className="trend-card">
            <img src="path/to/trend-image1.jpg" alt="트렌드1" />
            <h3>도미미</h3>
            <p>4.8점</p>
          </div>
          <div className="trend-card">
            <img src="path/to/trend-image2.jpg" alt="트렌드2" />
            <h3>주도헤어</h3>
            <p>4.1점</p>
          </div>
          <div className="trend-card">
            <img src="path/to/trend-image3.jpg" alt="트렌드3" />
            <h3>인손 공방</h3>
            <p>4.7점</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>이벤트/할인</h2>
        <div className="event-list">
          <div className="event-card">
            <h3>사이즈 오프 10% 할인</h3>
          </div>
          <div className="event-card">
            <h3>자유할인</h3>
          </div>
          <div className="event-card">
            <h3>아모르 프리미엄</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UserMain />);
