import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminStore.css';


function AdminStore(){

    const [termsCheck, setTermsCheck] = useState(false);
    const [privacyCheck, setPrivacyCheck] = useState(false);


    const handleClickNext = () => {
        if(!termsCheck || !privacyCheck){
            alert('모두 동의해주세요.');
            return;
        }
        // 다른 페이지로 이동
        window.location.href = '/adminregist.signup'; // 이 부분을 수정
    }

    return (

        <div className="admin-store-regist-container">
                {/*Step Indicator*/}
            <div className="step-indicator">
                <div className="step active">
                    <div className="icon">
                        <p>STEP 01<br/>이용약관/개인정보방침 동의</p>
                    </div>
                </div>
                <div className="step">
                    <div className="icon">
                        <p>STEP 02<br/>신규등록</p>
                    </div>
                </div>
                <div className="step">
                    <div className="icon">
                        <p>STEP 03<br/>가게정보등록</p>
                    </div>
                </div>
                <div className="step">
                        <div className="icon">
                        <p>STEP 04<br/>가입완료</p>
                        </div>
                </div>
            </div>

            <div className="container">
                <div className="terms-section">
                    <input type="checkbox" id="terms" name="terms" checked={termsCheck} onChange={() => setTermsCheck(!termsCheck)}/>
                    <label htmlFor="terms">이용약관 동의</label>
                    <textarea disabled>
                        제 1 조 (목적)
                        이 약관은 블라블라...
                    </textarea>
                </div>

                <div className="privacy-section">
                    <input type="checkbox" id="privacy" name="privacy" checked={privacyCheck} onChange={() => setPrivacyCheck(!privacyCheck)}/>
                    <label htmlFor="privacy">개인정보취급방침 동의</label>
                    <textarea disabled>
                        개인정보취급방침 내용...
                    </textarea>
                </div>

                <div className="buttons">
                    <a href="">돌아가기</a>
                    <button type="submit" className="next-btn" onClick={handleClickNext} >다음단계 ▶</button>
                </div>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminStore />
);