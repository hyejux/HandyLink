import ReactDOM from "react-dom/client";
import React from "react";
import './UserChatList.css';

function UserChatList () {
    return (
        <div>
            <div className="user-chat-container">
                <div className="user-chat-header">1:1 채팅 목록</div>

                <div className="search-bar">
                    <input type="text" placeholder="업체명 검색"/>
                    <i className="bi bi-search"></i>
                </div>

                <ul className="inquiry-list">
                    <li className="inquiry-item" onClick={() => {window.location.href='/UserChatRoom.user'}}>
                        <img src='/img/user_basic_profile.jpg' alt="도레도레"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">도레도레</p>
                            <p className="inquiry-message">안녕하세요?</p>
                        </div>
                        <span className="inquiry-time">09:20 PM</span>
                    </li>

                    <li className="inquiry-item">
                        <img src='/img/user_basic_profile.jpg' alt="프라이들 앤 스위츠"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">프라이들 앤 스위츠</p>
                            <p className="inquiry-message">휴가 기간에 대관 가능한가요?</p>
                        </div>
                        <span className="inquiry-time">09:20 PM</span>
                    </li>

                    <li className="inquiry-item">
                        <img src='/img/user_basic_profile.jpg' alt="프라이들 앤 스위츠"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">프라이들 앤 스위츠</p>
                            <p className="inquiry-message">휴가 기간에 대관 가능한가요?</p>
                        </div>
                        <span className="inquiry-time">09:20 PM</span>
                    </li>

                    <li className="inquiry-item">
                        <img src='/img/user_basic_profile.jpg' alt="라운디드 네일"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">라운디드 네일</p>
                            <p className="inquiry-message">내일 예약 가능한 시간 알려주세요.</p>
                        </div>
                        <span className="inquiry-time">10:23 AM</span>
                    </li>

                    <li className="inquiry-item">
                        <img src='/img/user_basic_profile.jpg' alt="더 내일 앤 남성정장"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">더 내일 앤 남성정장</p>
                            <p className="inquiry-message">신상품 재고 상태 알려주실 수 있나요?</p>
                        </div>
                        <span className="inquiry-time">08:01 PM</span>
                    </li>

                    <li className="inquiry-item">
                        <img src='/img/user_basic_profile.jpg' alt="컵케이크 공방"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">컵케이크 공방</p>
                            <p className="inquiry-message">주문 가능 여부 문의 드립니다.</p>
                        </div>
                        <span className="inquiry-time">12:20 PM</span>
                    </li>

                    <li className="inquiry-item">
                        <img src='/img/user_basic_profile.jpg' alt="헤어 스타일 신림점"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">헤어 스타일 신림점</p>
                            <p className="inquiry-message">예약 가능한지 확인 부탁드립니다.</p>
                        </div>
                        <span className="inquiry-time">09:20 AM</span>
                    </li>

                    <li className="inquiry-item">
                        <img src='/img/user_basic_profile.jpg' alt="플로라 플라워샵"/>
                        <div className="inquiry-content">
                            <p className="inquiry-title">플로라 플라워샵</p>
                            <p className="inquiry-message">웨딩 부케 주문 상담을 원합니다.</p>
                        </div>
                        <span className="inquiry-time">03:43 PM</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserChatList/>
);