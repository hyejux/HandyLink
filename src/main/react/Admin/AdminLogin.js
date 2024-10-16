import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminLogin.css';

function AdminLogin() {
    const [inputLogin, setInputLogin] = useState({
        id: '',
        pw: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputLogin({
            ...inputLogin,
            [name]: value
        });
    };

    useEffect(() => {
        console.log("id & pw : ", inputLogin);
    }, [inputLogin]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/loginForm', {
                id: inputLogin.id,
                pw: inputLogin.pw
            });

            const storeId = response.data;
            console.log(storeId);

            if (response.status === 200 && storeId) { // storeId가 null 또는 빈 문자열이 아닌지 확인
                alert(`로그인 성공 ${storeId}`);
                window.location.href = `/admin.admin?storeId=${storeId}`;
            } else {
                alert('해당 정보를 찾을 수 없습니다.');
            }

        } catch (error) {
            console.error('로그인 시도 중 오류:', error);
            alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
        }
    };

    return (
    <div className="parts">
        <div className="part1">
            <div className="top-text">편리한 주문 <br />편리한 제작</div>
            <div className="bottom-text">HandyLink에서<br />경험해보세요.</div>
        </div>

        <div className="part2">
            <form onSubmit={handleSubmit}>
                <div className="login-container">
                    <div className="login-title">HandyLink</div>
                    <div className="login-box">
                        <input
                            type="text"
                            name="id" // name 속성 추가
                            placeholder="아이디"
                            value={inputLogin.id}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="pw" // name 속성 추가
                            placeholder="비밀번호"
                            value={inputLogin.pw}
                            onChange={handleChange}
                        />
                        <div className="find-msg">
                            <a href="">
                                아이디/비밀번호 찾기
                            </a>
                        </div>
                    </div>

                    <button type="submit">로그인</button>

                    <div className="singup-msg">
                        <a href="storesignup.signup">
                            <span>스토어 입점하기</span>
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminLogin />
);
