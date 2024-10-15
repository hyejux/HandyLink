import './UserMyPage.css';
import ReactDOM from "react-dom/client";
import React, {useState, useEffect} from "react";

function UserMyPage () {
    const [profileImage, setProfileImage] = useState("/img/user_basic_profile.jpg"); // 초기 프로필 이미지
    const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호
    const [repasswordVisible, setRepasswordVisible] = useState(false);

    const [userInfo, setUserInfo] = useState({
        profileImage: "/img/user_basic_profile.jpg",
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

    // 수정 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (userInfo.userPw && userInfo.userPw !== userInfo.repassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const formData = new FormData();
        formData.append('userId', userInfo.userId);
        formData.append('userName', userInfo.userName);
        formData.append('userPhonenum', userInfo.userPhonenum);
        formData.append('userBirth', userInfo.userBirth);
        formData.append('userGender', userInfo.userGender);

        // 비밀번호가 입력된 경우에만 서버로 전송
        if (userInfo.userPw) {
            formData.append('userPw', userInfo.userPw);
        }

        // 파일이 있을 때만 프로필 이미지를 추가
        if (file) {
            formData.append('profileImage', file);
        }

        try {
            const response = await fetch('/user/update', {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert("정보 수정이 완료되었습니다.");
                setUserInfo({
                    ...userInfo,
                    profileImage: result.userImgUrl || userInfo.profileImage
                });
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
                    setUserInfo({
                        ...userInfo,
                        userId: data.userId,
                        userName: data.userName,
                        userPhonenum: data.userPhonenum,
                        userBirth: data.userBirth,
                        userGender: data.userGender,
                        profileImage: data.userImgUrl,
                    });
                } else {
                    console.error('정보 가져오기 실패');
                }
            } catch (error) {
                console.error('정보 가져오기 실패 삐융:', error);
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
                    profileImage: e.target.result // 미리보기 이미지 설정
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
                    <img src={userInfo.profileImage} alt="Profile" id="profileImage"/>
                    <div className="edit-icon" onClick={() => document.getElementById('fileInput').click()}>
                        <i className="bi bi-pencil-square"></i>
                    </div>
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

                    <div className="form-group password-group">
                        <label htmlFor="userPw">PW</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="userPw"
                            placeholder="비밀번호 입력"
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
                            placeholder="비밀번호 재입력"
                        />
                        <div className="invisible-icon2" onClick={toggleRepasswordVisibility}>
                            <i className={repasswordVisible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                        </div>
                    </div>

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
                        <button type="button" className="btn cancel">
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