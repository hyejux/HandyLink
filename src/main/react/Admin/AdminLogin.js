import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './AdminLogin.css'

function AdminLogin(){



    return(
    <div className="parts">
        <div className="part1">
            <div className="top-text"> 편리한 주문 <br/>편리한 제작</div>
            <div className="bottom-text"> HandyLink에서<br/>경험해보세요.</div>
        </div>

        <div className="part2">
            <div className="login-container">
                <div className="login-title">HandyLink</div>
                <div className="login-box">
                    <input type="text" placeholder="아이디" />
                    <input type="password" placeholder="비밀번호" />
                    <div className="find-msg">
                        <a href="">
                            아이디/비밀번호 찾기
                        </a>
                    </div>
                </div>

                <button type="button"> 로그인 </button>

                <div className="singup-msg">
                    <a href="storesignup.signup">
                        <span> 스토어 입점하기 </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminLogin />
);