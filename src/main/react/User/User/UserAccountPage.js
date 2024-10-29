import './UserAccountPage.css';
import ReactDOM from "react-dom/client";
import React, {useState, useEffect} from "react";

function UserAccountPage () {
    const [isKakaoLogin, setIsKakaoLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({
        userImgUrl: '/img/user_basic_profile.jpg',
        userName: '',
    });

// 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('/user/profile', {
                    method: 'GET',
                    credentials: 'include' // 세션 쿠키 자동 포함
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched user profile:', data);
                    setUserInfo({
                        userImgUrl: data.userImgUrl || '/img/user_basic_profile.jpg',
                        userName: data.userName,
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

    // 로그아웃
    const handleLogout = () => {
        if (isKakaoLogin) {
            // 카카오 로그아웃 처리
            const REST_API_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
            // const LOGOUT_REDIRECT_URI = 'http://172.30.1.99:8585/UserLoginPage.user';
            const LOGOUT_REDIRECT_URI = 'http://localhost:8585/kakao/logout';

            // 카카오 로그아웃 URL
            const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${encodeURIComponent(LOGOUT_REDIRECT_URI)}`;

            // 로컬 스토리지에서 사용자 정보 제거
            localStorage.removeItem('token');
            localStorage.removeItem('kakaoAccessToken');

            // 카카오 로그아웃 요청
            window.location.href = logoutUrl; // 카카오 로그아웃 페이지로 이동
        } else {
            // 일반 회원 로그아웃 처리
            window.location.href = '/logout'; // 시큐리티 로그아웃 경로
        }
    };





    return (
        <div>
            <div className="settings-container">
                <div className="user-info">
                    <img className="profile-img" src={userInfo.userImgUrl} alt="Profile Image" id="profileImage"/>
                    <div className="user-details" onClick={() =>  window.location.href = '/UserMyPage.user'}>
                        <h2>{userInfo.userName}</h2>
                        <p>프로필 편집</p>
                        <span className="arrow">></span>
                    </div>
                </div>

                <div className="settings-menu">
                    <ul>
                        <li>
                            <div className="menu-item">
                                <span>내 후기</span>
                                <span className="status">15건</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="settings-menu">
                    <ul>
                        <li>
                            <div className="menu-item">
                                <span>내가 찜한 가게</span>
                                <span className="status">32건</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="settings-submenu">
                    <ul>
                        <li><a href="#">고객 센터</a></li>
                        <li><a onClick={handleLogout}>로그아웃</a></li>
                    </ul>
                </div>

                <div className="settings-menu">
                    <ul>
                        <li>
                            <div className="menu-delete" onClick={() =>  window.location.href = '/UserDelete.user'}>
                                <span>탈퇴하기</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserAccountPage/>
);