import ReactDOM from "react-dom/client";
import React, {useEffect, useState} from "react";
import './UserChatRoom.css';

function UserChatRoom() {

    return (
        <div>
            <div className="user-chat-room-container">
                <div className="user-top-nav">
                    <div className="shop-name">프레이들 앤 스위츠</div>
                </div>


                <div className="chat-box">

                    <div className="message user">
                        <div className="bubble">
                            안녕하세요 뭐 좀 여쭙고 싶어서요
                        </div>
                        <div className="timestamp">PM 12:36</div>
                    </div>

                    <div className="message">
                        <div className="bubble">
                            네 고객님 어떤 게 궁금하실까요?
                        </div>
                        <div className="timestamp">PM 12:02</div>
                    </div>

                    <div className="message">
                        <div className="bubble">
                            개미는 아무 말도 하지 않지만
                        </div>
                        <div className="timestamp">PM 12:02</div>
                    </div>
                    <div className="message">
                        <div className="bubble">
                            개미는 아무 말도 하지 않지만<br/>
                            땀을 뻘뻘 흘리면서<br/>
                            매일 매일의 삶 길 위해서 열심히 일하네<br/>
                            개미는 뚠뚠 오늘도 뚠뚠
                        </div>
                        <div className="timestamp">PM 12:02</div>
                    </div>

                    <div className="message">
                        <div className="bubble">
                            개미는<br/>
                        </div>
                        <div className="timestamp">PM 12:02</div>
                    </div>

                    <div className="message">
                        <div className="bubble">
                            안녕하세요?
                        </div>
                        <div className="timestamp">PM 1:00</div>
                    </div>

                    <div className="message user">
                        <div className="bubble">
                            친절한 답변 감사해요
                        </div>
                        <div className="timestamp">PM 12:36</div>
                    </div>

                    <div className="message user">
                        <div className="bubble">
                            친절한 답변 감사해요
                        </div>
                        <div className="timestamp">PM 12:36</div>
                    </div>

                    <div className="message user">
                        <div className="bubble">
                            친절한 답변 감사해요
                        </div>
                        <div className="timestamp">PM 12:36</div>
                    </div>

                    <div className="message user">
                        <div className="bubble">
                            별 말씀을요! 그럼 17일에 뵙겠습니다
                        </div>
                        <div className="timestamp">PM 13:47</div>
                    </div>
                </div>

                <div className="input-box">
                    <input type="text" placeholder="Message here..."/>
                    <button>
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