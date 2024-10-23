import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom/client";
import './UserChatRoom.css';

function StoreChatRoom() {
    const [message, setMessage] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const websocket = useRef(null);

    useEffect(() => {
        console.log("WebSocket 연결 시도...");
        websocket.current = new WebSocket('ws://localhost:8585/ws/chat');

        websocket.current.onopen = () => {
            console.log("WebSocket이 성공적으로 연결되었습니다!");
        };

        websocket.current.onmessage = (event) => {
            console.log("받은 메시지:", event.data);
            const received = JSON.parse(event.data);

            // UserChatRoom의 경우
            if (received.senderId === '123@naver.com' || received.recipientId === '123@naver.com') {
                setMessage(prev => [...prev, received]);
            }

            // StoreChatRoom의 경우
            if (received.senderId === '1' || received.recipientId === '1') {
                setMessage(prev => [...prev, received]);
            }
        };

        return () => websocket.current.close();
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!websocket.current || websocket.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket이 연결되지 않았습니다!");
            return;
        }

        if (messageInput.trim()) {
            const chatMessage = {
                sender_type: 'STORE',
                senderId: '1',
                recipientId: '123@naver.com',
                chatMessage: messageInput.trim()
            };
            console.log("메시지 전송:", chatMessage);
            websocket.current.send(JSON.stringify(chatMessage));
            setMessageInput("");
        }
    };

    return (
        <div>
            <div className="user-chat-room-container">
                <div className="user-top-nav">
                    <div className="shop-name">(임시)우리케이크-업체</div>
                </div>

                <div className="chat-box">
                    {message.map((msg, index) => (
                        <div key={index}
                             className={`message ${msg.senderId === '1' ? 'sender' : 'receiver'}`}>
                            <div className="bubble">
                                {msg.chatMessage}
                            </div>
                            <div className="timestamp">
                                {new Date().toLocaleTimeString('ko-KR', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="input-box">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
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
    <StoreChatRoom/>
);