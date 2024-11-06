import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './MasterApproval.css';
import StoreInfoModal from './StoreInfoModal';

function MasterApproval() {
  const [store, setStore] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState("");  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");    // 검색 버튼으로 트리거된 실제 검색어
  const [isSearched, setIsSearched] = useState(false);  // 검색이 트리거되었는지 여부
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    fetch('/getStoreInfo')
      .then((response) => response.json())
      .then((data) => {
        setStore(data);
      })
      .catch((error) => console.error('업체 목록을 가져오는 중 오류 발생:', error));
  }, []);

  // 상태 필터링
  const filteredStores = store.filter((store) => {
    if (filter === '대기') {
      return store.storeStatus === '대기';
    } else if (filter === '비활성화') {
      return store.storeStatus === '비활성화';
    } else if (filter === '정지') {
      return store.storeStatus === '정지';
    } else if (filter === '전체') {
      return ['대기', '비활성화', '정지'].includes(store.storeStatus);
    }
    return true;
  });

  // 검색 필터링 (검색이 트리거되었을 때만)
  const searchFilteredStores = isSearched
    ? filteredStores.filter((store) =>
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : filteredStores;

  const handleSearch = () => {
    setSearchTerm(searchQuery);  // 현재 입력된 검색어로 검색 트리거
    setIsSearched(true);  // 검색이 수행되었음을 표시
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();  // Enter 키로 검색 트리거
    }
  };

  const handleApprove = (storeNo, currentStatus) => {
    const confirmationMessage =
      currentStatus === '대기'
        ? "승인 하시겠습니까? (업체는 비활성화 상태로 변경됩니다)"
        : "활성화 하시겠습니까?";

    if (window.confirm(confirmationMessage)) {
      // 대기 상태일 경우 비활성화로, 그 외에는 활성화로 처리
      // 현재 상태가 '대기'이면 '비활성화'로 변경하고, 그 외는 '활성화'로 변경
      const newStatus = currentStatus === '대기' ? '비활성화' : '활성화';

      fetch(`/getStoreInfo/${storeNo}/approve`, {  // 'approve' 경로를 그대로 사용
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            alert(
              currentStatus === '대기'
                ? "업체가 비활성화 상태로 변경되었습니다."
                : "업체가 활성화되었습니다."
            );
            return fetch('/getStoreInfo');  // 최신 데이터 가져오기
          }
          throw new Error('업체 상태 업데이트에 실패했습니다.');
        })
        .then((response) => response.json())
        .then((data) => setStore(data))  // 상태 변경 후 store 업데이트
        .catch((error) => {
          alert("업체 상태 업데이트에 실패했습니다.");
          console.error('업체 상태 업데이트 중 오류 발생:', error);
        });
    }
  };



  const handleSuspend = (storeNo) => {
    if (window.confirm("정지 하시겠습니까?")) {
      fetch(`/getStoreInfo/${storeNo}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            alert("업체가 정지되었습니다.");
            return fetch('/getStoreInfo');
          }
          throw new Error('업체 정지에 실패했습니다.');
        })
        .then((response) => response.json())
        .then((data) => setStore(data))
        .catch((error) => {
          alert("업체 정지에 실패했습니다.");
          console.error('업체 정지 중 오류 발생:', error);
        });
    }
  };

  // 모달 열기 함수
  const handleShowModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  return (
    <div>
      <div className="header-container">
        <h3>승인관리</h3>

        {/* 검색바 추가 */}
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}  // 엔터키로 검색 가능
            placeholder="업체명 검색"
          />
          <button onClick={handleSearch}>검색</button>
        </div>

        <div className="store-filter-container">
          <select id="store-status-select" onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="전체">전체</option>
            <option value="대기">대기</option>
            <option value="비활성화">비활성화</option>
            <option value="정지">정지</option> {/* 정지 상태 추가 */}
          </select>

        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>업체번호</th>
            <th>업체명</th>
            <th>대표자</th>
            <th>담당자</th>
            <th>담당자연락처</th>
            <th>주소</th>
            <th>사업자 번호</th>
            <th>업체정보</th>
            <th>상태</th>
            <th>승인</th>
            <th>정지</th> {/* 정지 버튼 추가 */}
          </tr>
        </thead>
        <tbody>
          {searchFilteredStores.map((store) => {

            return (
              <tr key={store.storeNo}>
                <td>{store.storeNo}</td>
                <td>{store.storeName}</td>
                <td>{store.storeMaster || '-'}</td>
                <td>{store.managerName || '-'}</td>
                <td>{store.managerPhone || '-'}</td>
                <td>{store.addr} {store.addrdetail}</td>
                <td>{store.storeBusinessNo || '-'}</td>
                <td>
                  <button className="details-button" onClick={() => handleShowModal(store)}>상세보기</button>
                </td>
                <td>{store.storeStatus}</td>
                <td>
                  {store.storeStatus === '대기' ? (
                    <button className="activate-button" onClick={() => handleApprove(store.storeNo, '대기')}>승인</button>
                  ) : (
                    <button className="activate-button" onClick={() => handleApprove(store.storeNo, '비활성화')}>활성화</button>
                  )}
                </td>
                <td>
                  {store.storeStatus !== '정지' && (
                    <button className="suspend-button" onClick={() => handleSuspend(store.storeNo)}>정지</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <StoreInfoModal isOpen={isModalOpen} onClose={handleCloseModal} store={selectedStore} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MasterApproval />);
