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
        console.log("로그인 시도 중:", { userId, userPw });

        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 변경된 상태 변수명을 사용
                body: JSON.stringify({ userId, userPw }),
            });

            console.log("서버 응답 상태 코드:", response.status); // 서버 응답 코드 확인

            if (response.ok) {
                const data = await response.json();
                alert('로그인 성공!');
                window.location.href = '/UserMyPage.user';
            } else {
                alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('로그인 중 오류가 발생했습니다.');
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