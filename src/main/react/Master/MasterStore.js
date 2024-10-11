import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './MasterStore.css';

function MasterStore() {
    const [store, setStore] = useState([]);
    const [storeInfo, setStoreInfo] = useState([]);

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

    const activeStores = store.filter((store) => store.storeStatus === '활성화');

    const handleDeactivate = (storeId) => {
        if (window.confirm("가게를 비활성화 하시겠습니까?")) {
            fetch(`/store/${storeId}/deactivate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        alert("가게가 비활성화 되었습니다.");
                        return fetch('/store');
                    }
                    throw new Error('가게 상태 업데이트에 실패했습니다.');
                })
                .then((response) => response.json())
                .then((data) => setStore(data))
                .catch((error) => {
                    console.error('가게 상태 업데이트 중 오류 발생:', error);
                    alert("비활성화에 실패했습니다.");
                });
        }
    };

    return (
        <div>
            <h3>가게 관리</h3>
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
                        <th>비활성화</th>
                    </tr>
                </thead>
                <tbody>
                    {activeStores.map((store, index) => (
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
                                <button className="deactivate-button" onClick={() => handleDeactivate(store.storeId)}>비활성화</button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MasterStore />);
