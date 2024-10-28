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

    const chatBoxRef = useRef(null);
    const websocket = useRef(null);
    const inputRef = useRef(null);

    // 고정된 사용자 및 업체 ID, 추후 로그인 연동 시 변경
    const userId = 'qwer@naver.com';
    const senderType = 'STORE';
    const storeNo = 5;
    const storeId = 'test1';
    const storeName = '도레도레';
    const profileImg = '/img/user_basic_profile.jpg';


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

    // 기존 채팅 기록 불러오기
    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const response = await axios.get(`/chat/history?userId=${userId}&storeId=${storeId}&limit=15`);
                setMessages(response.data);
            } catch (error) {
                console.error("채팅 기록을 불러오는 중 오류가 발생했습니다.", error);
            }
        };
        loadChatHistory();
    }, []);

    // WebSocket 연결 설정
    useEffect(() => {
        websocket.current = new WebSocket('ws://localhost:8585/ws/chat');

        websocket.current.onmessage = (event) => {
            const received = JSON.parse(event.data);
            console.log("WebSocket에서 받은 메시지:", received);

            if (senderType === 'STORE' && received.senderType === 'STORE') return;

            if (received.userId === userId && received.storeId === storeId) {
                setMessages(prevMessages => [...prevMessages, received]);
            }
        };

        websocket.current.onerror = (error) => console.error("WebSocket 에러:", error);

        websocket.current.onclose = () => console.log("WebSocket 연결이 종료되었습니다");

        return () => {
            if (websocket.current) websocket.current.close();
        };
    }, [userId, storeId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const message = {
            senderType,
            storeId,
            storeName,
            profileImg,
            userId,
            storeNo,
            chatMessage: messageInput.trim(),
            sendTime: new Date().toISOString(),
        };

        try {
            setMessages(prevMessages => [...prevMessages, message]);
            websocket.current.send(JSON.stringify(message));

            await axios.post('/chat/save', message, {
                headers: { 'Content-Type': 'application/json' }
            });

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
                    <h2>{storeName}</h2>
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
