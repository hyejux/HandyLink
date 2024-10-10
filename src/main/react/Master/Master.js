import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './Master.css'; // CSS 파일 경로


const Master = () => {
    const [store, setStore] = useState([]);
    const [storeInfo, setStoreInfo] = useState([]);

    useEffect(() => {
        // 가게 목록을 가져오는 API 호출
        fetch('/store')
            .then((response) => response.json())
            .then((data) => {
                setStore(data);
                // 모든 가게의 정보를 자동으로 가져오기
                const infoPromises = data.map((store) =>
                    fetch(`/store/info/${store.storeId}`).then((response) => response.json())
                );
                Promise.all(infoPromises)
                    .then((infoData) => setStoreInfo(infoData))
                    .catch((error) => console.error('Error fetching store info:', error));
            })
            .catch((error) => console.error('Error fetching store:', error));
    }, []);

    return (
        <div>
            <h3>가게 목록</h3>
            <table>
                <thead>
                    <tr>
                        <th>가게 ID</th>
                        <th>가게 이름</th>
                        <th>카테고리</th>
                        <th>대표자</th>
                        <th>매니저 이름</th>
                        <th>매니저 전화</th>
                        <th>주소</th>
                        <th>사업자 번호</th>
                        <th>가입일</th>
                        <th>소개</th>
                        <th>주차 가능</th>
                        <th>SNS</th>
                        <th>영업 시작 시간</th>
                        <th>영업 종료 시간</th>
                        <th>활성화</th>
                    </tr>
                </thead>
                <tbody>
                    {store.map((store, index) => (
                        <tr key={store.storeId}>
                            <td>{store.storeId}</td>
                            <td>{store.storeName}</td>
                            <td>{store.storeCate || '-'}</td>
                            <td>{store.storeMaster || '-'}</td>
                            <td>{store.managerName || '-'}</td>
                            <td>{store.managerPhone || '-'}</td>
                            <td>{store.storeAddr || '-'}</td>
                            <td>{store.storeBusinessNo || '-'}</td>
                            <td>{new Date(store.storeSignup).toLocaleString() || '-'}</td>
                            <td>{storeInfo[index]?.storeIntro || '-'}</td>
                            <td>{storeInfo[index]?.storeParkingYn || '-'}</td>
                            <td>{storeInfo[index]?.storeSns || '-'}</td>
                            <td>{storeInfo[index]?.storeStartTime || '-'}</td>
                            <td>{storeInfo[index]?.storeEndTime || '-'}</td>
                            <td>{store.storeStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <h3>업체 목록</h3>
            <table>
                <thead>
                    <tr>
                        <th>가게 ID</th>
                        <th>가게 이름</th>
                        <th>카테고리</th>
                        <th>대표자</th>
                        <th>매니저 이름</th>
                        <th>매니저 전화</th>
                        <th>주소</th>
                        <th>사업자 번호</th>
                        <th>가입일</th>
                        <th>소개</th>
                        <th>주차 가능</th>
                        <th>SNS</th>
                        <th>영업 시작 시간</th>
                        <th>영업 종료 시간</th>
                        <th>활성화</th>
                    </tr>
                </thead>
                <tbody>
                    {store.map((store, index) => (
                        <tr key={store.storeId}>
                            <td>{store.storeId}</td>
                            <td>{store.storeName}</td>
                            <td>{store.storeCate || '-'}</td>
                            <td>{store.storeMaster || '-'}</td>
                            <td>{store.managerName || '-'}</td>
                            <td>{store.managerPhone || '-'}</td>
                            <td>{store.storeAddr || '-'}</td>
                            <td>{store.storeBusinessNo || '-'}</td>
                            <td>{new Date(store.storeSignup).toLocaleString() || '-'}</td>
                            <td>{storeInfo[index]?.storeIntro || '-'}</td>
                            <td>{storeInfo[index]?.storeParkingYn || '-'}</td>
                            <td>{storeInfo[index]?.storeSns || '-'}</td>
                            <td>{storeInfo[index]?.storeStartTime || '-'}</td>
                            <td>{storeInfo[index]?.storeEndTime || '-'}</td>
                            <td>{store.storeStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Master />);
