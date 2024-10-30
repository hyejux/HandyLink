import React, { useState, useEffect } from "react";
import axios from "axios";
import './UserChatList.css';
import ReactDOM from "react-dom/client";

function UserChatList() {
    const [userId, setUserId] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    setLoading(true);
                    const response = await axios.get(`/chat/list?userId=${userId}`);
                    console.log('채팅 목록 데이터:', response.data); // 디버깅 로그
                    setChatList(response.data);
                } catch (error) {
                    console.error("채팅 목록을 가져오는 중 오류가 발생했습니다:", error);
                    setError("채팅 목록을 불러오는데 실패했습니다");
                } finally {
                    setLoading(false);
                }
            };
            fetchChatList();
        }
    }, [userId]);


    // 검색 기능 구현
    const filteredChatList = chatList.filter(chat =>
        (chat.storename || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="user-chat-container">
                <div className="loading-spinner">로딩 중...</div>
            </div>
        );
    }


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

    if (loading) {
        return (
            <div className="user-chat-container">
                <div className="loading-spinner">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-chat-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

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
                                key={`${chat.storeno}-${index}`} // 각 항목에 고유한 key 부여
                                className="inquiry-item"
                                onClick={() => {
                                    console.log("겟한 store_no", chat.storeno);
                                    window.location.href = `/UserChatRoom.user?storeNo=${chat.storeno}`;
                                }}
                            >
                                <img
                                    src={chat.storeimgurl || '/img/user_basic_profile.jpg'}
                                    alt={chat.storename}
                                    className="store-image"
                                    onError={(e) => {
                                        e.target.src = '/img/user_basic_profile.jpg'; // 기본 이미지로 대체
                                    }}
                                />
                                <div className="inquiry-content">
                                    <p className="inquiry-title">{chat.storename}</p>
                                    <p className="chat-preview">
                                        {chat.lastmessage.length > 30
                                            ? `${chat.lastmessage.substring(0, 30)}...`
                                            : chat.lastmessage}
                                    </p>
                                </div>
                                <span className="inquiry-time">
                                    {formatTime(chat.lastmessagetime)}
                                </span>
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