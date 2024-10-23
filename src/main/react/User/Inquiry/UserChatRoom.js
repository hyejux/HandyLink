import ReactDOM from "react-dom/client";
import React, {useEffect, useState, useRef} from "react";
import './UserChatRoom.css';

function UserChatRoom() {
/*    const [message, setMessage] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const websocket = useRef(null);

    useEffect(() => {
        websocket.current = new WebSocket ('ws://localhost:8585/ws/chat');

        websocket.current.onmessage = (event) => {
            const received = JSON.parse(event.data);
            setMessage(prev => [...prev, received]);
        }

        return () => websocket.current.close();
    }, []);

    const sendMessage = (e) => {
      e.preventDefault();
      if (messageInput.trim()) {
          const message = {
              userId : '123@naver.com',
              storeId : '1',
              chatMessage : messageInput
          };
          websocket.current.send(JSON.stringify(message));
          setMessageInput("");
      }
    };*/

    return (
        {/*<div>
            <div className="user-chat-room-container">
                <div className="user-top-nav">
                    <div className="shop-name">우리케이크</div>
                </div>

                <div className="chat-box">
                    {message.map((msg, index) => (
                        <div key={index}
                             className={`message ${msg.userId === '123@naver.com' ? 'sender' : 'receiver'}`}>
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
        </div>*/}
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserChatRoom/>
);