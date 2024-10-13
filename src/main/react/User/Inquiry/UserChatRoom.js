import ReactDOM from "react-dom/client";
import React, {useEffect, useState} from "react";

function UserChatRoom() {
    const [chat, setChat] = useState([]);
    const [chatContent, setChatContent] = useState("");
    const [storeId, setStoreId] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        getChat();
    }, []);

    function getChat() {
        fetch("/userChatRoom/select")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setChat(Array.isArray(data) ? data : []);
            })
            .catch(function (error) {
                console.error("selectTest 오류", error);
            });
    }

    function handleInsertChat() {
        const chatData = {
            chatContent,
            storeId,
            userId
        };

        fetch("/userChatRoom/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(chatData)
        })
            .then(response => response.text())
            .then(() => {
                setChatContent("");
                setStoreId("");
                setUserId("");
                getChat();
            })
            .catch(error => console.error("insertTest 시ㄹ패", error));
    }

    return (
        <div>
            <h1>1대1 채팅</h1>
            <div className="chat-room">
                {chat.map(chat => (
                    <div key={chat.chatNo} className="chat">
                        <p>{chat.chatNo}</p>
                        <p>{chat.chatContent}</p>
                        <p>{chat.chatTime}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={chatContent}
                onChange={function (e) {
                    setChatContent(e.target.value);
                }}
                placeholder="채팅 내용을 입력하세요"
            />
            <input
                type="text"
                value={storeId}
                onChange={function (e) {
                    setStoreId(e.target.value);
                }}
                placeholder=""
            />
            <input
                type="text"
                value={userId}
                onChange={function (e) {
                    setUserId(e.target.value);
                }}
                placeholder=""
            />
            <button type="button" onClick={handleInsertChat}>insert</button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserChatRoom/>
);