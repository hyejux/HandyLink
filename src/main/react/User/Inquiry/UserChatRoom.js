import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './UserChatRoom.css';
import ReactDOM from "react-dom/client";

function UserChatRoom() {
    const [messages, setMessages] = useState([]); // 기존 메시지 목록
    const [messageInput, setMessageInput] = useState(""); // 입력한 메시지
    const websocket = useRef(null);
    const inputRef = useRef(null);

    const userId = '123@naver.com'; // 임시 사용자 ID
    const storeId = '1'; // 임시 업체 ID
    const senderType = 'USER';
    const userName = '짱구';
    const profileImg= '/img/user_basic_profile.jpg';
    const storeNo = 3;

    // 기존 채팅 기록 불러오기
    useEffect(() => {
        axios.get(`/chat/history?userId=${userId}&storeId=${storeId}`)
            .then(response => {
                setMessages(response.data); // 기존 채팅 기록을 상태에 저장
            })
            .catch(error => {
                console.error("채팅 기록을 불러오는 중 오류가 발생했습니다.", error);
            });
    }, []);

    // WebSocket 연결 설정
    useEffect(() => {
        websocket.current = new WebSocket('ws://localhost:8585/ws/chat');

        websocket.current.onmessage = (event) => {
            const received = JSON.parse(event.data);
            console.log("고객 WebSocket에서 받은 메시지:", received);
            if (received.senderId === userId || received.recipientId === userId) {
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages, received];
                    console.log("업데이트된 메시지 목록:", newMessages);
                    return newMessages;
                });
            }
        };


        websocket.current.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        websocket.current.onclose = () => {
            console.log("WebSocket 연결이 종료되었습니다");
        };

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, [userId]);

    // 메시지 전송 함수
    const sendMessage = (e) => {
        e.preventDefault();

        // 전송할 메시지 로그 찍기
        console.log("전송할 메시지:", {
            senderType: senderType,
            storeId: storeId,
            userName: userName,
            profileImg: profileImg,
            userId: userId,
            storeNo: storeNo,
            chatMessage: messageInput.trim(),
            sendTime: new Date().toISOString(),
        });

        if (!websocket.current || websocket.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket이 연결되지 않았습니다!");
            return;
        }

        if (messageInput.trim()) {
            const message = {
                senderType: senderType,
                storeId: storeId,
                userName: userName,
                profileImg: profileImg,
                userId: userId,
                storeNo: storeNo,
                chatMessage: messageInput.trim(),
                sendTime: new Date().toISOString(),
            };

            // WebSocket을 통해 메시지 전송
            websocket.current.send(JSON.stringify(message));

            // DB에 메시지 저장
            axios.post('/chat/save', message, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });


            setMessageInput(""); // 입력창 비우기
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
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.senderType === 'USER' ? 'sent' : 'received'}`}>
                            {msg.senderType !== 'USER' && (
                                <div className="profile-section">
                                    <img className="profile-img" src={msg.profileImg} alt={`${msg.userName} 프로필`} />
                                </div>
                            )}
                            <div className="message-content">
                                {msg.senderType !== 'USER' && <div className="sender-name">{msg.userName}</div>}
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