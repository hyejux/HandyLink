import React, { useState, useEffect } from "react";
import axios from "axios";
import './UserChatList.css';
import ReactDOM from "react-dom/client";

function UserChatList() {
    const [userId, setUserId] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStoreNo, setSelectedStoreNo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/chat/current');
                console.log('현재 로그인된 사용자 ID:', response.data.userId); // 디버깅 로그
                setUserId(response.data.userId);
            } catch (error) {
                console.error('사용자 정보를 가져오는데 실패했습니다:', error);
                window.location.href = '/UserLoginPage.user';
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchChatList = async () => {
                try {
                    const response = await axios.get(`/chat/list?userId=${userId}`);
                    console.log('채팅 목록:', response.data);
                    setChatList(response.data);
                } catch (error) {
                    console.error("채팅 목록을 가져오는 중 오류가 발생했습니다:", error);
                }
            };
            fetchChatList();
        }
    }, [userId]);

    // 검색 기능 구현
    const filteredChatList = chatList.filter(chat =>
        (chat.storename || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 시간 포맷팅 함수
    const formatTime = (timestamp) => {
        const messageDate = new Date(timestamp);
        const today = new Date();

        // 날짜 비교를 위해 시간을 제외한 날짜만 비교
        const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
        const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const diffDays = Math.floor((todayDay - messageDay) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // 오늘: HH:MM
            return messageDate.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } else {
            // 이전 날짜: MM-DD
            return messageDate.toLocaleDateString('ko-KR', {
                month: '2-digit',
                day: '2-digit'
            }).replace('. ', '-').replace('.', '');
        }
    };

    return (
        <div>
            <div className="user-chat-container">
                <div className="user-chat-header">1:1 채팅 목록</div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="업체명 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <i className="bi bi-search search-icon"></i>
                </div>
                {filteredChatList.length === 0 ? (
                    <div className="no-results">
                        {searchTerm ? "검색 결과가 없습니다" : "채팅 내역이 없습니다"}
                    </div>
                ) : (
                    <ul className="inquiry-list">
                        {filteredChatList.map((chat, index) => (
                            <li
                                key={`${chat.storeNo}-${index}`}
                                className="inquiry-item"
                                onClick={async () => {
                                    try {
                                        console.log("클릭된 storeNo:", chat.storeNo);
                                        console.log("현재 userId:", userId);
                                        // 채팅방으로 이동하기 전에 마지막 확인 시간 업데이트
                                        await axios.post(`/chat/updateLastCheckedTime?userId=${userId}&storeNo=${chat.storeNo}`);
                                        setSelectedStoreNo(chat.storeNo);
                                        window.location.href = `/UserChatRoom.user?storeNo=${chat.storeNo}`;
                                    } catch (error) {
                                        console.error("마지막 확인 시간 업데이트 실패:", error);
                                        window.location.href = `/UserChatRoom.user?storeNo=${chat.storeNo}`;
                                    }
                                }}
                            >
                                <img
                                    src={chat.storeImgUrl || '/img/user_basic_profile.jpg'}
                                    alt={chat.storeName}
                                    className="store-image"
                                />
                                <div className="inquiry-content">
                                    <p className="inquiry-title">{chat.storeName}</p>
                                    <p className="chat-preview">
                                        {chat.lastMessage.length > 30 ? `${chat.lastMessage.substring(0, 30)}...` : chat.lastMessage}
                                    </p>
                                </div>
                                <span className="inquiry-time">{formatTime(chat.lastMessageTime)}</span>
                                {chat.isNewMessage && <span className="new-message-dot">●</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UserChatList/>);