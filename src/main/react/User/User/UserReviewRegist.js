import './UserReviewRegist.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';
import { Rating } from '@mui/material';



function UserReviewRegist () {


      
const [cateId,setCateId] = useState();
const [reservationList, setReservationList] = useState();
  
// reservation_id
useEffect(() => {
  const path = window.location.pathname;
  const pathSegments = path.split('/');
  const categoryId = pathSegments[pathSegments.length - 1];
  setCateId(categoryId);


      axios.get(`/UserStoreDetail/getStoreMainCategory2/${categoryId}`)
      .then(response => {
        console.log(response.data);
        setReservationList(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });
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

  
//   const handleFileUpload = (event) => {
//     const files = event.target.files; // 선택한 파일들
//     const newImages = []; // 새로운 이미지 URL을 저장할 배열

//     if (files.length > 0) {
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             const previewUrl = URL.createObjectURL(file); // Blob URL 생성
//             newImages.push(previewUrl); // 미리보기 URL을 배열에 추가
//         }

//         // 상태 업데이트: 새 이미지 URL 추가
//         setNewImages((prev) => [...prev, ...newImages]); // 새 이미지 미리보기 URL 추가
//         setImages((prevImages) => [...prevImages, ...Array.from(files)]); // 기존 파일과 병합
//     }
// };



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


  const handleUpload = async () => {
    if (charCount < 10 ){
      alert("10자 이상 입력해주세요.");
      retrun;
    } 
    if (!images || images.length === 0) return []; // 파일이 없으면 빈 배열 반환
  
    const formData = new FormData();
    const uploadedUrls = []; // 업로드된 이미지 URL을 저장할 배열
  
    // 여러 파일을 formData에 추가
    for (let i = 0; i < images.length; i++) {
      formData.append('file', images[i]);
    }
  
    formData.append('upload_preset', 'hye123'); // Cloudinary에서 설정한 Upload Preset
  
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dtzx9nu3d/image/upload',
        formData
      );
  
      // Cloudinary 응답 데이터에서 URL들을 추출하여 배열에 추가
      if (response.data && response.data.secure_url) {
        uploadedUrls.push(response.data.secure_url);
      }
  
      console.log('Uploaded Images:', uploadedUrls);
      // alert('이미지 업로드 성공!');
      return uploadedUrls; // 업로드된 이미지 URL 배열 반환
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      // alert('이미지 업로드에 실패했습니다.');
      return []; // 실패 시 빈 배열 반환
    }
  };
  
  
  // // 파일 배열을 저장할 상태 추가
  // const [files, setFiles] = useState([]);
  
  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files); // 선택된 파일을 배열로 변환
  //   setFiles(selectedFiles); // 상태 업데이트
  // };
  
  
  const reviewSubmit = async () => {
    const imageUrls = await handleUpload(); // 이미지 URL 배열을 기다림
    if (imageUrls.length === 0) return; // 업로드 실패 시 함수 종료
  
    const submitData = {
      reviewRating: rating,
      reviewContent: review,
      reviewImages: imageUrls, // 업로드된 이미지 URL 배열
    };
  
    axios.post(`/userMyReservation/setReview/${cateId}`, submitData)
      .then(response => {
        console.log('리뷰 등록 성공 !:', response.data);
  
        const reviewNoId = response.data;
  
        // 이미지 파일을 추가할 FormData
        const formData = new FormData();

  
  
        formData.append('reviewNoId', reviewNoId);
        formData.append('files', imageUrls);
        console.log([...formData]); // FormData의 내용을 확인 (Array.from을 사용하여 배열로 변환)
  
        axios.post(`/userMyReservation/setReviewImg`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 헤더 설정
          },
        })
        .then(response => {
          console.log('파일 업로드 성공:', response.data);
          alert("리뷰 등록이 완료되었습니다.");
          window.location.href = '/userMyReservationList.user'; // 페이지 이동;
        })
        .catch(error => {
          console.error('에러 발생:', error);
        });
      })
      .catch(error => {
        console.error('리뷰 등록 오류:', error);
      });
  };
  

    const handleFileUpload = (event) => {
      const files = event.target.files; // 선택된 파일들
      const newImages = []; // 새로운 이미지 URL을 저장할 배열
    
      // 기존에 업로드된 이미지 개수를 고려해서 4개 제한
      if (files.length + newImages.length + images.length > 4) {
        alert("You can only upload up to 4 images.");
        return; // 4개 초과 시 업로드 진행을 중지
      }
    
      // 파일들이 있을 경우 미리보기 URL을 생성
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const previewUrl = URL.createObjectURL(file); // 미리보기 URL 생성
          newImages.push(previewUrl); // 미리보기 URL을 배열에 추가
        }
    
        // 상태 업데이트: 새 이미지 URL 추가
        setNewImages((prev) => [...prev, ...newImages]);
        setImages((prevImages) => [
          ...prevImages,
          ...Array.from(files), // 새로 선택된 파일들을 images 상태에 추가
        ]);
      }
    };
    



    const handleImageDelete = (index) => {
      // 선택된 이미지 삭제
      setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // 실제 이미지 파일도 상태에서 삭제
    };
    









    return (

  
        <div className='main-content-css'> 
          
          <div className="user-top-nav">
          <i className="bi bi-arrow-left"></i>
          <logo className="logo"> 리뷰 작성 </logo>
        </div>

          <div>
        {reservationList ? (
   <div
   className='user-content-container'
 >
   <div className="user-reserve-menu">
     <div className="user-reserve-menu-img">
       <img src={`${reservationList.imageUrl}`} alt="My Image" />
     </div>
     <div className="user-reserve-menu-content">
       <div>{reservationList.serviceName}</div>
       <div>{reservationList.serviceContent}</div>
       <div>{reservationList.servicePrice} 원 ~</div>
     </div>
   </div>
 </div>

        ) : (
          <div>Loading...</div> // Display loading message until data is fetched
        )}
      </div>
       
      

          <div className="user-content-container2">
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
        placeholder="최소 10자 이상 작성해주세요. "
      ></textarea>

      <div className="char-count">
        <span>{`${charCount}/1000`}</span>
      </div>
      <div className="media-section">
         {/* + 버튼을 4개 이하일 때만 보이도록 조건 추가 */}
  {newImages.length < 4 && (
    <div
      className="camera-placeholder"
      onClick={() => document.getElementById('file-input').click()}
    >
      <p className="camera-icon">+</p>
      <input
        type="file"
        id="file-input"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </div>
  )}
  {newImages.map((image, index) => (
    <div key={index} style={{ position: 'relative', margin: '10px' }}>
      <img
        src={image}
        alt={`Preview ${index}`}
        style={{ width: '100px', height: '100px' }}
      />
      {/* 삭제 버튼 */}
      <button
        onClick={() => handleImageDelete(index)}
   className='btn-del2'
      >
        X
      </button>
    </div>
  ))}
  
 
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