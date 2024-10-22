import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './MyStore.css';

function TestMyStore() {
    // 세션 스토리지에서 storeId 가져오기
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');
    console.log("세션 storeId: ", storeId);
    console.log("세션 storeNo: ", storeNo);

    const [myStoreInfo, setMyStoreInfo] = useState({
        storeId: storeId,
        storeNo: storeNo,
        storeIntro: '',
        storeNotice: '',
        storeOpenTime: '',
        storeCloseTime: '',
        storeParkingYn: '',
        accountBank: '',
        accountNumber: '',
        storeStatus: '',
        storeSns: [{ snsLink: '', snsName: ''}]
    });

    const [initialMyStore, setInitialMyStore] = useState(myStoreInfo);

    //해당가게정보가져오기
    useEffect(() => {
        const fetchMyStoreInfo = async() => {
            try{
                if(storeId && storeNo){
                    const resp = await axios.get(`/adminStore/myStoreInfo?storeNo=${storeNo}`);
                    console.log("불러온 데이터 이거 ", resp.data);
                    setMyStoreInfo(resp.data);
                    setInitialMyStore(resp.data);
                } else{
                    console.log("세션에 아이디정보가 없습니다.");
                }

            }catch (error){
                console.log("가게목록 부르는 중 error ",error);
            };
        }
        fetchMyStoreInfo();
//        console.log("불러온 데이터 ",myStoreInfo);
    },[]);

    const [isDisabled, setIsDisabled] = useState(true);


    const handleChangeInfo = (e) => {
        const { id, value } = e.target;
        setMyStoreInfo(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleChangeInform = (e) => {
        const { name, value } = e.target;
        setMyStoreInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeDayOff = (e) => {
        const { value, checked } = e.target;
        setMyStoreInfo(prevState => ({
            ...prevState,
            storeDayOff: checked
            ? [...prevState.storeDayOff, value]
            : prevState.storeDayOff.filter(day => day !== value)
        }));
    };

    const handleChangeSns = (index, field, value) => {
        const updatedSns = [...myStoreInfo.storeSns];
        updatedSns[index][field] = value;

        setMyStoreInfo(prevState => ({
            ...prevState,
            storeSns: updatedSns
        }));
    };

    const handleFixSns = (index) => {
        const fixSns = [...myStoreInfo.storeSns];
        const snsLink = fixSns[index].snsLink.toLowerCase();

        // 링크 유효성 검사
        if (snsLink.includes('instagram')) {
            fixSns[index].snsName = '인스타그램';
        } else if (snsLink.includes('facebook')) {
            fixSns[index].snsName = '페이스북';
        } else if (snsLink.includes('youtube')) {
            fixSns[index].snsName = '유튜브';
        } else {
            alert('등록이 불가능한 SNS입니다.');
            return; // 유효하지 않으면 저장 중단
        }

        fixSns[index].isDisabled = !fixSns[index].isDisabled;
        setMyStoreInfo(prevState => ({
            ...prevState,
            storeSns: fixSns
        }));
    };



    const handleDeleteSns = (index) => {
        const updatedSns = myStoreInfo.storeSns.filter((_, idx) => idx !== index);
        setMyStoreInfo(prevState => ({
            ...prevState,
            storeSns: updatedSns
        }));
    };
    
//    console.log("확인 ", myStoreInfo);
    
    //입력하기
    const handleClickSet = async() => {
        if(isDisabled == true){
            setIsDisabled(!isDisabled);
        }
        console.log("수정", isDisabled);

        try {
            if (!isDisabled){
                // 저장되지 않은 SNS를 체크
                const hasUnsavedSns = myStoreInfo.storeSns.some(sns => !sns.isDisabled); // 저장되지 않은 SNS가 있는지 확인
                const hasEmptySnsLink = myStoreInfo.storeSns.some(sns => sns.snsLink === ''); // 링크가 비어있는지 확인

                if (hasUnsavedSns || hasEmptySnsLink) {
                    alert("저장되지 않은 SNS 링크가 있습니다.");
                    return; // 저장되지 않은 SNS가 있을 경우 입력을 막음
                }

                const response = await axios.post('/adminStore/updateStore',{ //update
                    storeId: myStoreInfo.storeId,
                    storeNo: myStoreInfo.storeNo,
                    storeIntro: myStoreInfo.storeIntro,
                    storeNotice: myStoreInfo.storeNotice,
                    storeOpenTime: myStoreInfo.storeOpenTime,
                    storeCloseTime: myStoreInfo.storeCloseTime,
                    storeParkingYn: myStoreInfo.storeParkingYn,
                    accountBank: myStoreInfo.accountBank,
                    accountNumber: myStoreInfo.accountNumber,
                    storeSns: myStoreInfo.storeSns.map(sns => ({
                        storeId: myStoreInfo.storeId,
                        storeNo: myStoreInfo.storeNo,
                        snsLink: sns.snsLink,
                        snsName: sns.snsName
                    })),
                    storeStatus: myStoreInfo.storeStatus
                });
                console.log("등록성공 ", response.data);
                window.location.href='/mystore.admin';
            }

        }catch (error){
            console.log("error발생 ", error);
        }
    };


    //수정취소
    const handleCancel = () => {
        setMyStoreInfo(initialMyStore);
        setIsDisabled(true);
    };

    

    return (
    <div className="admin-store-info-container">
        <h1>My Store</h1>

        {/* 기본 정보 섹션 */}
        <div className="section-container">
            <h2>기본 정보</h2>
            <div className="section-content">
                <div className="form-group">
                    <label htmlFor="storeStatus">공개 여부</label>
                    <div className="radio-group public-yn">
                        <label htmlFor="storeStatusY">
                            <input type="radio" name="storeStatus" id="storeStatusY" value="활성화" checked={myStoreInfo.storeStatus === '활성화'} onChange={handleChangeInform} disabled={isDisabled} /> 공개
                        </label>
                        <label htmlFor="storeStatusN">
                            <input type="radio" name="storeStatus" id="storeStatusN" value="비활성화" checked={myStoreInfo.storeStatus === '비활성화'} onChange={handleChangeInform} disabled={isDisabled} /> 비공개
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="parking">주차 여부</label>
                    <div className="parking-yn">
                        <label htmlFor="parkingY"><input type="radio" name="storeParkingYn" id="parkingY" value="Y" checked={myStoreInfo.storeParkingYn === 'Y'} onChange={handleChangeInform} disabled={isDisabled} /> 주차 가능</label>
                        <label htmlFor="parkingN"><input type="radio" name="storeParkingYn" id="parkingN" value="N" checked={myStoreInfo.storeParkingYn === 'N'} onChange={handleChangeInform} disabled={isDisabled} /> 주차 불가</label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="storeOpenTime">영업 시작 시간</label>
                    <input type="time" id="storeOpenTime" value={myStoreInfo.storeOpenTime} onChange={handleChangeInfo} disabled={isDisabled} />

                    <label htmlFor="storeCloseTime">영업 종료 시간</label>
                    <input type="time" id="storeCloseTime" value={myStoreInfo.storeCloseTime} onChange={handleChangeInfo} disabled={isDisabled} />
                </div>

                <div className="form-group">
                    <label htmlFor="storeIntro">소개</label>
                    <div className="input-field" >
                        <textarea rows="4" id="storeIntro"  value={myStoreInfo.storeIntro} onChange={handleChangeInfo} disabled={isDisabled} style={{resize:'none', height: '150px'}} />
                    </div>
                </div>


                <div className="form-group">
                    <label htmlFor="storeNotice">공지사항</label>
                    <div className="input-field">
                        <textarea rows="4" id="storeNotice" value={myStoreInfo.storeNotice} onChange={handleChangeInfo} disabled={isDisabled} style={{resize:'none', height: '150px'}}/>
                    </div>
                </div>
            </div>
        </div>

        {/* SNS 관리 섹션 */}
        <div className="section-container">
            <h2>SNS 관리</h2>
            <div className="sns-content sns-management">
                {myStoreInfo.storeSns.length < 3 && !isDisabled && (
                    <button type="button" onClick={() => setMyStoreInfo(prevState => ({
                            ...prevState,
                            storeSns: [...prevState.storeSns, { snsLink: ''}]
                        }))}>
                        SNS 링크 추가
                    </button>
                )}
                {myStoreInfo.storeSns.map((sns, index) => (
                    (sns.snsLink || !isDisabled) ? (
                        <div key={index} className="sns-row">
                            <label>SNS {index + 1}</label>

                            {(sns.isDisabled || isDisabled) ? (
                                <div className="sns-fix">
                                    {sns.snsLink}
                                </div>
                            ) : (
                                <input
                                type="text"
                                className="snsLink"
                                placeholder={`SNS ${index + 1} 링크를 입력하세요`}
                                value={sns.snsLink}
                                onChange={(e) => handleChangeSns(index, 'snsLink', e.target.value)}
                                disabled={sns.isDisabled}
                                />
                            )}
                            {!isDisabled && index > -1 && (
                                <>
                                    <button type="button" onClick={() => handleFixSns(index)}>
                                        {sns.isDisabled ? '수정':'저장'}
                                    </button>
                                    <button type="button" onClick={() => handleDeleteSns(index)}>
                                        삭제
                                    </button>
                                </>
                            )}
                        </div>
                    ) : null
                ))}
            </div>
        </div>

        {/* 계좌 관리 섹션 */}
        <div className="section-container">
            <h2>계좌 관리</h2>
            <div className="account-content">
                <div className="form-group">
                    <label htmlFor="account">계좌번호</label>
                    <div className="account-info">
                        <select className="account-bank" name="accountBank" value={myStoreInfo.accountBank} onChange={handleChangeInform} disabled={isDisabled}>
                            <option value="">은행 선택</option>
                            <option value="농협">농협</option>
                            <option value="국민">국민</option>
                            <option value="하나">하나</option>
                            <option value="우리">우리</option>
                            <option value="카카오뱅크">카카오뱅크</option>
                        </select>
                        <input type="text" id="accountNumber" name="accountNumber" placeholder="- 제외하고 입력하세요." value={myStoreInfo.accountNumber} onChange={handleChangeInform} style={{ width: '70%' }} disabled={isDisabled} />
                    </div>
                </div>
            </div>
        </div>

{/*<div className="photo-upload">
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
    {selectedImages.map((url, index) => (
        <div key={index} className="photo-item">
            <img src={url} alt={`첨부파일 ${index + 1}`} />
            <i className="bi bi-x-circle-fill" onClick={() => removeImage(index)}></i>
        </div>
    ))}
</div>
) : (
<div className="photo-grid">파일을 첨부할 수 있습니다.</div>
)}

</div>
*/}


        <button type="button" className="modify-btn" onClick={handleClickSet}>
            {isDisabled ? '수정하기' : '수정완료'}
        </button>

        {!isDisabled && (
            <button type="button" className="cancel-btn" onClick={handleCancel}>
            취소
            </button>
        )}

    </div>
);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TestMyStore />);
