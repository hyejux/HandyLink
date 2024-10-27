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

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
       const previewUrl = URL.createObjectURL(file);
      reader.onload = (e) => {
        setImages((prevImages) => [...prevImages, e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------------------------------------------


  // const [selectedImage, setSelectedImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedImage(file);
  //     // 이미지 미리보기
  //     const previewUrl = URL.createObjectURL(file);
  //     setImagePreview(previewUrl);
  //   }
  // };


  useEffect(() => {
    const sumbitData = {
      reviewRating : rating,
      reviewContent : review,
      userReviewImg : images,
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

        // const formData = new FormData();
        // formData.append('file', selectedImage); // 'file'은 서버에서 기대하는 필드명입니다.
        // formData.append('category_id', response.data);
    

          // 두 번째 요청: 카테고리 이미지 업로드
          return axios.post('/userMyReservation/setReviewImg', images, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });


      })
      .then(response => {
        console.log('파일 업로드 성공:', response.data);
        console.log('파일 업로드 성공:', response.data);
        alert("리뷰 등록 완료");
        // window.location.href = '/AdminReserveSetting.admin'; // 페이지 이동
        
    })
      .catch(error => {
        console.error('에러 발생:', error);
    });
      
    }
  // userReservation/getReviewList
  // userReservation/setReview
  
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
        {images.map((image, index) => (
          <div key={index} className="media-placeholder">
            <img src={image} alt={`Uploaded preview ${index + 1}`} />
          </div>
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