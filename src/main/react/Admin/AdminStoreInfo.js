import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './AdminStoreInfo.css';

function AdminStoreInfo() {

    const [storeInfo, setStoreInfo] = useState({
        storeId:'',
        storePw:'',
        storeCate:'',
        storeName:'',
        storeMaster:'',
        managerName:'',
        managerPhone:'',
        storeAddr: {
            zipcode: '',
            addr:'',
            addrdetail:''
        },
        storeBusinessNo:'',
        storeIntro: '',
        storeNotice: '',
        storeOpenTime: '',
        storeCloseTime: '',
        storeDayOff: [],
        storeParkingYn: '',
        storeSns: [
            { snsLink: '', snsName: '' }, // 첫 번째 SNS 세트
            { snsLink: '', snsName: '' }, // 두 번째 SNS 세트
            { snsLink: '', snsName: '' }  // 세 번째 SNS 세트
        ],
        storeAccount: {
            accountBank: '',
            accountNumber: ''
        },
        imageUrl: [],
        storeSignup:'',
        storeStatus:''
    });

    useEffect(() => {
        const fetchStoreImages = async () => {
            try {
                // 세션 스토리지에서 storeId 가져오기
                const storeId = sessionStorage.getItem('storeId');
                console.log("세션에서 가져온 storeId: ", storeId);

                // sessionId가 null이 아닌 경우에만 API 요청
                if (storeId) {
                    const response = await axios.get(`/adminStore/storeInfo?storeId=${storeId}`);
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

    }, []);

    //수정하기
    const [isDisabled, setIsDisabled] = useState(false);

    const toggleModify = () => {
        setIsDisabled(!isDisabled);

        console.log("수정",isDisabled);
    }
    결정하다








    return(
    <div className="admin-store-info-container">
        <h1>My Store</h1>

        {/*<div className="store-img-box">
            <div className="store-image">
            <img src="../img3.jpg" alt="store" />
            </div>
        </div>*/}

        {/*storeImg.length ? (
            <div className="store-img-box">
                {storeImg.map((url, index) => (
                    <div key={index} className="store-image">
                        <img src={url} alt={`storeImg ${index + 1}`} />
                    </div>
                ))}
            </div>
            ) : (
            <p>이미지가 없습니다.</p> // 상태가 비어있을 때 보여줄 메시지
        )}*/}

        <div className="form-cont">
            <div className="form-group">
                <label htmlFor="store-name">상호명</label>
                <div className="input-field">
                    <input type="text" value={storeInfo.storeName} disable={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="username">아이디</label>
                <div className="input-field">
                    <input type="text" value={storeInfo.storeId} disable={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <div className="input-field">
                    <input type="text" value={storeInfo.storePw} disable={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="manager">담당자명</label>
                <div className="input-field">
                    <input type="text" value={storeInfo.managerName} disable={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="contact">연락처</label>
                <div className="input-field">
                    <input type="text" value={storeInfo.managerPhone} disable={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="address">가게 주소</label>
                <div className="input-field">
                    <input type="text" value={storeInfo.storeAddr.addr} disable/>
                    <input type="text" value={storeInfo.storeAddr.addrdetail} disable/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="public">공개 여부</label>
                <div className="input-field radio-group">
                    <input type="radio" name="public" value="활성화" checked={storeInfo.storeStatus === '활성화'} disabled={isDisabled} /> <span> 공개 </span>
                    <input type="radio" name="public" value="비활성화" checked={storeInfo.storeStatus === '비활성화'} disabled={isDisabled} /> <span> 비공개 </span>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">소개</label>
                <div className="input-field">
                    <textarea rows="4" readOnly style={{ resize: 'none' }} value={storeInfo.storeIntro} disable={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="parking">주차장 여부</label>
                <div className="input-field radio-group">
                    <input type="radio" name="parking"  value="Y" checked={storeInfo.storeParkingYn === 'Y'} disabled={isDisabled} /> O
                    <input type="radio" name="parking" value="N" checked={storeInfo.storeParkingYn === 'N'} disabled={isDisabled} /> X
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="hours">영업 시간</label>
                <div className="input-field hours-group">
                    <div className="days-time-box">
                        <input type="time" value={storeInfo.storeOpenTime} disabled={isDisabled} /> ~
                        <input type="time" value={storeInfo.storeCloseTime} disabled={isDisabled} />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="sns">SNS 링크</label>
                <div className="input-field sns-links">
                    {storeInfo.storeSns.map((sns, index) => (
                        <a key={index} href={sns.snsLink} target="_blank" rel="noopener noreferrer">
                            <span>{sns.snsName}</span>
                        </a>
                    ))}
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
