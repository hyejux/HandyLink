import React, { useState } from 'react';
import './AdminChat.css';
import ReactDOM from "react-dom/client";

function AdminChat () {
    const [messages, setMessages] = useState([
        { id: 1, type: 'received', text: '앞으로 네이버 톡톡으로 이벤트 혜택/알림을 받아보실 수 있습니다.', time: '오후 1:15', date: '7.12(금)' },
        { id: 2, type: 'sent', text: '10월 27일', time: '오후 5:37', date: '10.27(일)' },
        { id: 3, type: 'sent', text: '잘못 보냈습니다!', time: '오후 5:37' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, type: 'sent', text: newMessage, time: '오후 5:37' }]);
            setNewMessage('');
        }
    };

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
                {/* 추가 채팅 아이템을 필요시 더 추가하세요 */}
            </div>

            {/* Chat Area */}
            {/* Chat Area */}
            <div className="chat-content">
                <div className="chat-header">
                    <h2>미도인 강남</h2>
                </div>
                <div className="messages">
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            {message.date && <div className="message date-label">{message.date}</div>}
                            <div className={`message ${message.type}`}>
                                <p>{message.text || message.chatMessage}</p>
                                <span className="message-time">{message.time || message.sendTime}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className="message-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
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
