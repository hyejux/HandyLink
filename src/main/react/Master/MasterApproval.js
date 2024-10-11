import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './MasterApproval.css';

function MasterApproval() {
  const [store, setStore] = useState([]);
  const [storeInfo, setStoreInfo] = useState([]);
  const [filter, setFilter] = useState('전체');

  useEffect(() => {
    fetch('/store')
      .then((response) => response.json())
      .then((data) => {
        setStore(data);
        const infoPromises = data.map((store) =>
          fetch(`/store/info/${store.storeId}`).then((response) => response.json())
        );
        Promise.all(infoPromises)
          .then((infoData) => setStoreInfo(infoData))
          .catch((error) => console.error('가게 정보를 가져오는 중 오류 발생:', error));
      })
      .catch((error) => console.error('가게 목록을 가져오는 중 오류 발생:', error));
  }, []);

  // 상태 필터링
  const filteredStores = store.filter((store) => {
    if (filter === '대기') {
      return store.storeStatus === '대기';
    } else if (filter === '비활성화') {
      return store.storeStatus === '비활성화';
    } else if (filter === '전체') {
      return store.storeStatus === '대기' || store.storeStatus === '비활성화';
    }
    return true;
  });

  const handleApprove = (storeId, currentStatus) => {
    const confirmationMessage = currentStatus === '대기'
      ? "승인 하시겠습니까?"
      : "활성화 하시겠습니까?";

    if (window.confirm(confirmationMessage)) {
      fetch(`/store/${storeId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            alert(currentStatus === '대기' ? "승인이 완료되었습니다." : "가게가 활성화 되었습니다.");
            return fetch('/store');
          }
          throw new Error('가게 상태 업데이트에 실패했습니다.');
        })
        .then((response) => response.json())
        .then((data) => setStore(data))
        .catch((error) => {
          alert(currentStatus === '대기' ? "승인에 실패했습니다." : "활성화에 실패했습니다.");
          console.error('가게 상태 업데이트 중 오류 발생:', error);
        });
    }
  };

  return (
    <div>
      <div className="header-container">
        <h3>승인관리</h3>

        <div className="store-filter-container">
          <select id="store-status-select" onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="전체">전체</option>
            <option value="대기">대기</option>
            <option value="비활성화">비활성화</option>
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>가게 ID</th>
            <th>가게 이름</th>
            {/* <th>카테고리</th> */}
            <th>대표자</th>
            {/* <th>매니저 이름</th> */}
            {/* <th>매니저 전화</th> */}
            {/* <th>주소</th> */}
            <th>사업자 번호</th>
            <th>가입일</th>
            {/* <th>소개</th> */}
            {/* <th>주차 가능</th> */}
            {/* <th>SNS</th> */}
            {/* <th>영업 시작 시간</th> */}
            {/* <th>영업 종료 시간</th> */}
            <th>상태</th>
            <th>승인&활성화</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((store, index) => (
            <tr key={store.storeId}>
              <td>{store.storeId}</td>
              <td>{store.storeName}</td>
              {/* <td>{store.storeCate || '-'}</td> */}
              <td>{store.storeMaster || '-'}</td>
              {/* <td>{store.managerName || '-'}</td> */}
              {/* <td>{store.managerPhone || '-'}</td> */}
              {/* <td>{store.storeAddr || '-'}</td> */}
              <td>{store.storeBusinessNo || '-'}</td>
              <td>{new Date(store.storeSignup).toLocaleString() || '-'}</td>
              {/* <td>{storeInfo[index]?.storeIntro || '-'}</td> */}
              {/* <td>{storeInfo[index]?.storeParkingYn || '-'}</td> */}
              {/* <td>{storeInfo[index]?.storeSns || '-'}</td> */}
              {/* <td>{storeInfo[index]?.storeStartTime || '-'}</td> */}
              {/* <td>{storeInfo[index]?.storeEndTime || '-'}</td> */}
              <td>{store.storeStatus}</td>
              <td>
                {store.storeStatus === '대기' ? (
                  <button className="activate-button" onClick={() => handleApprove(store.storeId, '대기')}>승인</button>
                ) : (
                  <button className="activate-button" onClick={() => handleApprove(store.storeId, '비활성화')}>활성화</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MasterApproval />);
