import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminStoreNotice.css';
import { useNavigate } from 'react-router-dom';


function AdminStoreNotice() {


  const [noticeList, setNoticeList] = useState([]);
  const [status, setStatus] = useState();
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredList, setFilteredList] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);


  useEffect(() => {
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');
    console.log("세션 storeId: ", storeId);
    console.log("세션 storeNo: ", storeNo);

    console.log(storeNo);
    axios.post('/adminStore/getNoticeList',
      { storeNo: parseInt(storeNo) }
    )
      .then(response => {
        setNoticeList(response.data); // 기본값으로 빈 배열 설정
      })
      .catch(error => {
        console.log('Error Category', error);
      });
  }, [])



  const handleStatus = (e, id) => {
    console.log(id, e);
    if (e === 'D') {
      confirm("소식을 숨기시겠습니까?");
    } else if (e === 'Y') {
      confirm("소식을 보이게하시겠습니까?");
    } else if (e === 'N') {
      confirm("소식을 삭제하시겠습니까?");
    }

    axios.post('/adminStore/setNoticeStatus', { status: e, noticeNo: id })
      .then(response => {
        console.log(response.data);
        // setNoticeList(response.data);
        axios.get('/adminStore/getNoticeList')
          .then(response => {

            console.log(response.data);
            setNoticeList(response.data);

          })
      })
      .catch(error => {
        console.log('Error Category', error);
      });
  }


  const noticeModi = (id) => {
    window.location.href = `/AdminStoreNoticeModi.admin/${id}`; // 페이지 이동
  }


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


  // 등록일 정렬
  const handleDateSort = () => {
    let order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);

    const listToSort = filteredList.length > 0 ? filteredList : noticeList;
    const sortedList = [...listToSort].sort((a, b) => {
      let valueA = new Date(a.noticeRegdate);
      let valueB = new Date(b.noticeRegdate);

      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });

    // 정렬된 목록을 상태에 설정
    if (filteredList.length > 0) {
      setFilteredList(sortedList); // 필터링된 목록이 있는 경우
    } else {
      setNoticeList(sortedList); // 전체 목록인 경우
    }
  };


  // 소식, 카테고리 필터
  const handleFilter = (category) => {
    const filtered = noticeList.filter(notice => notice.noticeType === category);
    setFilteredList(filtered);
    setActiveFilter(category);
  };

  // 소식, 카테고리 필터 초기화
  const resetFilter = () => {
    setFilteredList([]);
    setActiveFilter(null);
  };


  return (
    <div>
      <div className="main-content-title"> <div className='header-title'> 가게 소식 </div>
        <button type="button" className="btn-st" onClick={handleAddClick}>
          추가하기
        </button></div>

      <div className="main-btns">

      </div>


      <div className="main-contents">

        <div className="store-notice-top">
          <div className="filter-btn-box">
            <button onClick={resetFilter}><i class="bi bi-arrow-clockwise"></i></button>
            <button  className={activeFilter === '소식' ? 'active' : ''} onClick={() => handleFilter('소식')}>소식</button>
            <button className={activeFilter === '공지사항' ? 'active' : ''} onClick={() => handleFilter('공지사항')}>공지사항</button>
          </div>

          <div className="search-bar-box">
            <input type='text' placeholder='검색할 내용을 입력해주세요' />
            <button> <i className="bi bi-search"></i> </button>
          </div>

          <div className="select-filter-box">
            <button>버튼</button>
          </div>
        </div>



        <div className="management-container">
          <table className="management-table">
            <thead>
              <tr>
                <th></th>
                <th>카테고리</th>
                <th>소식내용</th>
                <th>등록일<button onClick={handleDateSort}><i className="bi bi-chevron-expand"></i></button></th>
                <th>상태변경</th>
                <th> 수정 </th>
              </tr>
            </thead>
            <tbody>

              {(filteredList.length > 0 ? filteredList : noticeList).map((value, index) => (
                <React.Fragment key={index}>
                  <tr onDoubleClick={() => goToDetail(value.reservationNo)}>
                    <td><input type="checkbox" /></td>
                    <td>{value.noticeType}</td>
                    <td onClick={() => handleToggleRow(index)}>
                      {value.noticeContent.slice(0, 50)}
                      <i class="bi bi-chevron-down" onClick={() => handleToggleRow(index)}></i>
                    </td>
                    <td>{formatDate(value.noticeRegdate)} {value.modi === 'Y' ? '(수정됨)' : ''}</td>
                    <td><select value={value.status} onChange={(e) => handleStatus(e.target.value, value.noticeNo)}> <option value='Y'> 보이기 </option> <option value='D'> 숨기기 </option> <option value='N'> 삭제 </option></select></td>
                    <td> <button type='button' className="btn-st" onClick={() => noticeModi(value.noticeNo)}> 수정 </button></td>
                  </tr>
                  {/* 토글된 행에 대해 자세한 내용 표시 */}
                  {expandedRows.includes(index) && (
                    <tr>
                      <td colSpan="6" className="expanded-content">
                        <div>
                          {/* 자세한 내용을 여기에 표시 */}
                          <p>카테고리: {value.noticeType}</p>
                          <p>소식 내용: {value.noticeContent}</p>
                          <p>등록일: {value.noticeRegdate}</p>
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
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminStoreNotice />
);