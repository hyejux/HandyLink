import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminRegist.css';

function AdminRegist() {
    const handleClickNext = () => {
        // 다른 페이지로 이동
        window.location.href = '/admin.admin'; // 이 부분을 수정
    };

    return (
    <div className="admin-signup-regist-container">
    {/* Step Indicator */}
    <div className="step-indicator">
    <div className="step">
    <div className="icon">
    <p>STEP 01<br />이용약관/개인정보방침 동의</p>
    </div>
    </div>
    <div className="step active">
    <div className="icon">
    <p>STEP 02<br />신규등록</p>
    </div>
    </div>
    <div className="step">
    <div className="icon">
    <p>STEP 03<br />가게정보등록</p>
    </div>
    </div>
    <div className="step">
    <div className="icon">
    <p>STEP 04<br />가입완료</p>
    </div>
    </div>
    </div>

    <div className="account-login-box">
    {/* User Info Section */}
    <div className="input-group" style={{ marginBottom: '20px' }}>
    <label htmlFor="username">아이디</label>
    <div className="btn-group">
    <input type="text" id="username" placeholder="아이디 입력" />
    <button className="btn-check">중복 체크</button>
    </div>
    </div>

    <div className="input-group" style={{ marginBottom: '20px' }}>
    <label htmlFor="password">비밀번호</label>
    <input type="password" id="password" placeholder="비밀번호 입력" />
    <p className="small-text">* 8~13자 이내의 영문자와 숫자 조합</p>
    </div>
    </div>

    <div className="account-store-box">
    {/* Business Info Section */}
    <div className="input-group">
    <label htmlFor="category">업종</label>
    <select id="category">
    <option>업종 선택</option>
    <option>케이크</option>
    <option>공방체험</option>
    <option>꽃집</option>
    </select>
    </div>

    <div className="input-group">
    <label htmlFor="store-name">상호명</label>
    <input type="text" id="store-name" placeholder="상호명 입력" />
    </div>

    <div className="input-group">
    <label htmlFor="representative">대표자명</label>
    <input type="text" id="representative" placeholder="대표자명 입력" />
    </div>

    <div className="input-group">
    <label htmlFor="manager">담당자명</label>
    <input type="text" id="manager" placeholder="담당자명 입력" />
    </div>

    <div className="input-group">
    <label htmlFor="phone">휴대전화번호</label>
    <input type="text" id="phone" placeholder="- 제외하고 입력" />
    </div>

    <div className="input-group">
    <label htmlFor="address">사업자 주소</label>
    <div className="btn-group">
    <input type="text" id="address" placeholder="우편번호" style={{ width: '20%' }} />
    <button className="btn-postcode">주소 검색</button>
    </div>
    <input type="text" placeholder="주소 검색" />
    <input type="text" placeholder="상세 주소 입력" />
    </div>

    <div className="input-group" style={{ marginBottom: '20px' }}>
    <label htmlFor="business-no">사업자등록번호</label>
    <input type="text" id="business-no" placeholder="사업자등록번호 입력" />
    </div>
    </div>

    <div className="buttons">
    <button type="button" className="cancel-btn">◀ 이전</button>
    <button type="submit" className="next-btn" onClick={handleClickNext}>다음단계 ▶</button>
    </div>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<AdminRegist />
);
