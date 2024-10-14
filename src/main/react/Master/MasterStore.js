import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './MasterStore.css';
import StoreInfoModal from './StoreInfoModal';

function MasterStore() {
    const [store, setStore] = useState([]);
    const [storeInfo, setStoreInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedStoreInfo, setSelectedStoreInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchStores, setSearchStores] = useState([]);

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
                    .catch((error) => console.error('업체 정보를 가져오는 중 오류 발생:', error));
            })
            .catch((error) => console.error('업체 목록을 가져오는 중 오류 발생:', error));
    }, []);

    useEffect(() => {
        const activeStores = store.filter((store) => store.storeStatus === '활성화');
        setSearchStores(activeStores);
    }, [store]);

    const handleSearch = () => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const activeStores = store.filter(
            (store) => store.storeStatus === '활성화' && 
            store.storeName.toLowerCase().includes(lowerCaseQuery)
        );
        setSearchStores(activeStores);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDeactivate = (storeId) => {
        if (window.confirm("업체를 비활성화 하시겠습니까?")) {
            fetch(`/store/${storeId}/deactivate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        alert("업체가 비활성화 되었습니다.");
                        return fetch('/store');
                    }
                    throw new Error('업체 상태 업데이트에 실패했습니다.');
                })
                .then((response) => response.json())
                .then((data) => setStore(data))
                .catch((error) => {
                    console.error('업체 상태 업데이트 중 오류 발생:', error);
                    alert("비활성화에 실패했습니다.");
                });
        }
    };

    const handleShowModal = (store, storeInfo) => {
        setSelectedStore(store);
        setSelectedStoreInfo(storeInfo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStore(null);
        setSelectedStoreInfo(null);
    };

    return (
        <div>
            <div className="header-container">
            <h3>업체관리</h3>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="업체명을 입력하세요" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch}>검색</button>
            </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>업체ID</th>
                        <th>업체명</th>
                        <th>대표자</th>
                        <th>담당자</th>
                        <th>담당자연락처</th>
                        <th>주소</th>
                        <th>사업자 번호</th>
                        <th>업체정보</th>
                        <th>상태</th>
                        <th>비활성화</th>
                    </tr>
                </thead>
                <tbody>
                    {searchStores.map((store, index) => (
                        <tr key={store.storeId}>
                            <td>{store.storeId}</td>
                            <td>{store.storeName}</td>
                            <td>{store.storeMaster || '-'}</td>
                            <td>{store.managerName || '-'}</td>
                            <td>{store.managerPhone || '-'}</td>
                            <td>{store.storeAddr || '-'}</td>
                            <td>{store.storeBusinessNo || '-'}</td>
                            <td>
                                <button className="details-button" onClick={() => handleShowModal(store, storeInfo[index])}>상세보기</button>
                            </td>
                            <td>{store.storeStatus}</td>
                            <td>
                                <button className="deactivate-button" onClick={() => handleDeactivate(store.storeId)}>비활성화</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <StoreInfoModal isOpen={isModalOpen} onClose={handleCloseModal} store={selectedStore} storeInfo={selectedStoreInfo} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MasterStore />);
