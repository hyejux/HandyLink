import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';

function MyStore() {
    // 세션 스토리지에서 storeId 가져오기
    const storeId = sessionStorage.getItem('storeId');
    console.log("세션에서 가져온 storeId: ", storeId);

    const [myStore, setMyStore] = useState({
        storeId: storeId,
        storeIntro: '',
        storeNotice: '',
        storeParkingYn: '', // 주차 여부 초기값 설정
        storeOpenTime: '',
        storeCloseTime: '',
        accountBank: '',
        accountNumber: ''
    });

    const handleChangeInput = (e) => {
        const { id, value } = e.target;
        setMyStore({
            ...myStore,
            [id]: value // id 속성에 해당하는 값을 동적으로 업데이트
        });
    };


    useEffect (() => {
        console.log("가게관리 ",myStore);
    },[myStore]);

    // 등록하기 핸들러
    const handleStoreUpdate = async () => {
        try {
            const response = await axios.post('/adminStore/updateStoreSet', {
                ...myStore
            });
            console.log('성공 ', response.data);
        } catch (error) {
            console.error('error ', error);
        }
    };

    return (
    <div>
    <h2>가게 정보</h2>
    <form onSubmit={(e) => { e.preventDefault(); handleStoreUpdate(); }}>
    <div>
    <label>나의 가게 소개:</label>
    <textarea
    value={myStore.storeIntro}
    id="storeIntro"
    onChange={handleChangeInput}
    rows="4"
    cols="50"
    />
    </div>
    <div>
    <label>공지사항:</label>
    <textarea
    value={myStore.storeNotice}
    id="storeNotice"
    onChange={handleChangeInput}
    rows="4"
    cols="50"
    />
    </div>

    <div className="parking-yn">
    <label>
    <input
    type="radio"
    id="storeParkingYn"
    value="Y"
    checked={myStore.storeParkingYn === 'Y'}
    onChange={handleChangeInput}
    /> 주차 가능
    </label>
    <label>
    <input
    type="radio"
    id="storeParkingYn"
    value="N"
    checked={myStore.storeParkingYn === 'N'}
    onChange={handleChangeInput}
    /> 주차 불가
    </label>
    </div>

    <div>
    <label>오픈 시간:</label>
    <input
    type="time"
    value={myStore.storeOpenTime}
    id="storeOpenTime"
    onChange={handleChangeInput}
    />
    </div>
    <div>
    <label>마감 시간:</label>
    <input
    type="time"
    id="storeCloseTime"
    value={myStore.storeCloseTime}
    onChange={handleChangeInput}
    />
    </div>

    <div className="account">
    <label>계좌번호</label>
    <div className="account-info">
    <select className="account-bank" id="accountBank" onChange={handleChangeInput}>
    <option value="">은행 선택</option>
    <option value="농협">농협</option>
    <option value="국민">국민</option>
    <option value="하나">하나</option>
    <option value="우리">우리</option>
    <option value="카카오뱅크">카카오뱅크</option>
    </select>
    <input
    type="text"
    id="accountNumber"
    placeholder="- 제외하고 입력하세요."
    style={{ width: '30%' }}
    onChange={handleChangeInput}
    />
    </div>
    </div>

    <button type="submit">등록하기</button>
    </form>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<MyStore />
);
