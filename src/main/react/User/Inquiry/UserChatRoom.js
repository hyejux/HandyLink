import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './UserChatRoom.css';
import ReactDOM from "react-dom/client";

function UserChatRoom() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [newMessageCount, setNewMessageCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [userId, setUserId] = useState(null);
    const [storeNo, setStoreNo] = useState(null);
    const [storeInfo, setStoreInfo] = useState({
        storeNo: '',
        storeName: '',
        storeImg: [{ storeImgLocation: '/img/user_basic_profile.jpg' }],
        storeOpenTime: '',
        storeCloseTime: '',
    });

    const chatBoxRef = useRef(null);
    const websocket = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const storeNo = params.get("storeNo");
        console.log("Received storeNo from URL:", storeNo); // 확인용 로그
        setStoreNo(storeNo);
    }, []);


    const handleScroll = () => {
        if (!chatBoxRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
        const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

        setIsAtBottom(isBottom);
        if (isBottom) {
            setShowToast(false);
            setNewMessageCount(0);
        }
    };

    useEffect(() => {
        if (isAtBottom && chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        } else {
            setShowToast(true);
            setNewMessageCount(prev => prev + 1);
        }
    }, [messages]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/chat/current');
                setUserId(response.data.userId);
            } catch (error) {
                console.error('사용자 정보를 가져오는데 실패했습니다:', error);
                window.location.href = '/UserLoginPage.user';
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (storeNo) {  // storeNo가 정확히 설정되었는지 확인
                try {
                    const response = await axios.get(`/chat/getStoreInfoByStoreNo/${storeNo}`);
                    console.log("가게 정보", response.data);
                    setStoreInfo(response.data);
                } catch (error) {
                    console.error('가게 정보를 가져오는데 실패했습니다:', error);
                }
            }
        };
        fetchStoreInfo();
    }, [storeNo]);

    useEffect(() => {
        const loadChatHistory = async () => {
            if (userId && storeNo) {
                try {
                    const response = await axios.get(`/chat/history?userId=${userId}&storeNo=${storeNo}`); // 파라미터 이름 변경
                    setMessages(response.data);
                } catch (error) {
                    console.error('채팅 기록을 불러오는 중 오류가 발생했습니다:', error);
                }
            }
        };
        loadChatHistory();
    }, [userId, storeNo]);

    useEffect(() => {
        if (!userId) return;

        const connectWebSocket = () => {
            websocket.current = new WebSocket('ws://localhost:8585/ws/chat');

            websocket.current.onopen = () => {
                console.log('WebSocket 연결됨 - 상태:', websocket.current.readyState);
            };

            websocket.current.onmessage = (event) => {
                const received = JSON.parse(event.data);
                if (received.storeNo === storeNo) {  // storeNo가 제대로 설정되어 있는지 확인
                    setMessages((prevMessages) => [...prevMessages, received]);
                }
            };

            websocket.current.onerror = (error) => {
                console.error('WebSocket 에러:', error);
                console.log('에러 발생 시 WebSocket 상태:', websocket.current.readyState);
            };

            websocket.current.onclose = (event) => {
                console.log('WebSocket 연결 종료. 코드:', event.code, '사유:', event.reason);
                console.log('종료 시점 WebSocket 상태:', websocket.current.readyState);
            };
        };

        connectWebSocket();

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, [userId, storeNo]);

    const sendMessage = async () => {
        if (!userId) {
            window.location.href = '/UserLoginPage.user';
            return;
        }

        if (messageInput.trim() && websocket.current) {
            const message = {
                userId,
                storeNo,
                senderType: "USER",
                chatMessage: messageInput,
                sendTime: new Date().toISOString(),
            };

            try {
                console.log('메시지 전송 전 WebSocket 상태:', websocket.current.readyState);

                if (websocket.current.readyState === WebSocket.OPEN) {
                    websocket.current.send(JSON.stringify(message));
                    console.log('메시지 전송 완료');

                    await axios.post('/chat/save', message, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log('메시지 저장 후 WebSocket 상태:', websocket.current.readyState);
                    setMessageInput('');
                } else {
                    console.error('WebSocket이 열려있지 않음. 현재 상태:', websocket.current.readyState);
                }
            } catch (error) {
                console.error('메시지 전송 중 오류:', error);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage(e);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleImageClick = () => {
        window.location.href = `/userStoreDetail.user/${storeInfo.storeNo}`;
    };

    return (
        <div>
            <div className="user-chat-room-container">
                <div className="chat-box" ref={chatBoxRef} onScroll={handleScroll}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.senderType === 'USER' ? 'sent' : 'received'}`}>
                            {msg.senderType !== 'USER' && (
                                <div className="profile-section" onClick={handleImageClick}>
                                    <img
                                        className="profile-img"
                                        src={storeInfo.storeImg[0]?.storeImgLocation || '/img/user_basic_profile.jpg'}
                                        alt={`${storeInfo.storeName} 프로필`}
                                    />
                                </div>
                            )}
                            <div className="message-content">
                                {msg.senderType !== 'USER' && <div className="sender-name">{storeInfo.storeName}</div>}
                                <div className="bubble">{msg.chatMessage}</div>
                                <div className="timestamp">
                                    {new Date(msg.sendTime).toLocaleTimeString('ko-KR', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showToast && (
                    <div
                        className="toast-message"
                        onClick={() => {
                            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                            setShowToast(false);
                            setNewMessageCount(0);
                        }}
                    >
                        새 메시지 {newMessageCount}개
                    </div>
                )}

                <div className="input-box">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        placeholder="메시지를 입력하세요..."
                    />
                    <button onClick={sendMessage}>
                        <i className="bi bi-arrow-up-circle-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UserChatRoom />);