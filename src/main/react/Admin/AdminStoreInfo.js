import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './AdminStoreInfo.css';

function AdminStoreInfo() {

    const [storeImg, setStoreImg] = useState([]); //서버에서 불러온 img

    useEffect(() => { // async를 제거하고, useEffect 내부에서 async 함수를 정의합니다.
        const fetchStoreImages = async () => {
            try {
                const response = await axios.get('/adminStore/storeInfoImg',{storeId: "test123"});
                console.log("이미지 응답: ", response.data);
                setStoreImg(response.data); // 응답 데이터로 상태 업데이트
            } catch (error) {
                console.log("error: ", error);
            }
        };

        fetchStoreImages(); // 함수 호출
    }, []);

    return(
    <div className="admin-store-info-container">
    <h1>My Store</h1>

    {/*div className="store-img-box">
        <div className="store-image">
        <img src="../img3.jpg" alt="store" />
        </div>
    </div>*/}

    {storeImg.length ? (
        <div className="store-img-box">
            {storeImg.map((url, index) => (
                <div key={index} className="store-image">
                    <img src={url} alt={`storeImg ${index + 1}`} />
                </div>
            ))}
        </div>
        ) : (
        <p>이미지가 없습니다.</p> // 상태가 비어있을 때 보여줄 메시지
    )}

    <div className="form-cont">
    <div className="form-group">
    <label htmlFor="store-name">상호명</label>
    <div className="input-field">
    꽃마을
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="username">아이디</label>
    <div className="input-field">
    dbcl1234
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="password">비밀번호</label>
    <div className="input-field">
    **********
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="manager">담당자명</label>
    <div className="input-field">
    장소영
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="contact">연락처</label>
    <div className="input-field">
    010-0000-0000
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="address">가게 주소</label>
    <div className="input-field">
    서울특별시 강남구 서초대로 143번길 00빌딩 2층
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="public">공개 여부</label>
    <div className="input-field radio-group">
    <input type="radio" name="public" checked disabled /> <span> 공개 </span>
    <input type="radio" name="public" disabled /> <span> 비공개 </span>
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="description">소개</label>
    <div className="input-field">
    <textarea rows="4" readOnly disabled style={{ resize: 'none' }}>
    해당 가게는 꽃을 전문적으로 판매하는 가게입니다. 다양한 꽃들을 합리적인 가격으로 제공하며, 고객 만족도를 높이기 위해 항상 최선을 다하고 있습니다.
    </textarea>
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="parking">주차장 여부</label>
    <div className="input-field radio-group">
    <input type="radio" name="parking" checked disabled /> O
    <input type="radio" name="parking" disabled /> X
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="hours">영업 시간</label>
    <div className="input-field hours-group">
    <div className="days-time-box">
    <span> 월요일 </span>
    <input type="time" value="09:00" disabled /> ~
    <input type="time" value="18:00" disabled />
    </div>
    </div>
    </div>

    <div className="form-group">
    <label htmlFor="sns">SNS 링크</label>
    <div className="input-field sns-links">
    <a href="https://instagram.com/mystore">인스타그램</a>
    <a href="https://facebook.com/mystore">페이스북</a>
    </div>
    </div>
    </div>

    <button className="submit-btn">수정</button>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminStoreInfo />);
