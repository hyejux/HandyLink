import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminReserveSetting.css';
import { useNavigate } from 'react-router-dom';


function AdminReserveSetting() {

const [reservationList, setReservationList] = useState([]);

    useEffect(() => {
            axios.get('/adminReservation/getList')
                .then(response => {
                    console.log(response.data);
                    setReservationList(response.data);
                })
                .catch(error => {
                    console.log('Error Category', error);
                });
        }, [])

//   const navigate = useNavigate();
//
//    const handleModifyClick = () => {
//        navigate(`/AdminReserveSettingDetailModify?categoryLevel=${value.categoryLevel}`);
//    };

  const handleAddClick = () => {
        window.location.href = '/AdminReserveSettingDetail.admin'; // 페이지 이동
    };


//   const goToAdminPage = (id) => {
//          console.log("hh");
//          const pageName = "AdminReserveSettingDetailModify"; // 전달할 첫 번째 값
//          navigate(`/${pageName}.admin/${id}`); // 두 번째 값으로 id를 포함
//      };
const goToAdminPage = (id) => {
    window.location.href = `/AdminReserveSettingDetailModify.admin/${id}`;
};

const goToAdminPage2 = (id) => {
  window.location.href = `/AdminReserveSettingDetailSlot.admin/${id}`;
};


//    const navigate = useNavigate();
//
//    const handleModifyClick = () => {
//        navigate(`/AdminReserveSettingDetailModify?categoryLevel=${value.categoryLevel}`);
//    };
  return (
    <div>
      <div className="main-content-title"> <div className='header-title'> 예약 설정 </div></div>

      <div className="main-btns">
          <button type="button" className="btn-st" onClick={handleAddClick}>
                  추가하기
              </button>
      </div>

      <div className="main-contents">
        {reservationList.map((value, index) => (

          <div className="reserve-container" key={index}>
                  <div className="reserve-img">
                  <img src={`${value.imageUrl}`} alt="My Image" />

                   </div>

                   <div className="reserve-content">
                     <div className="reserve-content-title">
                       <div>{value.serviceName}</div>
                       <div>{value.servicePrice} 원 ~</div>
                     </div>

                        <div className='reserve-content-text-box'>
                        <div className="reserve-content-text">
                                              {value.serviceContent}
                                            </div>
                          </div>
                                          
                   </div>

                        <div className='btn-ali'>
                        <button  type="button" class="btn-modi" onClick={() => goToAdminPage(value.categoryId)}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                         <button  type="button" class="btn-modi" onClick={() => goToAdminPage2(value.categoryId)}>
                         <i class="bi bi-clock-history"></i>
                         </button>
  </div>

           
                 </div>
             ))}
      </div>


    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminReserveSetting />
);