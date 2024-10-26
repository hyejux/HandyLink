import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './MyStore.css';

function MyStore() {
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
        storeSns: [{ snsLink: '', snsName: ''}],
        storeImg:[{storeImgLocation: ''}]
    });

    const [initialMyStore, setInitialMyStore] = useState(myStoreInfo);

    //해당가게정보가져오기
    useEffect(() => {
        const fetchMyStoreInfo = async() => {
            try{
                if(storeId && storeNo){
                    const resp = await axios.get(`/adminStore/myStoreInfo?storeNo=${storeNo}`);
                    console.log("불러온 데이터 이거 ", resp.data);
                    setMyStoreInfo(info => ({
                        ...resp.data,
                        storeImg: resp.data.storeImg.map(img => ({ storeImgLocation: img.storeImgLocation })) // 배열로 수정
                    }));

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

    //영업시간 30분 단위로 입력
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                times.push(time);
            }
        }
        return times;
    };

    //step03 사진 업로드
    const [selectedImages, setSelectedImages] = useState([]); // 화면에 보여질 파일 리스트 (미리보기 URL)
    const onSelectFile = async (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files); // 선택된 파일들 배열로 변환

        // 이미지는 8장 이하일 때만 추가
        if (selectedImages.length + files.length < 8) {

            // 미리보기
            const selectImgs = files.map(file => URL.createObjectURL(file));
            setSelectedImages(prev => [...prev, ...selectImgs]);

            // 파일 업로드
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    // 서버에 파일 업로드
                    const response = await axios.post('/adminStore/uploadImageToServer', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    // 서버에서 반환된 URL
                    return response.data; // imageUrl만 반환해야 합니다.
                } catch (error) {
                    console.error("파일 업로드 오류: ", error); // 오류 로그 추가
                    alert("파일 업로드에 실패했습니다. 다시 시도해 주세요."); // 사용자에게 오류 알림
                    return null; // 오류가 발생할 경우 null 반환
                }
            });

            // 모든 URL을 받아서 상태 업데이트
            const imageUrls = await Promise.all(uploadPromises);
            console.log("업로드된 이미지 URL들: ", imageUrls); // 확인 로그 추가

            // null 값 필터링
            const filteredUrls = imageUrls.filter(url => url !== null);

            if (filteredUrls.length > 0 && filteredUrls !== null) {

                setMyStoreInfo(prev => ({
                    ...prev,
                    storeImg: [
                        ...(prev.storeImg || []),
                        ...filteredUrls.map(url => ({ storeImgLocation: url })) // URL을 객체로 변환하여 추가
                    ]
                }));
            } else {
                alert("업로드된 파일 중 중복된 파일이 있습니다.");
            }
        } else {
            alert('이미지는 최대 8장까지 업로드 가능합니다.');
        }
    };

    const removeImage = (index, isUploadedImage) => {
        // 이미지를 삭제할 때 서버 요청 없이 로컬 상태에서만 삭제
        if (isUploadedImage) {
            // Store 정보 업데이트 (서버에서 가져온 이미지 삭제)
            setMyStoreInfo((prev) => ({
                ...prev,
                storeImg: prev.storeImg.filter((_, i) => i !== index),
            }));
        } else {
            // 새로 선택된 이미지일 경우 (미리보기 상태)
            setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
        }
    };

    //사진업로드

    console.log("myStoreInfo ",myStoreInfo);


    //입력하기
    const handleClickSet = async() => {
        if(isDisabled == true){
            setIsDisabled(!isDisabled);
        }
        console.log("수정", isDisabled);

        try {
            if (!isDisabled){
                // 저장되지 않은 SNS를 체크
                const hasUnsavedSns = myStoreInfo.storeSns.some(sns => sns.isDisabled); // 저장되지 않은 SNS가 있는지 확인
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
                    storeImg: myStoreInfo.storeImg.map(img => ({
                        storeId: myStoreInfo.storeId,
                        storeNo: myStoreInfo.storeNo,
                        storeImgLocation: img.storeImgLocation
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
                    <select id="storeOpenTime" value={myStoreInfo.storeOpenTime} onChange={handleChangeInfo}  disabled={isDisabled} className="time-select">
                        <option value="" disabled>시간 선택</option>
                        {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>

                    <label htmlFor="storeCloseTime">영업 종료 시간</label>
                    <select id="storeCloseTime" value={myStoreInfo.storeCloseTime} onChange={handleChangeInfo} disabled={isDisabled} className="time-select">
                        <option value="" disabled>시간 선택</option>
                        {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>


                <div className="form-group">
                    <label htmlFor="storeIntro">소개</label>
                    <div className="input-field" >
                        <textarea rows="4" id="storeIntro"  value={myStoreInfo.storeIntro} onChange={handleChangeInfo} disabled={isDisabled} />
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
                            storeSns: [...prevState.storeSns, { snsLink: '', isDisabled: true }]
                        }))}>
                        SNS 링크 추가
                    </button>
                )}
                {myStoreInfo.storeSns.map((sns, index) => (
                    (sns.snsLink || !isDisabled) ? (
                        <div key={index} className="sns-row">
                            <label>SNS {index + 1}</label>

                            {(!sns.isDisabled || isDisabled) ? (
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
                                disabled={!sns.isDisabled}
                                />
                            )}
                            {!isDisabled && index > -1 && (
                                <>
                                    <button type="button" onClick={() => handleFixSns(index)}>
                                        {!sns.isDisabled ? '수정':'저장'}
                                    </button>
                                    <button type="button" className="snsDelete-btn" onClick={() => handleDeleteSns(index)}>
                                        <i class="bi bi-x-square-fill"></i>
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



        <div className="section-container">
            <h2>사진 관리</h2>
            <label htmlFor="file-upload" className="custom-file-upload">
                파일 업로드
            </label>
            <input
                id="file-upload"
                type="file"
                multiple // 여러 파일 선택 가능
                onChange={onSelectFile}
                accept=".png, .jpg, .jpeg, image/*"
                style={{ display: 'none', marginTop: '10px' }}
                disabled={isDisabled}
            />
            <div className="photo-grid">
                {/* DB에서 가져온 이미지 */}
                {myStoreInfo.storeImg.length > 0 && myStoreInfo.storeImg.map((imgurl, index) => (
                    imgurl.storeImgLocation ? (
                    <div key={imgurl.storeImgLocation} className="photo-item">
                        <img src={imgurl.storeImgLocation} alt={`DB 이미지 ${index + 1}`} />
                        {!isDisabled && (
                            <i className="bi bi-x-circle-fill" onClick={() => removeImage(index, true)}></i>
                        )}
                    </div>
                ) : null
                ))}

                {/* 선택된 이미지 */}
                {!isDisabled && selectedImages.length > 0 && selectedImages.map((url, index) => (
                    <div key={url} className="photo-item">
                        <img src={url} alt={`첨부파일 ${index + 1}`} />
                            <i className="bi bi-x-circle-fill" onClick={() => removeImage(index, false)}></i>
                    </div>
                ))}
            </div>
        </div>



        <div className="btn-box">
            <button type="button" className="modify-btn" onClick={handleClickSet}>
                {isDisabled ? '수정하기' : '수정완료'}
            </button>

            {!isDisabled && (
                <button type="button" className="cancel-btn" onClick={() => window.location.href = '/mystore.admin'}>
                    취소
                </button>
            )}
        </div>
    </div>
);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MyStore />);
