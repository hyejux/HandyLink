import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './AdminChat.css';
import ReactDOM from "react-dom/client";

function AdminChat() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [storeId, setStoreId] = useState(null);
    const [storeNo, setStoreNo] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserInfo, setSelectedUserInfo] = useState(null);
    const chatBoxRef = useRef(null);
    const websocket = useRef(null);

    // 세션 스토리지에서 스토어 정보 가져오기
    useEffect(() => {
        const storedStoreId = sessionStorage.getItem('storeId');
        const storedStoreNo = sessionStorage.getItem('storeNo');
        if (storedStoreId && storedStoreNo) {
            setStoreId(storedStoreId);
            setStoreNo(storedStoreNo);
        }
    }, []);

    // 채팅 목록 가져오기
    useEffect(() => {
        const fetchChatList = async () => {
            if (!storeNo) return;
            try {
                const response = await axios.get(`/adminChat/list?storeNo=${storeNo}`);
                console.log('채팅 목록:', response.data);
                setChatList(response.data);
            } catch (error) {
                console.error('채팅 목록을 불러오는데 실패했습니다:', error);
            }
        };
        fetchChatList();
    }, [storeNo]);

    // 채팅방 선택 시 메시지 불러오기
    const handleChatSelect = async (userId) => {
        try {
            setSelectedUserId(userId);
            const selectedUser = chatList.find(chat => chat.userId === userId);
            setSelectedUserInfo(selectedUser);

            // 읽음 상태 업데이트
            await axios.post(`/adminChat/updateLastCheckedTime?userId=${userId}&storeNo=${storeNo}`);

            // 채팅 내역 가져오기
            const response = await axios.get(`/adminChat/history?userId=${userId}&storeNo=${storeNo}&limit=50`);
            const sortedMessages = response.data.sort((a, b) =>
                new Date(a.sendTime) - new Date(b.sendTime)
            );
            setMessages(sortedMessages);

            if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
        } catch (error) {
            console.error("채팅 내역을 불러오는데 실패했습니다:", error);
        }
    };

    // WebSocket 연결
    useEffect(() => {
        if (!storeId) return;

        const connectWebSocket = () => {
            websocket.current = new WebSocket('ws://localhost:8585/ws/chat');

            websocket.current.onopen = () => {
                console.log('WebSocket 연결됨');
            };

            websocket.current.onmessage = (event) => {
                const received = JSON.parse(event.data);
                console.log("수신된 메시지:", received);

                if (received.storeNo === storeNo) {
                    // 현재 선택된 채팅방의 메시지인 경우
                    if (received.userId === selectedUserId) {
                        if (received.senderType === 'USER') {
                            setMessages(prevMessages => [...prevMessages, received]);
                        }
                    }

                    // 채팅 목록 업데이트
                    setChatList(prevList => {
                        const newList = prevList.map(chat => {
                            if (chat.userId === received.userId) {
                                return {
                                    ...chat,
                                    lastMessage: received.chatMessage,
                                    lastMessageTime: received.sendTime,
                                    isNewMessage: true
                                };
                            }
                            return chat;
                        });
                        return newList.sort((a, b) =>
                            new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                        );
                    });
                }
            };

            websocket.current.onerror = (error) => {
                console.error('WebSocket 에러:', error);
            };

            websocket.current.onclose = () => {
                console.log('WebSocket 연결 종료');
            };
        };

        connectWebSocket();

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, [storeId, selectedUserId, storeNo]);

    // 메시지 전송
    const handleSend = async () => {
        if (!messageInput.trim() || !selectedUserId) return;

        const message = {
            senderType: 'STORE',
            storeId,
            storeNo,
            userId: selectedUserId,
            chatMessage: messageInput.trim(),
            sendTime: new Date().toISOString()
        };

        try {
            if (websocket.current?.readyState === WebSocket.OPEN) {
                websocket.current.send(JSON.stringify(message));
                await axios.post('/adminChat/save', message);
                setMessages(prevMessages => [...prevMessages, message]);
                setMessageInput("");
            }
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

    // 시간 포맷팅
    const formatTime = (timestamp) => {
        const messageDate = new Date(timestamp);
        const today = new Date();
        const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
        const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const diffDays = Math.floor((todayDay - messageDay) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return messageDate.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } else {
            return messageDate.toLocaleDateString('ko-KR', {
                month: '2-digit',
                day: '2-digit'
            }).replace('. ', '-').replace('.', '');
        }
    };

    // 검색 기능
    const filteredChatList = chatList.filter(chat =>
        chat.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.userId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chat-container">
            {/* 채팅 목록 */}
            <div className="chat-list">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="고객 프로필명 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {filteredChatList.map((chat) => (
                    <div
                        key={chat.userId}
                        className={`chat-item ${selectedUserId === chat.userId ? 'active' : ''}`}
                        onClick={() => handleChatSelect(chat.userId)}
                    >
                        <img
                            src={chat.userImgUrl || '/img/user_basic_profile.jpg'}
                            alt="profile"
                            className="chat-profile-img"
                        />
                        <div className="chat-info">
                            <span className="chat-name">{chat.userName}</span>
                            {chat.isNewMessage && <span className="new-message-dot">●</span>}
                            <span className="chat-date">{formatTime(chat.lastMessageTime)}</span>
                            <p className="chat-preview">{chat.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>


            {/* 채팅창 */}
            <div className="chat-content">
                {!selectedUserId ? (
                    <div className="no-chat-selected">
                        채팅방을 선택해주세요
                    </div>
                ) : (
                    <>
                        <div className="messages" ref={chatBoxRef}>
                            {messages.map((message, index) => (
                                <div key={index}
                                     className={`message ${message.senderType === 'STORE' ? 'sent' : 'received'}`}>
                                    {message.senderType !== 'STORE' && (
                                        <div className="message-profile">
                                            <img
                                                src={selectedUserInfo?.userImgUrl || '/img/user_basic_profile.jpg'}
                                                alt="profile"
                                                className="user-img"
                                            />
                                            <span className="sender-name">{selectedUserInfo?.userName}</span>
                                        </div>
                                    )}
                                    <div className="bubble">{message.chatMessage}</div>
                                    <span className="message-time">
                            {formatTime(message.sendTime)}
                        </span>
                                </div>
                            ))}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="메시지를 입력하세요..."
                            />
                            <button onClick={handleSend}>전송</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminChat/>);