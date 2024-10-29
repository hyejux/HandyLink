import './AdminReviewList.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
function AdminReviewList () {
  



    const [reviewList, setReviewList] = useState([]);


    const store_no = 7;

    useEffect(() => {
                axios.get(`/userReservation/getReviewList/${store_no}`)
                .then(response => {
                  console.log(response.data);
                  setReviewList(response.data);
                })
                .catch(error => {
                  console.log("리뷰 쪽 에러 발생", error);
                })
        }, [])



// 가게 소식 추가하기 
  const handleAddClick = () => {
        window.location.href = `/AdminStoreNoticeRegist.admin`; // 페이지 이동
    };


//  const goToAdminPage2 = (id) => {
//    window.location.href = `/AdminReserveSettingDetailSlot.admin/${id}`;
//  };


  const [showAllContent, setShowAllContent] = useState(false);

 // 각 공지의 토글 상태를 저장하는 상태 (행별로 관리)
 const [expandedRows, setExpandedRows] = useState([]);

 // 특정 행을 클릭했을 때 해당 행의 상세 내용을 표시하도록 토글
 const handleToggleRow = (index) => {
   if (expandedRows.includes(index)) {
     setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
   } else {
     setExpandedRows([...expandedRows, index]);
   }
 };





 const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};


const goToDetail = (no) => {
    window.location.href = `/AdminReserveManageDetail.admin/${no}`;
}

    return (
        <div>
          <div>
      <div className="main-content-title"> <div className='header-title'> 리뷰 관리 </div>  
      <button type="button" className="btn-st" onClick={handleAddClick}>
                  추가하기
              </button></div>

      <div className="main-btns">
        
      </div>

     
      <div className="main-contents">
      <div className="search-bar-box">
        <input type='text' placeholder='검색할 내용을 입력해주세요' /> 
        <button> <i className="bi bi-search"></i> </button>
      </div>
      <div className="management-container">
        <table className="management-table">
          <thead>
  
            <tr>
            <th style={{ width: '3%' }}>No</th>

      <th style={{ width: '8%' }}>작성자</th>
      <th style={{ width: '11%' }}>상품명</th>
      <th style={{ width: '15%' }}>리뷰사진</th>
      <th style={{ width: '5%' }}>별점</th>
      <th style={{ width: '30%' }}>리뷰내용</th>
      <th style={{ width: '12%' }}>등록일</th>
      {/* <th style={{ width: '5%' }}>관리</th> */}
            </tr>
          </thead>
          <tbody>
            {reviewList.map((value, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{index + 1}</td>
              
                  <td> {value.userName}</td>
                  <td onClick={() => goToDetail(value.reservationNo)} className='detail-serviceName'> {value.serviceName} </td>
                  <td>   {value.userReviewImg.map((imgUrl, index) => {
                              const formattedUrl = imgUrl.replace('blob:', ''); 
                              return (
                                <img key={index} className="photo-item2" src={formattedUrl} alt={`Review image ${index + 1}`} />
                              );
                            })} </td>
                  <td>         {[...Array(value.reviewRating)].map((_, index) => (
                              <span key={index} className='review-rating'>
                                &#9733;
                              </span>
                            ))} </td>
                  <td  onClick={() => handleToggleRow(index)}>
                  {value.reviewContent.slice(0, 50)}
                    <i class="bi bi-chevron-down" onClick={() => handleToggleRow(index)}></i>
                  </td>
                  <td>{formatDate(value.reviewDate)}</td>
                  {/* <td></td> */}
                  
                </tr>
                {/* 토글된 행에 대해 자세한 내용 표시 */}
                {expandedRows.includes(index) && (
                  <tr>
                    <td colSpan="8" className="expanded-content">
                      <div>
                        {/* 자세한 내용을 여기에 표시 */}
                        <p>{value.reviewContent}</p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
       </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminReviewList/>
);