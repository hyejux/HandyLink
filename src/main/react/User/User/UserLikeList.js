import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import './UserLikeList.css';

function UserLikeList(){

    const [myLikeList, setMyLikeList] = useState([]);

    useEffect(()=>{
        const fetchgetLike = async() => {
            try {
                //찜 리스트 불러오기
                const resp = await axios.get('/userStoreList/getLikeInfo');
                if (resp.status === 200) {
                    const data = resp.data;

                    // 같은 store_no를 가진 첫 번째 항목 찾기
                    const uniqueStores = {};
                    data.forEach(item => {
                        if (!uniqueStores[item.store_no]) {
                            uniqueStores[item.store_no] = { ...item }; // 첫 번째 항목 저장
                        }
                    });

                    // uniqueStores 객체를 배열로 변환
                    const uniqueStoresArray = Object.values(uniqueStores);

                    setMyLikeList(uniqueStoresArray); // 전체 찜 리스트 설정
                }

            }catch (error){
                console.log("찜리스트 불러오기 중 error ", error);
            }
        };
        fetchgetLike();
    },[]);

    console.log("찜리스트 ", myLikeList);

    return (
        <div className="favorite-list">
            <h1 className="title">찜 리스트</h1>
            <div className="category-buttons">
                <button className="category-button active">케이크</button>
                <button className="category-button">공방</button>
                <button className="category-button">꽃</button>
            </div>

            <div className="card-list">
                {myLikeList.length > 0 ? (
                    myLikeList.map((likeList) => (
                        <div className="card">
                            <p className="category">{likeList.store_cate}</p>
                            <div className="card-main">
                                <img src={likeList.store_img_location} alt="store" className="card-image" />
                                <div className="card-content">
                                    <h2 className="store">{likeList.store_name}</h2>
                                    <p className="address">{likeList.addr}</p>
                                    <p className="addrdetail">{likeList.addrdetail}</p>
                                    <div className="rating-section">
                                        <span className="rating">⭐ 9.4</span>
                                        <span className="reviews">120개</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                ): null}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UserLikeList />);

