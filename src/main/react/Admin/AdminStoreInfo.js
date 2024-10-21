import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './AdminStoreInfo.css';

function AdminStoreInfo() {
    // 세션 스토리지에서 storeId 가져오기
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');
    console.log("세션에서 가져온 storeId: ", storeId);
    console.log("세션에서 가져온 storeNo: ", storeNo);

    const [storeInfo, setStoreInfo] = useState({
        storeId,
        storeNo,
        storePw:'',
        storeCate:'',
        storeName:'',
        storeMaster:'',
        managerName:'',
        managerPhone:'',
        zipcode: '',
        addr:'',
        addrdetail:'',
        storeBusinessNo:'',
        storeSignup:''
    });

    useEffect(() => {
        const fetchStoreImages = async () => {
            try {


                // sessionId가 null이 아닌 경우에만 API 요청
                if (storeId) {
                    const response = await axios.get(`/adminStore/myStoreInfo?storeNo=${storeNo}`);
                    console.log("업체정보: ", response.data);
                    setStoreInfo(response.data); // 상태 업데이트
                } else {
                    console.log("세션 ID가 없습니다.");
                }
            } catch (error) {
                console.log("error: ", error);
            }
        };

        fetchStoreImages();
        console.log("마이페이지 확인 ", storeInfo);

    }, []);

    //수정하기
    const [isDisabled, setIsDisabled] = useState(true);

    const toggleModify = () => {
        setIsDisabled(!isDisabled);

        console.log("수정",isDisabled);
    }

    const handleChangeStoreInfo = (e) => {
      const {id, value} = e.target;

        setStoreInfo(prev => ({
            ...prev,
            [id]: value
        }));
    };






    return(
    <div className="admin-store-info-container">
        <h1>My Store</h1>

        <div className="form-cont">
            <div className="form-group">
                <label htmlFor="store-name">상호명</label>
                <div className="input-field">
                    <input type="text" id="storeName" value={storeInfo.storeName} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="username">아이디</label>
                <div className="input-field">
                    <input type="text" id="storeId" value={storeInfo.storeId} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <div className="input-field">
                    <input type="text" id="storePw" value={storeInfo.storePw} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="storeMaster">대표자</label>
                <div className="input-field">
                    <input type="text" id="storeMaster" value={storeInfo.storeMaster} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="manager">담당자명</label>
                <div className="input-field">
                    <input type="text" id="managerName" value={storeInfo.managerName} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="contact">연락처</label>
                <div className="input-field">
                    <input type="text" id="managerPhone" value={storeInfo.managerPhone} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="address">가게 주소</label>
                <div className="input-field">
                    <input type="text" id="addr" value={storeInfo.addr} onChange={handleChangeStoreInfo} disabled/>
                    <input type="text" id="addrdetail" value={storeInfo.addrdetail} onChange={handleChangeStoreInfo} disabled/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="storeBusinessNo">사업자등록번호</label>
                <div className="input-field">
                    <input type="text" id="storeBusinessNo" value={storeInfo.storeBusinessNo} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="storeSignup">가입일</label>
                <div className="input-field">
                    <input type="text" id="storeSignup" value={storeInfo.storeSignup}/>
                </div>
            </div>

        </div>

        <button type="button" className="modify-btn" onClick={toggleModify}>
            {isDisabled ? '수정하기' : '수정완료'}
        </button>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminStoreInfo />);
