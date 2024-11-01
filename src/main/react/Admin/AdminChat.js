import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './AdminChat.css';
import ProfileCard from './ProfileCard.js';
import ReactDOM from "react-dom/client";

function AdminChat() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [newMessageCount, setNewMessageCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [storeId, setStoreId] = useState(null);
    const [storeNo, setStoreNo] = useState("");
    const [chatList, setChatList] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserInfo, setSelectedUserInfo] = useState(null);
    const chatBoxRef = useRef(null);
    const websocket = useRef(null);
    const inputRef = useRef(null);
    const [isProfileCardVisible, setIsProfileCardVisible] = useState(false);
    const [profileCardUserInfo, setProfileCardUserInfo] = useState(null);


    // 시간 포맷팅 함수
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

    // 스크롤 핸들러
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

    // 채팅 목록 불러오기
    useEffect(() => {
        const loadChatList = async () => {
            if (!storeNo) return;
            try {
                const response = await axios.get(`/adminChat/list?storeNo=${storeNo}`);

                // userId 기준으로 그룹화하여 가장 최근 메시지만 남기기
                const uniqueChats = response.data.reduce((acc, curr) => {
                    // 이미 해당 userId의 채팅이 있는지 확인
                    const existing = acc.find(chat => chat.userid === curr.userid);

                    // 없으면 추가, 있으면 더 최근 메시지인 경우에만 업데이트
                    if (!existing) {
                        acc.push(curr);
                    } else if (new Date(curr.lastmessagetime) > new Date(existing.lastmessagetime)) {
                        const index = acc.findIndex(chat => chat.userid === curr.userid);
                        acc[index] = curr;
                    }
                    return acc;
                }, []);

                // 시간 순으로 정렬
                uniqueChats.sort((a, b) =>
                    new Date(b.lastmessagetime) - new Date(a.lastmessagetime)
                );

                console.log('Unique chats:', uniqueChats);
                setChatList(uniqueChats);
            } catch (error) {
                console.error('채팅 목록을 불러오는데 실패했습니다:', error);
            }
        };
        loadChatList();
    }, [storeNo]);

// 세션 스토리지에서 스토어 정보 가져오기
    useEffect(() => {
        const storedStoreId = sessionStorage.getItem('storeId');
        const storedStoreNo = sessionStorage.getItem('storeNo');
        console.log('Session storage values:', { storedStoreId, storedStoreNo });
        if (storedStoreId) {
            setStoreId(storedStoreId);
            setStoreNo(storedStoreNo);
        }
    }, []);

    const handleProfileClick = async (e) => {
        e.stopPropagation();
        if (selectedUserInfo && selectedUserInfo.userid) {
            try {
                const userInfo = await fetchUserDetail(selectedUserInfo.userid);
                setProfileCardUserInfo(userInfo); // 프로필 카드에 표시할 정보 업데이트
                setIsProfileCardVisible(true); // 프로필 카드 표시
            } catch (error) {
                console.error("프로필 정보를 불러올 수 없습니다:", error);
            }
        }
    };



    const closeProfileCard = () => {
        setIsProfileCardVisible(false);
    };

    // 사용자 프로필 정보 가져오기
    const fetchUserDetail = async (userId) => {
        try {
            const response = await axios.get(`/user/profile/${userId}`);
            console.log('User profile:', response.data);
            return response.data;
        } catch (error) {
            console.error("사용자 정보를 불러오는데 실패했습니다:", error);
        }
    };

    // 프로필 클릭 핸들러
    // const handleProfileClick = (e) => {
    //     e.stopPropagation();
    //     if (selectedUserInfo && selectedUserInfo.userid) {  // userid로 수정 (소문자)
    //         fetchUserDetail(selectedUserInfo.userid);
    //     }
    // };

    // 채팅방 선택 시 메시지 불러오기
    const handleChatSelect = async (userId) => {
        setSelectedUserId(userId);
        setIsProfileCardVisible(false);
        const selectedUser = chatList.find(chat => chat.userid === userId);
        setSelectedUserInfo(selectedUser);

        try {
            const response = await axios.get(`/adminChat/history?userId=${userId}&storeNo=${storeNo}&limit=20`);
            // 최신 메시지가 아래에 오도록 정렬
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
                console.log('WebSocket 연결됨 - 상태:', websocket.current.readyState);
            };

            websocket.current.onmessage = (event) => {
                const received = JSON.parse(event.data);
                console.log("수신된 메시지:", received);

                // 현재 선택된 채팅방의 메시지인지 확인
                if (received.storeNo === storeNo && received.userId === selectedUserId) {
                    // USER가 보낸 메시지일 때만 추가 (STORE가 보낸 건 이미 local state에 추가됨)
                    if (received.senderType === 'USER') {
                        setMessages(prevMessages => [...prevMessages, received]);

                        // 채팅 목록 업데이트
                        setChatList(prevList => {
                            return prevList.map(chat => {
                                if (chat.userid === received.userId) {
                                    return {
                                        ...chat,
                                        lastmessage: received.chatMessage,
                                        lastmessagetime: received.sendTime
                                    };
                                }
                                return chat;
                            }).sort((a, b) =>
                                new Date(b.lastmessagetime) - new Date(a.lastmessagetime)
                            );
                        });
                    }
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
    }, [storeId, selectedUserId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUserId) return;

        const message = {
            senderType: 'STORE',
            storeId,
            storeNo,
            userId: selectedUserId,
            chatMessage: messageInput.trim(),
            sendTime: new Date().toISOString(),
        };

        try {
            console.log('메시지 전송 전 WebSocket 상태:', websocket.current?.readyState);

            if (websocket.current?.readyState === WebSocket.OPEN) {
                websocket.current.send(JSON.stringify(message));
                console.log('메시지 전송 완료');

                await axios.post('/adminChat/save', message);
                console.log('메시지 저장 후 WebSocket 상태:', websocket.current.readyState);
                setMessageInput("");

                // 로컬에서 메시지 추가
                setMessages(prevMessages => [...prevMessages, message]);
            } else {
                console.error('WebSocket이 열려있지 않음. 현재 상태:', websocket.current?.readyState);
                // 연결이 끊어진 경우 메시지를 DB에만 저장
                await axios.post('/adminChat/save', message);
                setMessageInput("");
                setMessages(prevMessages => [...prevMessages, message]);
            }
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

    // 검색된 채팅 목록 필터링
    const filteredChatList = chatList.filter(chat =>
        chat.username?.toLowerCase().includes(searchTerm.toLowerCase()) || // username으로 수정
        chat.userid?.toLowerCase().includes(searchTerm.toLowerCase()) // userid로 수정
    );

    // 새 메시지 전송 시에도 스크롤 자동으로 아래로 이동
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

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
                        key={chat.userid}
                        className={`chat-item ${selectedUserId === chat.userid ? 'active' : ''}`}
                        onClick={() => handleChatSelect(chat.userid)}
                    >
                        <img
                            src={chat.userimgurl || '/img/user_basic_profile.jpg'}
                            alt="profile"
                            className="chat-profile-img"
                        />
                        <div className="chat-info">
                            <span className="chat-name">{chat.username}</span>
                            <span className="chat-date">{formatTime(chat.lastmessagetime)}</span>
                            <p className="chat-preview">
                                {chat.lastmessage.length > 30
                                    ? `${chat.lastmessage.substring(0, 30)}...`
                                    : chat.lastmessage}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 채팅창 */}
            <div className="chat-content">
            {!chatList.length ? (
                    <div className="no-chat-selected">
                        대화 내역이 없습니다
                    </div>
                ) : !selectedUserId ? (
                    <div className="no-chat-selected">
                        채팅방을 선택해주세요
                    </div>
                ) : (
                    <>
                        <div className="messages" ref={chatBoxRef} onScroll={handleScroll}>
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.senderType === 'STORE' ? 'sent' : 'received'}`}>
                                    {message.senderType !== 'STORE' && selectedUserInfo && (
                                        <div className="message-profile">
                                            <img
                                                src={selectedUserInfo.userimgurl || '/img/user_basic_profile.jpg'}
                                                alt="profile"
                                                onClick={handleProfileClick}
                                                style={{cursor: 'pointer'}}
                                            />
                                            <span className="sender-name">{selectedUserInfo.username}</span>
                                        </div>
                                    )}
                                    <div className="bubble">{message.chatMessage}</div>
                                    <span className="message-time">
                                        {formatTime(message.sendTime)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {isProfileCardVisible && profileCardUserInfo && (
                            <ProfileCard user={profileCardUserInfo} onClose={closeProfileCard} />
                        )}

                        <div className="message-input">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                                placeholder="메시지를 입력하세요."
                            />
                            <button onClick={handleSend}>보내기</button>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminChat/>);
