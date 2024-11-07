import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './UserChatList.css';
import ReactDOM from "react-dom/client";

function UserChatList() {
    // useStat 관리
    const [userId, setUserId] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStoreNo, setSelectedStoreNo] = useState(null);

    // 드래그 관련 상태 추가
    const [dragStart, setDragStart] = useState(null);
    const [dragOffset, setDragOffset] = useState({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const touchStartX = useRef(0);
    const currentTranslateX = useRef({});

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/chat/current');
                console.log('현재 로그인된 사용자 ID:', response.data.userId);
                setUserId(response.data.userId);
            } catch (error) {
                console.error('사용자 정보를 가져오는데 실패했습니다:', error);
                window.location.href = '/UserLoginPage.user';
            }
        };
        fetchUserInfo();
    }, []);

    const updateChatList = async (userId) => {
        try {
            const response = await axios.get(`/chat/list?userId=${userId}`);
            console.log("채팅 목록 API 응답:", response.data);

            // actived 상태 확인
            const activeChats = response.data.filter(chat => chat.actived === 'Y');
            console.log("활성화된 채팅 목록:", activeChats);

            // 최신순 정렬
            const sortedChats = activeChats.sort(
                (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
            );

            setChatList(sortedChats);
        } catch (error) {
            console.error("채팅 목록을 가져오는 중 오류가 발생했습니다:", error);
        }
    };

    useEffect(() => {
        if (!userId) return;

        // 초기 채팅 목록 로드
        updateChatList(userId);

        // WebSocket 연결 설정
        const wsUrl = `ws://172.30.1.99:8585/ws/chat`;
        const websocket = new WebSocket(wsUrl);

        websocket.onmessage = (event) => {
            const received = JSON.parse(event.data);
            console.log("수신된 메시지:", received);

            if (received.userId === userId || received.receiverId === userId) {
                // 채팅 목록 업데이트
                setChatList(prevList => {
                    const updatedList = prevList.map(chat => {
                        if (chat.storeNo === received.storeNo) {
                            return {
                                ...chat,
                                lastMessage: received.chatMessage,
                                lastMessageTime: received.sendTime,
                                isNewMessage: true
                            };
                        }
                        return chat;
                    });
                    return updatedList.sort((a, b) =>
                        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                    );
                });
            }
        };

        websocket.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        websocket.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        // WebSocket 연결 해제 시 닫기
        return () => {
            websocket.close();
        };
    }, [userId]);

    // 검색 기능 구현
    const filteredChatList = chatList.filter(chat =>
        (chat.storeName || "").toLowerCase().includes(searchTerm.toLowerCase())
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

    // 아래부터는 드래그 활용한 채팅 목록에서의 삭제
    const handleTouchStart = (e, storeNo) => {
        touchStartX.current = e.touches[0].clientX;
        currentTranslateX.current[storeNo] = dragOffset[storeNo] || 0;
    };

    const handleTouchMove = (e, storeNo) => {
        if (!touchStartX.current) return;

        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX.current;
        const newTranslate = Math.min(0, Math.max(-100, currentTranslateX.current[storeNo] + diff));

        setDragOffset(prev => ({
            ...prev,
            [storeNo]: newTranslate
        }));
    };

    // 목록에서 감추기
    const handleTouchEnd = async (e, storeNo) => {
        const offset = dragOffset[storeNo] || 0;

        if (offset < -50) {
            if (window.confirm('목록에서 삭제하시겠습니까?')) {
                try {
                    console.log("채팅 삭제 요청:", { userId, storeNo });
                    const deleteResponse = await axios.post(`/chat/delete?userId=${userId}&storeNo=${storeNo}`);
                    console.log("삭제 응답:", deleteResponse.data);

                    // 삭제 후 채팅 목록 확인
                    const listResponse = await axios.get(`/chat/list?userId=${userId}`);
                    console.log("삭제 후 전체 채팅 목록:", listResponse.data);

                    const activeChats = listResponse.data.filter(chat => chat.actived === 'Y');
                    console.log("삭제 후 활성화된 채팅 목록:", activeChats);

                    setChatList(activeChats);
                } catch (error) {
                    console.error("채팅 삭제 중 오류 발생:", error);
                }
            }
        }

        setDragOffset(prev => ({
            ...prev,
            [storeNo]: 0
        }));
        touchStartX.current = 0;
        currentTranslateX.current[storeNo] = 0;
    };


    return (
        <div>
            <div className="user-chat-container">
                <div className="user-chat-header">1:1 채팅 목록</div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="업체명 또는 메시지 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <i className="bi bi-search search-icon"></i>
                </div>
                {/* 필터링된 채팅 목록 정의 */}
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
                                style={{
                                    transform: `translateX(${dragOffset[chat.storeNo] || 0}px)`,
                                    transition: touchStartX.current ? 'none' : 'transform 0.3s ease'
                                }}
                                onTouchStart={(e) => handleTouchStart(e, chat.storeNo)}
                                onTouchMove={(e) => handleTouchMove(e, chat.storeNo)}
                                onTouchEnd={(e) => handleTouchEnd(e, chat.storeNo)}
                                onClick={async () => {
                                    // 드래그 중인 경우 클릭 이벤트 무시
                                    if (dragOffset[chat.storeNo]) return;

                                    try {
                                        await axios.post(`/chat/updateLastCheckedTime?userId=${userId}&storeNo=${chat.storeNo}`);
                                        await axios.post(`/chat/resetNewMessage?userId=${userId}`);
                                        setChatList(prevList =>
                                            prevList.map(item =>
                                                item.storeNo === chat.storeNo ? {...item, isNewMessage: false} : item
                                            )
                                        );
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
                                    <p className="inquiry-title">{chat.storeName}
                                        {chat.isNewMessage && <span className="new-message-dot">●</span>}</p>
                                    <p className="chat-preview">
                                        {chat.lastMessage.length > 30 ? `${chat.lastMessage.substring(0, 30)}...` : chat.lastMessage}
                                    </p>
                                </div>
                                <span className="inquiry-time">{formatTime(chat.lastMessageTime)}</span>
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