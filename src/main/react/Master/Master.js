import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './Master.css';

function Master() {
    const [store, setStore] = useState([]);
    const [activeStores, setActiveStores] = useState([]);
    const [waitingStores, setWaitingStores] = useState([]);
    const [inactiveStores, setInactiveStores] = useState([]);

    // 모든 업체 정보 불러옴
    useEffect(() => {
        fetch('/store')
            .then((response) => response.json())
            .then((data) => {
                setStore(data);
                updateStoreCounts(data);
            })
            .catch((error) => console.error('업체 목록을 가져오는 중 오류 발생:', error));
    }, []);

    // 상태에 따른 업체 리스트 업데이트
    const updateStoreCounts = (data) => {
        setActiveStores(data.filter(store => store.storeStatus === '활성화'));
        setWaitingStores(data.filter(store => store.storeStatus === '대기'));
        setInactiveStores(data.filter(store => store.storeStatus === '비활성화'));
    };

    return (
        <div>
            <h3>업체 상태 현황</h3>
            <div className="store-counts">
                <div className="count-card">
                    <h4>승인 대기 업체</h4>
                    <p>{waitingStores.length}</p>
                </div>
                <div className="count-card">
                    <h4>승인된 업체</h4>
                    <p>{activeStores.length}</p>
                </div>
                <div className="count-card">
                    <h4>비활성화된 업체</h4>
                    <p>{inactiveStores.length}</p>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>승인 대기 업체</th>
                        <th>승인된 업체</th>
                        <th>비활성화된 업체</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: Math.max(activeStores.length, waitingStores.length, inactiveStores.length) }).map((_, index) => (
                        <tr key={index}>
                            <td>{waitingStores[index]?.storeName || '-'}</td>
                            <td>{activeStores[index]?.storeName || '-'}</td>
                            <td>{inactiveStores[index]?.storeName || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Master />);
