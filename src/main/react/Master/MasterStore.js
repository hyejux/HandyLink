import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './MasterStore.css';
import StoreInfoModal from './StoreInfoModal';

function MasterStore() {
    const [store, setStore] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        fetch('/store')
            .then((response) => response.json())
            .then((data) => setStore(data))
            .catch((error) => console.error('업체 목록을 가져오는 중 오류 발생:', error));
    }, []);

    const activeStores = store.filter((store) => store.storeStatus === '활성화');

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
                    } else {
                        return response.text().then((errorText) => {
                            throw new Error(`업체 상태 업데이트에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
                        });
                    }
                })
                .then((response) => response.json())
                .then((data) => setStore(data))
                .catch((error) => {
                    console.error('업체 상태 업데이트 중 오류 발생:', error);
                    alert(`비활성화에 실패했습니다. 오류 메시지: ${error.message}`);
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

    const parseJson = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("JSON 파싱 오류:", error);
            return {};
        }
    };

    return (
        <div>
            <h3>업체관리</h3>
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
                    {activeStores.map((store) => {
                        const addrInfo = parseJson(store.storeAddr);

                        return (
                            <tr key={store.storeId}>
                                <td>{store.storeId}</td>
                                <td>{store.storeName}</td>
                                <td>{store.storeMaster || '-'}</td>
                                <td>{store.managerName || '-'}</td>
                                <td>{store.managerPhone || '-'}</td>
                                <td>{addrInfo.addr} {addrInfo.addrdetail}</td>
                                <td>{store.storeBusinessNo || '-'}</td>
                                <td>
                                    <button className="details-button" onClick={() => handleShowModal(store)}>상세보기</button>
                                </td>
                                <td>{store.storeStatus}</td>
                                <td>
                                    <button className="deactivate-button" onClick={() => handleDeactivate(store.storeId)}>비활성화</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <StoreInfoModal isOpen={isModalOpen} onClose={handleCloseModal} store={selectedStore} />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MasterStore />);
