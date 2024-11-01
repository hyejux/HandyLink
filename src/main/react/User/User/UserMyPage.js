import './UserMyPage.css';
import ReactDOM from "react-dom/client";
import React, {useState, useEffect} from "react";

function UserMyPage () {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repasswordVisible, setRepasswordVisible] = useState(false);
    const [isKakaoLogin, setIsKakaoLogin] = useState(false);

    const [userInfo, setUserInfo] = useState({
        userImgUrl: '/img/user_basic_profile.jpg',
        userId: '',
        userName: '',
        userPhonenum: '',
        userBirth: '',
        userGender: 'M',
        userPw: '',
        repassword: '',
    });
    const [file, setFile] = useState(null);


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleRepasswordVisibility = () => {
        setRepasswordVisible(!repasswordVisible);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

    const validateForm = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const namePattern = /^[가-힣a-zA-Z]+$/;
        const phonePattern = /^[0-9-]+$/;
        const birthPattern = /^(?:\d{6}|\d{8})$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!userInfo.userId || !emailPattern.test(userInfo.userId)) {
            alert("아이디는 이메일 형식이어야 하며 필수 입력 항목입니다.");
            return false;
        }
        if (userInfo.userName === '' || !namePattern.test(userInfo.userName)) {
            alert("이름은 한글 또는 영어만 입력 가능하며 필수 입력 항목입니다.");
            return false;
        }
        if (userInfo.userPhonenum === '' || !phonePattern.test(userInfo.userPhonenum)) {
            alert("연락처는 숫자 또는 숫자와 하이픈(-) 조합으로 입력해야 하며 필수 입력 항목입니다.");
            return false;
        }
        if (userInfo.userBirth === '' || !birthPattern.test(userInfo.userBirth)) {
            alert("생년월일은 8자리 또는 6자리 숫자만 입력 가능하며 필수 입력 항목입니다.");
            return false;
        }

        // 비밀번호가 입력된 경우에만 유효성 검사
        if (userInfo.userPw && !passwordPattern.test(userInfo.userPw)) {
            alert("비밀번호는 영문+특수문자+숫자 8자리 이상이어야 합니다.");
            return false;
        }
        if (userInfo.userPw && userInfo.userPw !== userInfo.repassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }

        return true;
    };

    // 수정 처리
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        // 비밀번호 확인 로직
        if (!isKakaoLogin && userInfo.userPw && userInfo.userPw !== userInfo.repassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const formData = new FormData();
        formData.append('userId', userInfo.userId);
        formData.append('userName', userInfo.userName);
        formData.append('userPhonenum', userInfo.userPhonenum);
        formData.append('userBirth', userInfo.userBirth);
        formData.append('userGender', userInfo.userGender);

        // 비밀번호가 있는 경우만 FormData에 추가
        if (!isKakaoLogin && userInfo.userPw) {
            formData.append('userPw', userInfo.userPw); // 새 비밀번호 추가
        }

        // 카카오 로그인 사용자는 파일 업로드를 처리하지 않음
        if (!isKakaoLogin && file) {
            formData.append('profileImage', file);
        } else if (userInfo.userImgUrl) {
            formData.append('userImgUrl', userInfo.userImgUrl);
        }

        try {
            const response = await fetch('/user/update', {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert("정보 수정이 완료되었습니다.");
                setUserInfo({
                    ...userInfo,
                    profileImage: result.userImgUrl || userInfo.profileImage, // 기존 이미지 유지
                });
                window.location.href='/UserAccountPage.user';
            } else {
                alert("정보 수정에 실패했습니다.");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('/user/profile', {
                    method: 'GET',
                    credentials: 'include' // 세션 쿠키를 자동으로 포함
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched user profile:', data);
                    setUserInfo({
                        ...userInfo,
                        userId: data.userId,
                        userName: data.userName,
                        userPhonenum: data.userPhonenum,
                        userBirth: data.userBirth,
                        userGender: data.userGender,
                        userImgUrl: data.userImgUrl || '/img/user_basic_profile.jpg',
                    });

                    if (data.loginType === 'KAKAO') {
                        setIsKakaoLogin(true);
                    }

                } else {
                    console.error('정보 가져오기 실패');
                }
            } catch (error) {
                console.error('정보 가져오기 실패:', error);
            }
        };

        fetchUserProfile();
    }, []);



    // 프로필 이미지 변경 및 미리보기
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserInfo({
                    ...userInfo,
                    userImgUrl: e.target.result // 미리보기 이미지 설정
                });
            };
            reader.readAsDataURL(selectedFile);
            setFile(selectedFile);  // 파일 상태 저장
        }
    };

    return (
        <div>
            <div className="user-mypage-container">
                <h2>마이 페이지</h2>
                <div className="profile-pic">
                    <img src={userInfo.userImgUrl} alt="Profile" id="profileImage"/>
                    {!isKakaoLogin && (
                        <div className="edit-icon" onClick={() => document.getElementById('fileInput').click()}>
                            <i className="bi bi-pencil-square"></i>
                        </div>
                    )}

                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        style={{display: "none"}}
                        onChange={handleFileChange}
                    />
                </div>

                <form className="user-mypage-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userId">ID</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={userInfo.userId}
                            disabled
                        />
                    </div>

                    {!isKakaoLogin && (
                        <>
                            <div className="form-group password-group">
                                <label htmlFor="userPw">PW</label>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="userPw"
                                    name="userPw" // name 속성 추가
                                    placeholder="비밀번호 입력"
                                    value={userInfo.userPw}
                                    onChange={handleInputChange}
                                />
                                <div className="invisible-icon1" onClick={togglePasswordVisibility}>
                                    <i className={passwordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                                </div>
                            </div>

                            <div className="form-group password-group">
                                <label htmlFor="repassword">RE-PASSWORD</label>
                                <input
                                    type={repasswordVisible ? "text" : "password"}
                                    id="repassword"
                                    name="repassword" // name 속성 추가
                                    placeholder="비밀번호 재입력"
                                    value={userInfo.repassword}
                                    onChange={handleInputChange}
                                />
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
                            value={userInfo.userName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="userPhonenum">PHONE NUMBER</label>
                        <input
                            type="text"
                            id="userPhonenum"
                            name="userPhonenum"
                            value={userInfo.userPhonenum}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="userBirth">BIRTHDATE</label>
                        <input
                            type="text"
                            id="userBirth"
                            name="userBirth"
                            value={userInfo.userBirth}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="userGender">GENDER</label>
                        <select
                            id="userGender"
                            name="userGender"
                            value={userInfo.userGender}
                            onChange={handleInputChange}
                        >
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                        </select>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="btn cancel" onClick={() => window.location.href = '/UserAccountPage.user'}>
                            취소
                        </button>
                        <button type="submit" className="btn update">
                            수정
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserMyPage/>
);