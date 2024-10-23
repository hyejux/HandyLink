import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import './AdminStoreInfo.css';

function AdminStoreInfo() {
    // 세션 스토리지에서 storeId 가져오기
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');
    console.log("세션에서 가져온 storeId: ", storeId);
    console.log("세션에서 가져온 storeNo: ", storeNo);

    const [storeInfo, setStoreInfo] = useState({
        storeId,
        storeNo,
        storePw:'',
        storeCate:'',
        storeName:'',
        storeMaster:'',
        managerName:'',
        managerPhone:'',
        zipcode: '',
        addr:'',
        addrdetail:'',
        storeBusinessNo:'',
        storeSignup:''
    });

    useEffect(() => {
        const fetchStoreImages = async () => {
            try {


                // sessionId가 null이 아닌 경우에만 API 요청
                if (storeId) {
                    const response = await axios.get(`/adminStore/myStoreInfo?storeNo=${storeNo}`);
                    console.log("업체정보: ", response.data);
                    setStoreInfo(response.data); // 상태 업데이트
                } else {
                    console.log("세션 ID가 없습니다.");
                }
            } catch (error) {
                console.log("error: ", error);
            }
        };

        fetchStoreImages();
        console.log("마이페이지 확인 ", storeInfo);

    }, []);

    //수정하기
    const [isDisabled, setIsDisabled] = useState(true);

    const handleChangeStoreInfo = (e) => {
      const {id, value} = e.target;

        setStoreInfo(prev => ({
            ...prev,
            [id]: value
        }));
    };

    console.log("마이페이지 ", storeInfo);

    //주소
    const postcodeRef = useRef(null);
    const addressRef = useRef(null);
    const detailAddressRef = useRef(null);

    // 우편번호 검색 기능
    const openPostcode = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function(data) {
                    let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
                    let extraAddr = '';

                    if (data.userSelectedType === 'R') {
                        if (data.bname && /[동|로|가]$/g.test(data.bname)) {
                            extraAddr += data.bname;
                        }
                        if (data.buildingName && data.apartment === 'Y') {
                            extraAddr += (extraAddr ? ', ' : '') + data.buildingName;
                        }
                        extraAddr = extraAddr ? ` (${extraAddr})` : '';
                    }

                    setStoreInfo(prevData => ({
                        ...prevData,
                        zipcode: data.zonecode,
                        addr: addr,
                        addrdetail: ''
                    }));

                    detailAddressRef.current.focus();
                }
            }).open();
        } else {
            console.error("Postcode library is not loaded");
        }
    };

    //수정하기
    const toggleModify = async () => {
        if (isDisabled) {
            setIsDisabled(false);
        } else {
            try {
                await axios.post('/adminStore/updateStoreInfo', {
                    storeInfo
                });
                setIsDisabled(true);
            } catch (error) {
                console.log("Error updating store info: ", error);
            }
        }
    };


    return(
    <div className="admin-store-info-container">
        <h1>My Store</h1>

        <div className="form-cont">
            <div className="form-group">
                <label htmlFor="store-name">상호명</label>
                <div className="input-field">
                    <input type="text" id="storeName" value={storeInfo.storeName} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="username">아이디</label>
                <div className="input-field">
                    <input type="text" id="storeId" value={storeInfo.storeId} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <div className="input-field">
                    <input type="text" id="storePw" value={storeInfo.storePw} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="storeMaster">대표자</label>
                <div className="input-field">
                    <input type="text" id="storeMaster" value={storeInfo.storeMaster} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="manager">담당자명</label>
                <div className="input-field">
                    <input type="text" id="managerName" value={storeInfo.managerName} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="contact">연락처</label>
                <div className="input-field">
                    <input type="text" id="managerPhone" value={storeInfo.managerPhone} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            {!isDisabled ? (
                <div className="form-group">
                    <label htmlFor="address">사업자 주소</label>
                    <div className="input-field">
                        <div className="btn-group">
                            <input type="text" id="zipcode" value={storeInfo.zipcode} ref={postcodeRef} placeholder="우편번호" style={{ width: '35%' }} placeholder="우편번호" readOnly />
                            <input type="button" className="btn-postcode" onClick={openPostcode} style={{ width: '27%' }} value="주소검색" />
                        </div>
                        <input type="text" id="addr" value={storeInfo.addr} ref={addressRef} placeholder="주소" style={{ marginBottom: '5px' }} readOnly />
                        <input type="text" id="addrdetail" value={storeInfo.addrdetail} ref={detailAddressRef} placeholder="상세주소"
                        onChange={(e) =>
                            setStoreInfo(prevData => ({
                                ...prevData,
                                addrdetail: e.target.value
                            }))
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className="form-group">
                    <label htmlFor="address">가게 주소</label>
                    <div className="input-field">
                        <input type="text" id="addr" value={storeInfo.addr} onChange={handleChangeStoreInfo} style={{marginBottom: '5px'}} disabled />
                        <input type="text" id="addrdetail" value={storeInfo.addrdetail} onChange={handleChangeStoreInfo} disabled />
                    </div>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="storeBusinessNo">사업자등록번호</label>
                <div className="input-field">
                    <input type="text" id="storeBusinessNo" value={storeInfo.storeBusinessNo} onChange={handleChangeStoreInfo} disabled={isDisabled}/>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="storeSignup">가입일</label>
                <div className="input-field">
                    <input type="text" id="storeSignup" value={storeInfo.storeSignup}/>
                </div>
            </div>

        </div>

        <button type="button" className="modify-btn" onClick={toggleModify}>
            {isDisabled ? '수정하기' : '수정완료'}
        </button>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminStoreInfo />);
