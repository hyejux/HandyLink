import './UserReviewRegist.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';
import { Rating } from '@mui/material';


function UserReviewRegist () {


      
const [cateId,setCateId] = useState();
  
// reservation_id
useEffect(() => {
  const path = window.location.pathname;
  const pathSegments = path.split('/');
  const categoryId = pathSegments[pathSegments.length - 1];
  setCateId(categoryId);
},[]);

// --------------------------------------------- 이미지 업로드

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
    setCharCount(e.target.value.length);
  };

  
  const handleFileUpload = (event) => {
    const files = event.target.files; // 선택한 파일들
    const newImages = []; // 새로운 이미지 URL을 저장할 배열

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const previewUrl = URL.createObjectURL(file); // Blob URL 생성
            newImages.push(previewUrl); // 미리보기 URL을 배열에 추가
        }

        // 상태 업데이트: 새 이미지 URL 추가
        setNewImages((prev) => [...prev, ...newImages]); // 새 이미지 미리보기 URL 추가
        setImages((prevImages) => [...prevImages, ...Array.from(files)]); // 기존 파일과 병합
    }
};



  // ---------------------------------------------


  useEffect(() => {
    const sumbitData = {
      reviewRating : rating,
      reviewContent : review,
      userReviewImg : images,
      userImg : newImages
    }
    console.log(sumbitData);
  },[rating,review,charCount,images])


    const reviewSubmit = () => {
      const submitData = {
        reviewRating : rating,
        reviewContent : review,
      }
      axios.post(`/userMyReservation/setReview/${cateId}`, submitData )
      .then(response => {
        console.log('리뷰 등록 성공 !:', response.data);

        const reviewNoId = response.data;

        // const formData = new FormData();

        // images가 배열이라고 가정하고 순회하여 파일 추가
        const formData = new FormData();
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                console.log(images[i]); // 각 이미지 파일의 내용을 확인
                formData.append('files', images[i]); // 'files'는 서버에서 기대하는 필드명
            }
        }
        formData.append('reviewNoId', reviewNoId);
        console.log([...formData]); // FormData의 내용을 확인 (Array.from을 사용하여 배열로 변환)
        
        axios.post(`/userMyReservation/setReviewImg`, formData, reviewNoId, {
            headers: {
                'Content-Type': 'multipart/form-data', // 헤더 설정
            },
        }).then(response => {
          console.log('파일 업로드 성공:', response.data);
          console.log('파일 업로드 성공:', response.data);
          alert("리뷰 등록 완료");
          // window.location.href = '/AdminReserveSetting.admin'; // 페이지 이동;
      })
    })
      .catch(error => {
        console.error('에러 발생:', error);
    });
      
    }

    return (
        <div>
          리뷰 작성 페이지 
          <div className="user-content-container">
          <div className="review-container">
          <div className="rating-section">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <span
                key={starValue}
                className={`star ${rating >= starValue ? 'selected' : ''}`}
                onClick={() => handleStarClick(starValue)}
              >
                &#9733;
              </span>
            ))}
          </div>

      <textarea
        className="review-text"
        value={review}
        onChange={handleReviewChange}
        maxLength="1000"
        placeholder="Write your review..."
      ></textarea>

      <div className="char-count">
        <span>{`${charCount}/1000`}</span>
      </div>

      <div className="media-section">
      {newImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Preview ${index}`}
            style={{ width: '100px', height: '100px', margin: '10px' }}
          />
        ))}
        <div
          className="camera-placeholder"
          onClick={() => document.getElementById('file-input').click()}
        >
          <i className="camera-icon">+</i>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <button className="submit-btn" onClick={() => reviewSubmit()}>
        작성하기
      </button>
    </div>

       </div>
       </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserReviewRegist/>
);