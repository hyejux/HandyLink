import ReactDOM from "react-dom/client";
import './UserAccountFind.css';
import React, { useState, useEffect } from "react";

function UserAccountFind () {
    const [formType, setFormType] = useState("id"); // 'id' 또는 'pw'
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // 입력 필드를 초기화하는 함수
    const clearInputFields = () => {
        setId("");
        setName("");
        setPhone("");
    };

    // 아이디 찾기 폼 보이기
    const showIdForm = () => {
        setFormType("id");
        clearInputFields();
    };

    // 비밀번호 찾기 폼 보이기
    const showPwForm = () => {
        setFormType("pw");
        clearInputFields();
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
    }, [id, name, phone]);


    return (
        <div>
            <div className="user-account-find">
                <div className="user-account-find-toggle">
                    <button
                        type="button"
                        id="find-id-btn"
                        onClick={showIdForm}
                        style={{
                            backgroundColor: formType === "id" ? "#4653C0" : "#E5E5EA",
                            color: formType === "id" ? "#fff" : "#000",
                        }}
                    >
                        아이디 찾기
                    </button>
                    <button
                        type="button"
                        id="find-pw-btn"
                        onClick={showPwForm}
                        style={{
                            backgroundColor: formType === "pw" ? "#4653C0" : "#E5E5EA",
                            color: formType === "pw" ? "#fff" : "#000",
                        }}
                    >
                        비밀번호 찾기
                    </button>
                </div>

                <div className="user-account-msg">
                    가입 시 기입한 정보로 입력해 주세요.
                </div>

                <form id="account-form">
                    {/* 아이디 찾기/비밀번호 찾기에 따라 필드 보이기 */}
                    {formType === "pw" && (
                        <div className="form-group" id="id-form-group">
                            <input
                                type="text"
                                id="id"
                                placeholder=" "
                                value={id}
                                onChange={(e) => setId(e.target.value)}
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
                            id="name"
                            placeholder=" "
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <label htmlFor="name">이름</label>
                        <div className="highlight"></div>
                        <div className="bar"></div>
                    </div>
                    <div className="form-group" id="phone-form-group">
                        <input
                            type="text"
                            id="phone-number"
                            placeholder=" "
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                    >
                        {formType === "id" ? "아이디 찾기" : "비밀번호 찾기"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserAccountFind/>
);