import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './UserChatRoom.css';
import ReactDOM from "react-dom/client";

function UserChatRoom({ userId, storeId }) {
    const [messages, setMessages] = useState([]); // 기존 메시지 목록
    const [messageInput, setMessageInput] = useState(""); // 입력한 메시지
    const [showToast, setShowToast] = useState(false);
    const [newMessageCount, setNewMessageCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const chatBoxRef = useRef(null);
    const websocket = useRef(null);
    const inputRef = useRef(null);

    // 스크롤 위치 감지 추가
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

    // 메시지 업데이트 후 스크롤을 하단으로 이동
    useEffect(() => {
        if (!chatBoxRef.current) return;

        if (isAtBottom) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        } else {
            setShowToast(true);
            setNewMessageCount(prev => prev + 1);
        }
    }, [messages]);

    // 기존 채팅 기록 불러오기
    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const response = await axios.get(`/chat/history?userId=${userId}&storeId=${storeId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('채팅 기록을 불러오는 중 오류가 발생했습니다:', error);
            }
        };
        loadChatHistory();
    }, [userId, storeId]);

    // WebSocket 연결 설정
    useEffect(() => {
        websocket.current = new WebSocket('ws://localhost:8585/ws/chat');

        websocket.current.onmessage = (event) => {
            const received = JSON.parse(event.data);
            if (received.userId === userId && received.storeId === storeId) {
                setMessages((prevMessages) => [...prevMessages, received]);
            }
        };

        websocket.current.onclose = () => {
            console.log('WebSocket 연결이 종료되었습니다.');
        };

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, [userId, storeId]);

    // 메시지 전송
    const sendMessage = async () => {
        if (messageInput.trim()) {
            const message = {
                userId,  // 고객의 ID를 발신자로 설정
                storeId,  // 업체의 ID를 수신자로 설정
                chatMessage: messageInput,
                sendTime: Date.now(),
            };

            try {
                if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                    websocket.current.send(JSON.stringify(message));
                } else {
                    console.error('WebSocket이 연결되지 않았습니다!');
                    return;
                }

                // DB에 메시지 저장
                await axios.post('/chat/save', message, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // 로컬 상태 업데이트 및 입력 초기화
                setMessages((prevMessages) => [...prevMessages, { ...message, type: 'sent' }]);
                setMessageInput('');
            } catch (error) {
                console.error('메시지 전송 중 오류가 발생했습니다:', error);
            }
        }
    };

    // 엔터 키로 메시지 전송
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage(e);
        }
    };

    // 페이지 로드시 input에 포커스 주기
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div>
            <div className="user-chat-room-container">
                <div
                    className="chat-box"
                    ref={chatBoxRef}
                    onScroll={handleScroll}
                >
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.senderType === 'USER' ? 'sent' : 'received'}`}>
                            {msg.senderType !== 'USER' && (
                                <div className="profile-section">
                                    <img className="profile-img" src={profileImg} alt={`${msg.userName} 프로필`} />
                                </div>
                            )}
                            <div className="message-content">
                                {msg.senderType !== 'USER' && <div className="sender-name">{/*{msg.userName}*/}도레도레</div>}
                                <div className="bubble">
                                    {msg.chatMessage}
                                </div>
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
                        placeholder="Message here..."
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
root.render(
    <UserChatRoom/>
);