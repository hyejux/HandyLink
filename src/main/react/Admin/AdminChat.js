import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './AdminChat.css';
import ReactDOM from "react-dom/client";

function AdminChat() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [newMessageCount, setNewMessageCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [storeId, setStoreId] = useState(null);
    const [storeNo, setStoreNo] = useState("");

    const chatBoxRef = useRef(null);
    const websocket = useRef(null);
    const inputRef = useRef(null);

    const userId = 'chat@naver.com'; // 임시 업체 ID
    const profileImg= '/img/user_basic_profile.jpg';

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

    // 세션 스토리지에서 값 가져오기
    useEffect(() => {
        const storedStoreId = sessionStorage.getItem('storeId');
        const storedStoreNo = sessionStorage.getItem('storeNo');

        if (storedStoreId) {
            setStoreId(storedStoreId);
            setStoreNo(storedStoreNo);
        } else {
            console.error("로그인 정보가 세션 스토리지에 없습니다.");
        }
    }, []);

    // 기존 채팅 기록 불러오기
    useEffect(() => {
        const loadChatHistory = async () => {
            if (!storeId) return; // storeId가 없으면 호출하지 않음
            try {
                const response = await axios.get(`/chat/history?userId=${userId}&storeId=${storeId}&limit=15`);
                setMessages(response.data);
            } catch (error) {
                console.error("채팅 기록을 불러오는 중 오류가 발생했습니다.", error);
            }
        };
        loadChatHistory();
    }, [storeId]); // storeId가 설정된 후에만 채팅 기록을 불러옵니다.

    // WebSocket 연결 설정
    useEffect(() => {
        if (!userId || !storeId) return; // 로그인 정보 없으면 연결 X

        websocket.current = new WebSocket('ws://localhost:8585/ws/chat');

        websocket.current.onmessage = (event) => {
            const received = JSON.parse(event.data);
            if (received.storeId === storeId) {
                setMessages(prevMessages => [...prevMessages, received]);
            }
        };

        websocket.current.onerror = (error) => console.error("WebSocket 에러:", error);
        websocket.current.onclose = () => console.log("WebSocket 연결이 종료되었습니다");

        return () => {
            if (websocket.current) websocket.current.close();
        };
    }, [userId, storeId]);

    // 메시지 전송 함수
    const handleSend = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !userId || !storeId) return;

        const message = {
            senderType: 'STORE',
            storeId,
            storeNo,
            userId,
            chatMessage: messageInput.trim(),
            sendTime: new Date().toISOString(),
        };

        try {
            setMessages(prevMessages => [...prevMessages, message]);
            websocket.current.send(JSON.stringify(message));
            await axios.post('/chat/save', message, { headers: { 'Content-Type': 'application/json' } });
            setMessageInput("");
        } catch (error) {
            console.error("메시지 전송 중 오류가 발생했습니다.", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend(e);
    };

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    return (
        <div className="chat-container">
            {/* Left Sidebar (Chat List) */}
            <div className="chat-list">
                <div className="search-bar">
                    <input type="text" placeholder="고객 프로필명 검색" />
                </div>
                <div className="chat-item active">
                    <span className="chat-name">네이버페이</span>
                    <span className="chat-date">오후 12:15</span>
                    <p className="chat-preview">큐라텐 큐라프...</p>
                </div>
                <div className="chat-item">
                    <span className="chat-name">MONTRAUM</span>
                    <span className="chat-date">10월 25일</span>
                    <p className="chat-preview">(광고)가르니...</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-content" ref={chatBoxRef} onScroll={handleScroll}>
                <div className="chat-header">
                    <h2>{storeNo}</h2>
                </div>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index}>
                            {message.date && <div className="message date-label">{message.date}</div>}
                            <div className={`message ${message.senderType === 'STORE' ? 'sent' : 'received'}`}>
                                <p>{message.chatMessage}</p>
                                <span className="message-time">
                                    {new Date(message.sendTime).toLocaleTimeString('ko-KR', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {showToast && (
                    <div className="toast-message" onClick={() => {
                        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                        setShowToast(false);
                        setNewMessageCount(0);
                    }}>
                        새 메시지 {newMessageCount}개
                    </div>
                )}

                <div className="message-input">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        placeholder="메시지를 입력하세요."
                    />
                    <button onClick={handleSend}>보내기</button>
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminChat />);
