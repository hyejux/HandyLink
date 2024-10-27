import React, { useState } from 'react';
import './UserDelete.css';
import ReactDOM from "react-dom/client";

function UserDelete() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

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
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await fetch('/user/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                alert('탈퇴가 완료되었습니다.');
                window.location.href = '/UserLoginPage.user';
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('탈퇴 요청 중 오류 발생:', error);
            alert('오류가 발생했습니다. 다시 시도해 주세요.');
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
                    <div className="form-group password-group">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="비밀번호를 입력해 주세요."
                            value={password}
                            onChange={handlePasswordChange}
                        />
{/*                        <div className="invisible-icon" onClick={togglePasswordVisibility}>
                            <i className={passwordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                        </div>*/}
                    </div>

                    <div className="form-group password-group">
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            placeholder="비밀번호를 한 번 더 입력해 주세요."
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
{/*                        <div className="invisible-icon" onClick={toggleConfirmPasswordVisibility}>
                            <i className={confirmPasswordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                        </div>*/}
                    </div>
                </div>

                <div className="button-group">
                    <button className="go-back-btn" onClick={() => window.location.href='/UserAccountPage.user'}>돌아가기</button>
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