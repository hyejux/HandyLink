import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './TermsOfUse.css';
import './StoreInfo.css';
import './StoreInfoRegist.css';
import './StoreRegistComplete.css';


function StoreSignUp() {
    const inputRef = useRef(null); // input 요소를 참조할 ref 생성
    const [termsCheck, setTermsCheck] = useState(false); //이용약관동의
    const [privacyCheck, setPrivacyCheck] = useState(false); //개인정보동의
    const [currentStep, setCurrentStep] = useState(1); // 현재 스텝 상태

    //step02
    const [storeInfoData, setStoreInfoData] = useState ({
        storeId:'',
        storePw:'',
        storeCate:'',
        storeName:'',
        storeMaster:'',
        managerName:'',
        managerPhone:'',
        storeBusinessNo:'',
        zipcode: '',
        addr:'',
        addrdetail:''
    });

    // 스텝증가
    const handleClickNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    // 스텝감소
    const handleGoBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    //step02 - input상태값 저장
    const handleChangeStore = (e) => {
        const { id, value } = e.target;
        setStoreInfoData({
            ...storeInfoData,
            [id]: value // id 속성에 해당하는 값을 동적으로 업데이트
        });
    };

    //id중복체크
    const [isDuplicate, setIsDuplicate] = useState(null);

    const handleDuplicatedId = async() => {
        try{
            const response = await axios.post('/adminStore/duplicatedIdCheck', {storeId: storeInfoData.storeId});

            if (response.data > 0) { // 중복된 경우
                setIsDuplicate(true);
                inputRef.current.focus(); // input 요소에 포커스 주기
            } else {
                setIsDuplicate(false); // 중복되지 않은 경우
            }

        } catch (error) {
            console.log("중복검사실패 ", error);
            alert('아이디 중복 검사 중 오류 발생');
        }
    };

    // Ref를 사용하여 입력 필드에 접근합니다.
    const postcodeRef = useRef(null);
    const addressRef = useRef(null);
    const detailAddressRef = useRef(null);
    const extraAddressRef = useRef(null);

    // 우편번호 검색 기능
    const openPostcode = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let addr = ''; // 주소 변수
                let extraAddr = ''; // 참고항목 변수

                // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 도로명 주소 선택
                    addr = data.roadAddress;
                } else { // 지번 주소 선택
                    addr = data.jibunAddress;
                }

                // 도로명 주소일 경우 참고항목 추가
                if (data.userSelectedType === 'R') {
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    if (extraAddr !== '') {
                        extraAddr = ' (' + extraAddr + ')';
                    }
                }

                // 주소정보설정
                setStoreInfoData(prevData => ({
                    ...prevData,
                    zipcode: data.zonecode,
                    addr: addr,
                    addrdetail: ''
                }));

                // 상세주소 필드로 커서 이동
                detailAddressRef.current.focus();
            }
        }).open();
    };

    //주차여부
    const handleChangeParking = (e) => {
        const { value } = e.target;

        setStoreInfoRegistData(prevData => ({
            ...prevData,  // prevData를 펼치고 새 객체로 만듭니다.
            storeParkingYn: value // parking 속성을 업데이트합니다.
        }));
    };

    useEffect (() => {
        console.log("step02 ",storeInfoData);
    },[storeInfoData]);



    //등록하기
    const handleStoreRegist = async() => {
        try {
            const response = await axios.post('/adminStore/registStore',{
                ...storeInfoData
            });
            if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
            }
            console.log('성공 ', response.data);
        } catch (error){
            console.error('error ', error);
        }
    };

    return (
    <div className="admin-body">
        {/*Step Indicator*/}
        <div className="step-indicator">
            <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
                <div className="icon">
                <p>STEP 01<br/>이용약관/개인정보방침 동의</p>
                </div>
            </div>
            <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                <div className="icon">
                <p>STEP 02<br/>신규등록</p>
                </div>
            </div>
            <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
                <div className="icon">
                <p>STEP 03<br/>가입완료</p>
                </div>
            </div>
        </div>

        {/* step 01 약관동의 */}
        {currentStep === 1 &&(
            <div className="admin-termsofuse-container">
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
                        <a href="" id="gohome">돌아가기</a>
                        <button type="submit" className="next-btn" onClick={handleClickNext} >다음단계 ▶</button>
                    </div>
                </div>
            </div>
        )}





        {/* step 02 신규등록 */}
        {currentStep === 2 && (
            <div className="admin-store-info-container">
                {/* Step Indicator */}
                <div className="account-login-box">
                    {/* User Info Section */}
                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="storeId">아이디</label>
                        <div className="btn-group">
                            <input type="text" id="storeId" value={storeInfoData.storeId} placeholder="아이디 입력" onChange={(e) => handleChangeStore(e)} ref={inputRef}/>
                            <button className="btn-check" onClick={handleDuplicatedId}>중복 체크</button>
                        </div>
                        {isDuplicate === true && <p style={{color:'red'}}>이미 사용 중인 아이디입니다.</p>}
                        {isDuplicate === false && <p style={{color:'green'}}>사용 가능한 아이디입니다.</p>}
                    </div>

                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="storePw">비밀번호</label>
                            <input type="password" id="storePw" placeholder="비밀번호 입력" onChange={(e) => handleChangeStore(e)}/>
                            <p className="small-text">* 8~13자 이내의 영문자와 숫자 조합</p>
                        </div>
                    </div>

                    <div className="account-store-box">
                    {/* Business Info Section */}
                    <div className="input-group">
                        <label htmlFor="category">업종</label>
                        <select id="storeCate" onChange={(e)=>handleChangeStore(e)}>
                            <option value="">업종 선택</option>
                            <option value="케이크">케이크</option>
                            <option value="공방체험">공방체험</option>
                            <option value="꽃집">꽃집</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="storeName">상호명</label>
                        <input type="text" id="storeName" placeholder="상호명 입력" onChange={(e)=>handleChangeStore(e)} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="storeMaster">대표자명</label>
                        <input type="text" id="storeMaster" placeholder="대표자명 입력" onChange={(e)=>handleChangeStore(e)} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="managerName">담당자명</label>
                        <input type="text" id="managerName" placeholder="담당자명 입력" onChange={(e)=>handleChangeStore(e)} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="managerPhone">휴대전화번호</label>
                        <input type="text" id="managerPhone" placeholder="- 제외하고 입력" onChange={(e)=>handleChangeStore(e)} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="address">사업자 주소</label>
                        <div className="btn-group">
                            <input type="text" id="zipcode" value={storeInfoData.zipcode} ref={postcodeRef} placeholder="우편번호" style={{ width: '20%' }} readOnly />
                            <input type="button" className="btn-postcode" onClick={openPostcode} style={{ width: '20%' }} value="우편번호 찾기" />
                        </div>
                        <input type="text" id="addr" value={storeInfoData.addr} ref={addressRef} placeholder="주소" readOnly />
                        <input type="text" id="addrdetail" value={storeInfoData.addrdetail} ref={detailAddressRef} placeholder="상세주소"
                            onChange={(e) =>
                                setStoreInfoData(prevData => ({
                                    ...prevData,
                                    addrdetail: e.target.value
                                }))
                            }
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="storeBusinessNo">사업자등록번호</label>
                        <input type="text" id="storeBusinessNo" placeholder="사업자등록번호 입력" onChange={(e)=>handleChangeStore(e)} />
                    </div>
                </div>

                <div className="buttons">
                    <button type="button" className="cancel-btn" onClick={handleGoBack}>◀ 이전</button>
                    <button type="submit" className="next-btn" onClick={handleStoreRegist}>등록하기 ▶</button>
                </div>
            </div>
        )}


        {/* step03 가입완로 */}
        {currentStep === 3 && (
            <div class="admin-store-regist-container">
                {/* Main Form */}
                <div class="admin-singup-complete-container">
                    <div class="singup-complete-title">
                    <i class="bi bi-check-circle-fill"></i> 회원 가입 완료
                    </div>

                    <div class="singup-complete-content">
                        <div>
                            <span> 팬케이크샵 가로수길점 </span> 승인 대기 중 ...
                        </div>
                        <div>
                            * 회원가입 내역 확인 및 수정은 <span>마이페이지</span>에서 확인 가능합니다.
                        </div>
                    </div>

                    <button type="button" className="login-go-btn" onClick={() => { location.href = '/adminlogin.login';}}> 로그인하기 </button>
                </div>
            </div>
        )}
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StoreSignUp />
);

