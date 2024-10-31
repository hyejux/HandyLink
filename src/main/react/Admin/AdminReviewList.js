import './AdminReviewList.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
function AdminReviewList() {

  const [reviewList, setReviewList] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');


  useEffect(() => {
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');
    console.log("세션 storeId: ", storeId);
    console.log("세션 storeNo: ", storeNo);

    axios.post(`/userReservation/getReviewList`, { storeNo: storeNo })
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


  // 정렬
  const handleSort = (field, type) => {
    let order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);

    const sortedList = [...reviewList].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      // 숫자 타입 정렬 (별점 정렬)
      if (type === 'number') {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // 날짜 타입 정렬 (등록일 정렬)
      if (type === 'date') {
        valueA = new Date(a[field]);
        valueB = new Date(b[field]);
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
    setReviewList(sortedList);
  };



  return (
    <div>
      <div>
        <div className="main-content-title"> <div className='header-title'> 리뷰 관리 </div>
        </div>

        <div className="main-btns">

        </div>


        <div className="main-contents">
          {/* <div className="search-bar-box">
            <input type='text' placeholder='검색할 내용을 입력해주세요' />
            <button> <i className="bi bi-search"></i> </button>
          </div> */}
          <div className="management-container">
            <table className="management-table">
              <thead>

                <tr>
                  <th style={{ width: '3%' }}>No</th>

                  <th style={{ width: '8%' }}>작성자</th>
                  <th style={{ width: '11%' }}>상품명</th>
                  <th style={{ width: '15%' }}>리뷰사진</th>
                  <th style={{ width: '5%' }}>별점<button onClick={() => handleSort('reviewRating', 'number')}><i className="bi bi-chevron-expand"></i></button></th>
                  <th style={{ width: '30%' }}>리뷰내용</th>
                  <th style={{ width: '12%' }}>등록일<button onClick={() => handleSort('reviewDate', 'date')}><i className="bi bi-chevron-expand"></i></button></th>
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
                      <td onClick={() => handleToggleRow(index)}>
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
  <AdminReviewList />
);