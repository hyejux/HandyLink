import ReactDOM from "react-dom/client";
import React, {useState, useEffect} from "react";
import './UserSignUp.css';

function UserSignUp() {
    // 이미지 미리보기
    const [previewImage, setPreviewImage] = useState("/img/user_basic_profile.jpg");
    // 비밀번호 감췄다 드러냈다
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repasswordVisible, setRepasswordVisible] = useState(false);
    // 이미지 저장
    const [file, setFile] = useState(null);
    // 폼 입력을 위한 상태
    const [formData, setFormData] = useState({
        userId: '',
        userPw: '',
        repassword: '',
        userName: '',
        userBirth: '',
        userGender: 'M',
        userPhonenum: '',
        userImgUrl: ''
    });
    // 중복 확인 여부
    const [idChecked, setIdChecked] = useState(false);

    // 카카오 회원가입 여부 상태
    const [isKakaoSignUp, setIsKakaoSignUp] = useState(false);

    useEffect(() => {
        // 카카오 사용자 정보가 세션에 저장된 경우 불러오기
        fetch('/user/kakao-info')
            .then(response => response.json())
            .then(data => {
                console.log("로그 Kakao user info:", data);

                if (data.userName || data.userImgUrl) {
                    // 카카오 회원가입 시
                    setIsKakaoSignUp(true);  // 카카오 회원가입일 경우 true로 설정

                    // 서버에서 받아온 값을 formData로 업데이트
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        userName: data.userName || '', // 서버에서 받은 userName을 formData에 설정
                        userImgUrl: data.userImgUrl || '' // 서버에서 받은 프로필 이미지 URL을 formData에 설정
                    }));

                    // 프로필 이미지 미리보기 업데이트
                    if (data.userImgUrl) {
                        setPreviewImage(data.userImgUrl);  // 미리보기 이미지 업데이트
                    }
                }
            })
            .catch(error => console.error('Error fetching Kakao user info:', error));
    }, []);



    // 입력값 변화 시 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (name === 'userId') {
            setIdChecked(false); // 이메일이 변경될 때마다 중복 체크 초기화
        }
    };

    // 프로필 사진 업로드 및 미리보기 처리
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        console.log('선택된 파일:', selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result); // 미리보기 이미지 변경
            };
            reader.readAsDataURL(selectedFile);
            setFile(selectedFile);  // 파일 상태 저장
        }
    };

    // 비밀번호 감춤/보기 토글
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleRepasswordVisibility = () => {
        setRepasswordVisible(!repasswordVisible);
    };

    // 아이디 중복 확인
    const handleCheckId = async () => {

        if (!formData.userId) {
            alert("이메일을 입력해주세요.");
            return;
        }

        try {
            const response = await fetch(`/user/checkId?userId=${formData.userId}`);

            const result = await response.json();
            if (result.isDuplicate) {
                alert("이미 사용 중인 이메일입니다.");
                setIdChecked(false);
            } else {
                alert("사용 가능한 이메일입니다.");
                setIdChecked(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // 회원 가입 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 폼 데이터 유효성 검사
        if (!isKakaoSignUp && formData.userPw !== formData.repassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 카카오 회원가입 시 ID(이메일) 중복 체크를 하지 않음
        if (!isKakaoSignUp && !idChecked) {
            alert("이메일 중복 확인을 해주세요.");
            return;
        }

        try {
            let response;
            if (isKakaoSignUp) {
                // 카카오 회원가입
                const kakaoData = {
                    userId: formData.userId,
                    userName: formData.userName,
                    userPhonenum: formData.userPhonenum,
                    userBirth: formData.userBirth,
                    userGender: formData.userGender,
                    userImgUrl: formData.userImgUrl // 카카오에서 제공한 이미지 URL
                };
                response = await fetch('/user/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(kakaoData)
                });
            } else {
                // 일반 회원가입
                const data = new FormData();
                data.append('userId', formData.userId);
                data.append('userPw', formData.userPw);
                data.append('userName', formData.userName);
                data.append('userPhonenum', formData.userPhonenum);
                data.append('userBirth', formData.userBirth);
                data.append('userGender', formData.userGender);

                if (file) {
                    data.append('profileImage', file);
                    console.log('프로필 이미지 추가됨:', file);
                }

                response = await fetch('/user/signup', {
                    method: 'POST',
                    body: data,
                });
            }

            if (response.ok) {
                const result = await response.text();
                alert(result);
                window.location.href = '/UserSignUpFinish.user';
            } else {
                const errorText = await response.text();
                console.log('서버 응답 오류:', response.status, errorText);
                alert(`회원가입 실패: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    };


    return (
        <div>
            <div className="signup-container">
                <h2>회원 가입</h2>
                <div className="profile-img">
                    <img src={previewImage} alt="Profile Picture" id="profileImage"/>
                    <div className="edit-icon" onClick={() => document.getElementById('fileInput').click()}><i
                        className="bi bi-pencil-square"></i></div>
                    <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange}
                           style={{display: "none"}}/>
                </div>
                <form className="form-signup" onSubmit={handleSubmit}>
                    {!isKakaoSignUp && (
                        <div className="form-group">
                            <label htmlFor="userId">ID</label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                className="effect-8"
                                placeholder="이메일 입력"
                                value={formData.userId}
                                onChange={handleInputChange}
                            />
                            <div className="focus-border"><i></i></div>
                            <button type="button" className="btn-checkid" onClick={handleCheckId}>중복 확인</button>
                        </div>
                    )}

                    {!isKakaoSignUp && (
                        <>
                            <div className="form-group password-group">
                                <label htmlFor="userPw">PASSWORD</label>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="userPw"
                                    name="userPw"
                                    className="effect-8"
                                    placeholder="비밀번호 입력"
                                    value={formData.userPw}
                                    onChange={handleInputChange}
                                />
                                <div className="focus-border"><i></i></div>
                                <div className="invisible-icon1" onClick={togglePasswordVisibility}>
                                    <i className={passwordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                                </div>
                            </div>

                            <div className="form-group password-group">
                                <label htmlFor="repassword">RE-PASSWORD</label>
                                <input
                                    type={repasswordVisible ? "text" : "password"}
                                    id="repassword"
                                    name="repassword"
                                    className="effect-8"
                                    placeholder="비밀번호 재입력"
                                    value={formData.repassword}
                                    onChange={handleInputChange}
                                />
                                <div className="focus-border"><i></i></div>
                                <div className="invisible-icon2" onClick={toggleRepasswordVisibility}>
                                    <i className={repasswordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="userName">NAME</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            className="effect-8"
                            placeholder="이름 입력"
                            value={formData.userName}
                            onChange={handleInputChange}
                        />
                        <div className="focus-border"><i></i></div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="userPhonenum">PHONE NUMBER</label>
                        <input
                            type="text"
                            id="userPhonenum"
                            name="userPhonenum"
                            className="effect-8"
                            placeholder="연락처 입력"
                            value={formData.userPhonenum}
                            onChange={handleInputChange}
                        />
                        <div className="focus-border"><i></i></div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="userBirth">BIRTHDATE (YYYY-MM-DD)</label>
                        <input
                            type="text"
                            id="userBirth"
                            name="userBirth"
                            className="effect-8"
                            placeholder="생년월일 입력 (예: 20000101)"
                            value={formData.userBirth}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="userGender">GENDER</label>
                        <select
                            id="userGender"
                            name="userGender"
                            className="effect-8"
                            value={formData.userGender}
                            onChange={handleInputChange}
                        >
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-signup">가입하기</button>
                </form>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserSignUp/>
);