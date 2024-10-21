import ReactDOM from "react-dom/client";
import './UserAccountFind.css';
import React, { useState, useEffect } from "react";

function UserAccountFind () {
    const [formType, setFormType] = useState("userId"); // 'id' 또는 'pw'
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [phonenum, setPhonenum] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [foundId, setFoundId] = useState(null);
    const [isUserVerified, setIsUserVerified] = useState(false);
    const [message, setMessage] = useState("");

    // 입력 필드를 초기화하는 함수
    const clearInputFields = () => {
        setUserId("");
        setUserName("");
        setPhonenum("");
        setNewPassword("");
        setConfirmPassword("");
        setFoundId(null);
        setIsUserVerified(false);
        setMessage("");
    };

    // 아이디 찾기 폼 보이기
    const showIdForm = () => {
        setFormType("userId");
        clearInputFields();
        setFoundId(null);
        setMessage("");
    };

    // 비밀번호 찾기 폼 보이기
    const showPwForm = () => {
        setFormType("userPw");
        clearInputFields();
        setFoundId(null);
        setMessage("");
    };

    // input 필드에 값이 있을 경우 'used' 클래스 추가
    useEffect(() => {
        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => {
            // 값이 있을 때 'used' 클래스 추가
            if (input.value) {
                input.classList.add("used");
            } else {
                input.classList.remove("used");
            }

            input.addEventListener("blur", () => {
                if (input.value) {
                    input.classList.add("used");
                } else {
                    input.classList.remove("used");
                }
            });
        });
    }, [userId, userName, phonenum, newPassword, confirmPassword]);

    // 아이디 찾기 함수
    const handleFindId = async () => {
        try {
            const response = await fetch(`/user/find-id?userName=${userName}&phonenum=${phonenum}`);
            if (response.ok) {
                const data = await response.text();
                setFoundId(data);
                setMessage("");
            } else {
                setMessage("사용자 정보를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("Error finding user ID:", error);
        }
    };

    // 비밀번호 찾기 함수
    const handleVerifyUser = async () => {
        try {
            const response = await fetch("/user/verify-reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, userName, phonenum }),
            });
            const data = await response.json();
            if (data.verified) {
                setIsUserVerified(true);
                setMessage("");
            } else {
                setIsUserVerified(false);
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Error verifying user:", error);
        }
    };

    // 비밀번호 초기화 함수
    const handleResetPassword = async () => {

        if (newPassword !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await fetch("/user/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newPassword }),
            });
            const data = await response.json();
            if (data.success) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                clearInputFields();
                setFormType("id");
                window.location.href = '/UserLoginPage.user';
            } else {
                alert(data.message || "비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            alert("비밀번호 변경에 실패했습니다.");
        }
    };

    return (
        <div>
            <div className="user-account-find">
                <div className="user-account-find-toggle">
                    <button
                        type="button"
                        id="find-id-btn"
                        onClick={showIdForm}
                        style={{
                            backgroundColor: formType === "userId" ? "#4653C0" : "#E5E5EA",
                            color: formType === "userId" ? "#fff" : "#000",
                        }}
                    >
                        아이디 찾기
                    </button>
                    <button
                        type="button"
                        id="find-pw-btn"
                        onClick={showPwForm}
                        style={{
                            backgroundColor: formType === "userPw" ? "#4653C0" : "#E5E5EA",
                            color: formType === "userPw" ? "#fff" : "#000",
                        }}
                    >
                        비밀번호 찾기
                    </button>
                </div>

                <div className="user-account-msg">
                    가입 시 기입한 정보로 입력해 주세요.
                </div>

                <form id="account-form">
                    {/* 사용자 검증이 되지 않은 경우 아이디, 이름, 연락처 입력 폼 표시 */}
                    {!isUserVerified && (
                        <>
                            {formType === "userPw" && (
                                <div className="form-group" id="id-form-group">
                                    <input
                                        type="text"
                                        id="userId"
                                        placeholder=" "
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="id">아이디</label>
                                    <div className="highlight"></div>
                                    <div className="bar"></div>
                                </div>
                            )}
                            <div className="form-group" id="name-form-group">
                                <input
                                    type="text"
                                    id="userName"
                                    placeholder=" "
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                                <label htmlFor="name">이름</label>
                                <div className="highlight"></div>
                                <div className="bar"></div>
                            </div>
                            <div className="form-group" id="phone-form-group">
                                <input
                                    type="text"
                                    id="phonenum"
                                    placeholder=" "
                                    value={phonenum}
                                    onChange={(e) => setPhonenum(e.target.value)}
                                    required
                                />
                                <label htmlFor="phone-number">연락처</label>
                                <div className="highlight"></div>
                                <div className="bar"></div>
                            </div>
                            <button
                                type="button"
                                className="btn-findaccount"
                                id="btn-findaccount"
                                onClick={formType === "userId" ? handleFindId : handleVerifyUser}
                            >
                                {formType === "userId" ? "아이디 찾기" : "비밀번호 찾기"}
                            </button>
                        </>
                    )}
                </form>


                {/* 아이디 찾기 결과 표시 */}
                {foundId && (
                    <div className="found-id">
                        찾은 아이디: {foundId}
                    </div>
                )}

                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}

                {/* 사용자 검증 완료 시 새 비밀번호 입력 폼 표시 */}
                {isUserVerified && (
                    <form id="reset-password-form">
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder=" "
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="new-password">새 비밀번호</label>
                            <div className="highlight"></div>
                            <div className="bar"></div>
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder=" "
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="confirm-password">새 비밀번호 확인</label>
                            <div className="highlight"></div>
                            <div className="bar"></div>
                        </div>
                        <button
                            type="button"
                            className="btn-findaccount"
                            onClick={handleResetPassword}
                        >
                            비밀번호 변경
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserAccountFind/>
);