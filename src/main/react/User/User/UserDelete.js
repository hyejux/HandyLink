import React, { useState, useEffect } from 'react';
import './UserDelete.css';
import ReactDOM from "react-dom/client";

function UserDelete() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isKakaoLogin, setIsKakaoLogin] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');


    // 사용자 로그인 방식 확인
    useEffect(() => {
        // 서버에서 로그인 정보를 확인해 isKakaoLogin을 설정
        fetch('/user/profile', { credentials: 'include' })
            .then((response) => response.json())
            .then((data) => setIsKakaoLogin(data.loginType === 'KAKAO'))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
    const handleConfirmationTextChange = (e) => setConfirmationText(e.target.value);

/*
    // 비밀번호 표시 토글 함수 (UserMyPage와 동일한 방식)
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };
*/

    const handleDeleteAccount = async () => {
        try {
            let response;
            if (isKakaoLogin) {
                response = await fetch('/kakao/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ confirmationText })
                });
            } else {
                response = await fetch('/user/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ password })
                });
            }

            if (response.ok) {
                const data = await response.json();
                alert(data.message || '탈퇴가 완료되었습니다.');
                window.location.href = '/UserLoginPage.user';
            } else {
                const errorData = await response.json();
                alert(errorData.error || '입력 정보가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('탈퇴 요청 중 오류 발생:', error);
        }
    };

    return (
        <div>
            <div className="delete-account-container">
                <div className="icon-circle">
                    <i className="bi bi-trash3"></i>
                </div>
                <h2>정말 탈퇴하시겠습니까?</h2>
                <p className="description">탈퇴 시 개인 정보 및 HandyLink에서 만들어진 모든 데이터가 삭제됩니다.</p>

                <div className="input-group">
                    {isKakaoLogin ? (
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="'delete'를 입력해 주세요."
                                value={confirmationText}
                                onChange={handleConfirmationTextChange}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="form-group password-group">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="비밀번호를 입력해 주세요."
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </div>

                            <div className="form-group password-group">
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    placeholder="비밀번호를 한 번 더 입력해 주세요."
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="button-group">
                    <button className="go-back-btn"
                            onClick={() => window.location.href = '/UserAccountPage.user'}>돌아가기
                    </button>
                    <button className="delete-btn" onClick={handleDeleteAccount}>탈퇴하기</button>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserDelete/>
);