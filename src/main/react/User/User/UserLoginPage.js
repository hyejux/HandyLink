import React, { useState } from 'react';
import './UserLoginPage.css';
import ReactDOM from "react-dom/client";

function UserLoginPage () {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // 로그인 처리 함수
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    userId: userId,
                    userPw: userPw
                }),
            });

            if (response.ok) {
                window.location.href = '/UserMyPage.user';  // 로그인 성공 시 이동
            } else {
                alert('로그인 실패');
            }
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
        }
    };
    return (
        <div>
            <div className="user-login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>로그인</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            placeholder=" "
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <label htmlFor="userId">이메일</label>
                    </div>

                    <div className="form-group">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="userPw"
                            name="userPw"
                            placeholder=" "
                            value={userPw}
                            onChange={(e) => setUserPw(e.target.value)}
                        />
                        <label htmlFor="userPw">비밀번호</label>
                        <div className="invisible-icon" onClick={togglePasswordVisibility}>
                            <i className={passwordVisible ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                        </div>
                    </div>

                    <button type="submit" className="btn-dologin">
                        로그인
                    </button>
                </form>

                <div className="findaccount" onClick={() => window.location.href = '/UserAccountFind.user'}>아이디 찾기 |
                    비밀번호 찾기
                </div>
                <div className="divider">또는</div>

                <div className="social-login">
                <img src="/img/kakao_login.png" alt="Kakao Login" title="Kakao 로그인"/>
                </div>

                <div className="footer-text">
                    아직 계정이 없으신가요? <span onClick={() => window.location.href = '/UserSignUp.user'}>회원가입</span>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserLoginPage/>
);