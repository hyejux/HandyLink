import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './TermsOfUse.css';
import './StoreInfo.css';
import './StoreInfoRegist.css';
import './StoreRegistComplete.css';


function StoreSignUp() {
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
        storeAddr: {
            zipcode: '',
            addr:'',
            addrdetail:''
        },
        storeBusinessNo:''
    });

    //step03
    const [storeInfoRegistData, setStoreInfoRegistData] = useState ({
        storeIntro: '',
        storeNotice: '',
        storeOpenTime: '',
        storeCloseTime: '',
        storeDayOff: [],
        storeParkingYn: '',
        storeSns: [
            { snsLink: '', snsName: '' }, // 첫 번째 SNS 세트
            { snsLink: '', snsName: '' }, // 두 번째 SNS 세트
            { snsLink: '', snsName: '' }  // 세 번째 SNS 세트
        ],
        storeAccount: {
            accountBank: '',
            accountNumber: ''
        },
        imageUrl: []
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
                    storeAddr: {
                        ...prevData.storeAddr,
                        zipcode: data.zonecode,
                        addr: addr,
                        addrdetail: '' // 상세 주소는 비워둡니다.
                    }
                }));

                // 상세주소 필드로 커서 이동
                detailAddressRef.current.focus();
            }
        }).open();
    };

    //휴무일 이벤트
    const handleChangeDayOff = (e) => {
        const { value, checked } = e.target;

        setStoreInfoRegistData(prevData => {
            const updatedDayOff = checked
            ? [...prevData.storeDayOff, value] // 체크
            : prevData.storeDayOff.filter(day => day !== value); // 체크 해제

            return {
                ...prevData,
                storeDayOff: updatedDayOff
            };
        });
    };

    //주차여부
    const handleChangeParking = (e) => {
        const { value } = e.target;

        setStoreInfoRegistData(prevData => ({
            ...prevData,  // prevData를 펼치고 새 객체로 만듭니다.
            storeParkingYn: value // parking 속성을 업데이트합니다.
        }));
    };

    //sns링크-이름
    const handleChangeSns = (index, field, value) => {
        const updatedSNS = [...storeInfoRegistData.storeSns];
        updatedSNS[index][field] = value;
        setStoreInfoRegistData(prevData => ({
            ...prevData,
            storeSns: updatedSNS
        }));
    };

    //account값 저장
    const handleChangeAccount = (e) => {
        const { name, value } = e.target;

        if(name === 'accountBank'){
            setStoreInfoRegistData(prevData => ({
                ...prevData,
                storeAccount: {
                    ...prevData.storeAccount,
                    accountBank: value
                }
            }));
        }else if (name === 'accountNumber'){
            setStoreInfoRegistData(prevData => ({
                ...prevData,
                storeAccount: {
                    ...prevData.storeAccount,
                    accountNumber: value
                }
            }));
        }
    }

    //step03 인풋저장
    const handleChangeInfo = (e) => {
        const { id, value } = e.target;
        setStoreInfoRegistData({
            ...storeInfoRegistData,
            [id]: value // id 속성에 해당하는 값을 동적으로 업데이트
        });
    }

    useEffect (() => {
        console.log("step02 ",storeInfoData);
        console.log("step03 ",storeInfoRegistData);
    },[storeInfoData, storeInfoRegistData]);

    //step03 사진 업로드
    const [selectedImages, setSelectedImages] = useState([]); // 화면에 보여질 파일 리스트
//    const [selectedFiles, setSelectedFiles] = useState([]); // 서버에 전송할 파일 리스트

    const onSelectFile = (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files); // 선택된 파일들 배열로 변환

        // 이미지는 8장 이하일 때만 추가
        if (selectedImages.length + files.length <= 8) {
            const newImages = files.map((file) => URL.createObjectURL(file)); // URL 생성
            const newImageUrls = [...storeInfoRegistData.imageUrl, ...files.map(file => URL.createObjectURL(file))];

            // 상태 업데이트
            setSelectedImages((prev) => [...prev, ...newImages]);
            setStoreInfoRegistData((prev) => ({
                ...prev,
                imageUrl: newImageUrls // URL 배열로 업데이트
            }));
        } else {
            alert('이미지는 최대 8장까지 업로드 가능합니다.');
        }
    };

    const removeImage = (index) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setStoreInfoRegistData((prev) => ({
            ...prev,
            imageUrl: prev.imageUrl.filter((_, i) => i !== index) // URL 업데이트
        }));
    };
    //사진업로드

    //등록하기
    const handleStoreRegist = async() => {
        try {
            const response = await axios.post('/adminStore/registStore',{
                ...storeInfoData,
                ...storeInfoRegistData
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
            <p>STEP 03<br/>가게정보등록</p>
            </div>
            </div>
            <div className={`step ${currentStep === 4 ? 'active' : ''}`}>
            <div className="icon">
            <p>STEP 04<br/>가입완료</p>
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
                            <input type="text" id="storeId" placeholder="아이디 입력" onChange={(e) => handleChangeStore(e)}/>
                            <button className="btn-check">중복 체크</button>
                        </div>
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
                            <input type="text" id="zipcode" value={storeInfoData.storeAddr.zipcode} ref={postcodeRef} placeholder="우편번호" style={{ width: '20%' }} readOnly />
                            <input type="button" className="btn-postcode" onClick={openPostcode} style={{ width: '20%' }} value="우편번호 찾기" />
                        </div>
                        <input type="text" id="addr" value={storeInfoData.storeAddr.addr} ref={addressRef} placeholder="주소" readOnly />
                        <input type="text" id="addrdetail" value={storeInfoData.storeAddr.addrdetail} ref={detailAddressRef} placeholder="상세주소"
                            onChange={(e) =>
                                setStoreInfoData(prevData => ({
                                    ...prevData,
                                    storeAddr: {
                                        ...prevData.storeAddr,
                                        addrdetail: e.target.value
                                    }
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
                    <button type="submit" className="next-btn" onClick={handleClickNext}>다음단계 ▶</button>
                </div>
            </div>
        )}


        {/* step03 가게정보등록 */}
        {currentStep === 3 && (
            <div className="admin-store-info-regist-container">

                {/* Main Form */}
                <div className="noti-text">
                    <i className="bi bi-check-lg"></i>
                    해당 사이트에 등록할 가게 정보를 입력하는 단계입니다.
                </div>

                <label htmlFor="storeIntro">소개</label>
                <textarea id="storeIntro" rows="4" placeholder="가게 소개를 입력하세요." style={{ maxHeight: "80px", overflowY: "auto" }} onChange={handleChangeInfo}></textarea>

                <label htmlFor="storeNotice">공지사항</label>
                <textarea id="storeNotice" rows="4" placeholder="공지사항을 입력하세요." style={{ maxHeight: "80px", overflowY: "auto" }} onChange={handleChangeInfo} ></textarea>

                <div className="operating-hours">
                    <label htmlFor="hours">영업 시간</label>
                    <div className="op-hours">
                        <label htmlFor="storeOpenTime"> 시작 <input type="time" id="storeOpenTime" onChange={handleChangeInfo} /></label>
                        <label htmlFor="storeCloseTime"> 마감 <input type="time" id="storeCloseTime" onChange={handleChangeInfo} /></label>
                    </div>
                </div>

                <div className="dayoffs">
                    <label htmlFor="dayoffs">휴무일</label>
                    <div className="dayoff">
                        <label htmlFor="mon"><input type="checkbox" name="dayoff" id="mon" value="월요일" onChange={handleChangeDayOff}/> 월요일</label>
                        <label htmlFor="tue"><input type="checkbox" name="dayoff" id="tue" value="화요일" onChange={handleChangeDayOff} /> 화요일</label>
                        <label htmlFor="wed"><input type="checkbox" name="dayoff" id="wed" value="수요일" onChange={handleChangeDayOff} /> 수요일</label>
                        <label htmlFor="thu"><input type="checkbox" name="dayoff" id="thu" value="목요일" onChange={handleChangeDayOff} /> 목요일</label>
                        <label htmlFor="fri"><input type="checkbox" name="dayoff" id="fri" value="금요일" onChange={handleChangeDayOff} /> 금요일</label>
                        <label htmlFor="sat"><input type="checkbox" name="dayoff" id="sat" value="토요일" onChange={handleChangeDayOff} /> 토요일</label>
                        <label htmlFor="sun"><input type="checkbox" name="dayoff" id="sun" value="일요일" onChange={handleChangeDayOff} /> 일요일</label>
                    </div>
                </div>

                <div className="parking">
                    <label htmlFor="parking">주차 여부</label>
                    <div className="parking-yn">
                        <label htmlFor="parkingY"><input type="radio" name="parking" id="parkingY" value="Y" checked={storeInfoRegistData.storeParkingYn === 'Y'} onChange={handleChangeParking}/> 주차 가능</label>
                        <label htmlFor="parkingN"><input type="radio" name="parking" id="parkingN" value="N" checked={storeInfoRegistData.storeParkingYn === 'N'} onChange={handleChangeParking}/> 주차 불가</label>
                    </div>
                </div>

                <div className="sns">
                    <label htmlFor="sns">SNS 링크(선택)
                        <span className="small-text">* 최대 3개</span>
                    </label>
                    <div className="sns-box">
                        <input type="text" className="snsLink" placeholder="링크를 입력하세요" value={storeInfoRegistData.storeSns[0].snsLink} onChange={(e)=>handleChangeSns(0, 'snsLink', e.target.value)} />
                        <input type="text" className="snsName" placeholder="표기 ex) 인스타그램" value={storeInfoRegistData.storeSns[0].snsName} onChange={(e)=>handleChangeSns(0, 'snsName', e.target.value)} />
                    </div>
                    <div className="sns-box">
                        <input type="text" className="snsLink" placeholder="링크를 입력하세요" value={storeInfoRegistData.storeSns[1].snsLink} onChange={(e)=>handleChangeSns(1, 'snsLink', e.target.value)} />
                        <input type="text" className="snsName" placeholder="표기 ex) 인스타그램" value={storeInfoRegistData.storeSns[1].snsName} onChange={(e)=>handleChangeSns(1, 'snsName', e.target.value)} />
                    </div>
                    <div className="sns-box">
                        <input type="text" className="snsLink" placeholder="링크를 입력하세요" value={storeInfoRegistData.storeSns[2].snsLink} onChange={(e)=>handleChangeSns(2, 'snsLink', e.target.value)} />
                        <input type="text" className="snsName" placeholder="표기 ex) 인스타그램" value={storeInfoRegistData.storeSns[2].snsName} onChange={(e)=>handleChangeSns(2, 'snsName', e.target.value)} />
                    </div>
                </div>

                <div className="account">
                    <label htmlFor="account">계좌번호</label>
                    <div className="account-info">
                        <select className="account-bank" name="accountBank" onChange={handleChangeAccount}>
                            <option value="">은행 선택</option>
                            <option value="농협">농협</option>
                            <option value="국민">국민</option>
                            <option value="하나">하나</option>
                            <option value="우리">우리</option>
                            <option value="카카오뱅크">카카오뱅크</option>
                        </select>
                        <input type="text" id="account-number" name="accountNumber" placeholder="- 제외하고 입력하세요." style={{width: '30%'}} onChange={handleChangeAccount}/>
                    </div>
                </div>

                <div className="photo-upload">
                    <label htmlFor="photos">사진
                        <span className="small-text">* 최대 8장</span>
                    </label>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        파일 업로드
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple // 여러 파일 선택 가능
                        onChange={onSelectFile}
                        accept=".png, .jpg, image/*"
                        style={{ display: 'none', marginTop: '10px' }} // 항상 보이도록 설정
                    />
                    {selectedImages.length ? (
                        <div className="photo-grid">
                            {selectedImages.map((image, index) => (
                                <div key={index} className="photo-item">
                                    <img src={image} alt={`첨부파일 ${index + 1}`} />
                                    <i className="bi bi-x-circle-fill" onClick={() => removeImage(index)}></i>
                                </div>
                            ))}
                        </div>
                        ) : (
                        <div className="photo-grid">파일을 첨부할 수 있습니다.</div>
                    )}

                </div>

                <div className="buttons">
                    <button type="button" className="cancel-btn" onClick={handleGoBack}>◀ 이전</button>
                    <button type="submit" className="next-btn" onClick={handleStoreRegist} >등록하기 ▶</button>
                </div>
            </div>
        )}


        {/* step04 가입완로 */}
        {currentStep === 4 && (
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

                    <button type="button" className="login-go-btn" onClick={() => { location.href = '/adminlogin.signup';}}> 로그인하기 </button>
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

