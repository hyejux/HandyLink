import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import './UserReservationConfirm.css';


function UserReservationConfirm() {
  
  const [reserveModi, setReserveModi] = useState('');
  const [categories, setCategories] = useState([{
    serviceName: '',
    servicePrice: 0,
    isPaid: false,
    isRequired: false,
    subCategoryType: 'SELECT1',
    subCategories: [{ serviceName: '', servicePrice: '' }]
  }]);
  
  const [cateId, setCateId] = useState(0);
  
  useEffect(() => {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const categoryId = pathSegments[pathSegments.length - 1];
    setCateId(categoryId);
  }, []);
  
  useEffect(() => {
    axios
      .get(`/adminReservation/getListDetail/${cateId}`)
      .then(response => {
        console.log(response.data);
        setReserveModi(response.data);
      })
      .catch(error => {
        console.log('Error Category', error);
      });
  
    axios
      .get(`/adminReservation/getMiddleItem/${cateId}`)
      .then(response => {
        console.log("get" + JSON.stringify(response.data));
  
        const transformedData = response.data.map(item => ({
          categoryId: item.categoryId,
          serviceName: item.serviceName,
          servicePrice: item.servicePrice,
          isPaid: item.isPaid === 'Y',
          isRequired: item.isRequired === 'Y',
          subCategoryType: item.subCategoryType,
          subCategories: item.subCategories.map(sub => ({
            serviceName: sub.serviceName,
            servicePrice: sub.servicePrice,
            categoryId: sub.categoryId
          }))
        }));
        setCategories(transformedData);
      })
      .catch(error => {
        console.log('Error subItemModi', error);
      });
  }, [cateId]);

  const [requestText, setRequestText] = useState(''); // 요청사항 입력값
  const [totalPrice, setTotalPrice] = useState(300000); // 총액 값 (임의로 설정)

    // 요청사항 입력값 관리
    const handleRequestChange = (e) => {
      setRequestText(e.target.value);
    };
  

  
  // 주문 등록 

  const submitBtn = () => {
    const reservationData = {
      reservationTime: slot,  // 세션 데이터에서 가져옴
      reservationSlotKey: reservationSlotKey,  // 세션 데이터에서 가져옴
      customerRequest: requestText,  // 사용자 입력 요청사항
      reservationPrice: totalPrice  // 총액 정보
    };

    console.log('최종 예약 데이터:', reservationData);
    axios
  .post(`/userReservation/setReservationForm`, reservationData)
  .then(response => {
    const reservation_id = response.data;  // 예약 번호를 받아옴
    console.log("reservation_no 주문번호 ! : : ", reservation_id);

    // reservation_id가 설정된 후에 배열을 업데이트
    const updatedArray = formData.map(item => ({
      ...item,  // 기존 객체의 모든 속성 복사
      reservationNo: reservation_id  // reservationNo 추가
    }));

    console.log('업데이트된 배열:', updatedArray);

    // 필요시 여기서 두 번째 요청을 진행
    return axios.post(`/userReservation/setReservationFormDetail`, updatedArray);
  })
  .then(response => {
    console.log("두 번째 요청 성공! ", response.data);
  })
  .catch(error => {
    console.log('Error Category', error);
  });
  
  };
 
  
  
  const calculateTotalPrice = () => {
    return combinedInputs.reduce((acc, item) => {
      if (typeof item === 'object' && item !== null) {
          console.log('Processing object:', item);
          // 객체의 각 값이 배열인 경우
          for (const key in item) {
              if (Array.isArray(item[key])) {
                  console.log(`Processing array at key ${key}:`, item[key]);
                  return acc + item[key].reduce((sum, innerItem) => {
                      // innerItem이 객체인지 확인하고 servicePrice 합산
                      return sum + (innerItem.servicePrice || 0);
                  }, 0);
              } else {
                  // 값이 배열이 아닐 경우 servicePrice 합산
                  return acc + (item.servicePrice || 0);
              }
          }
      }
    }, 0);
  };


//   
    const [formData, setFormData] = useState([]);
    const [combinedInputs, setCombinedInputs] = useState([]); // 배열로 초기화
    console.log(combinedInputs);
    console.log(formData);



    // useEffect를 사용하여 combinedInputs나 reserveModi가 업데이트될 때마다 총 가격을 계산
    useEffect(() => {
      const newTotalPrice = calculateTotalPrice() + (reserveModi.servicePrice || 0);
      setTotalPrice(newTotalPrice); // 총 가격 업데이트
      console.log(`Total Price: ${newTotalPrice}`); // 업데이트된 가격 로그
  }, [combinedInputs, reserveModi]); // reserveModi 추가



  // 세션 스토리지에서 데이터를 불러오는 함수
  const loadFromSessionStorage = () => {
    const storedData = sessionStorage.getItem('combinedInputs');
    if (storedData) {
      // JSON 문자열을 다시 객체로 변환
      const parsedData = JSON.parse(storedData);
      console.log(parsedData);
      setCombinedInputs(parsedData);
    }
    const storedformData = sessionStorage.getItem('formData');
    if (storedformData) {
      // JSON 문자열을 다시 객체로 변환
      const parsedFormData = JSON.parse(storedformData);
      console.log(parsedFormData);
      setFormData(parsedFormData);
    }
  };

  useEffect(() => {
    loadFromSessionStorage(); // 저장된 데이터를 불러옴
  }, []);


//------------------------------------
    const slot = sessionStorage.getItem('selectSlot');
    const date = sessionStorage.getItem('formattedDate');
    const reservationSlotKey = sessionStorage.getItem('reservationSlotKey');

    console.log('Slot:', slot);
    console.log('Date:', date);
    console.log('reservationSlotKey:', reservationSlotKey);

    const goToAdminPage = () => {

      window.location.href = `../UserReservationComplete.user`;
    };

 return (
   <div>
   <div className="user-main-container">
         <div className="user-top-nav">
           <div className="user-top-btns">
             <button type="button">{"<"}</button>
             <logo className="logo">HandyLink</logo>
             <button type="button">{">"}</button>
           </div>
         </div>

         <div className="user-main-content">


         <div className="user-content-container2">
             <div className="user-reserve-title">예약자 정보</div>
             <div className="user-content-container3">
               <div className="sub-container3">
                 <div className="bold-text">예약자 성함</div>
                 <div>세션 이름</div>
               </div>

               <div className="sub-container3">
                 <div className="bold-text">예약자 전화번호</div>
                 <div>세션 번호</div>
               </div>
             </div>
           </div>
           <hr />


           <div className="user-content-container">
             <div className="user-reserve-menu">
               <div className="user-reserve-menu-img">
               <img src={`${reserveModi.imageUrl}`} alt="My Image" />
               </div>
               <div className="user-reserve-menu-content">
                 <div>{reserveModi.serviceName} </div> 
                 <div>
                   {reserveModi.serviceContent}
                 
                 </div>
                 <div> {reserveModi.servicePrice} 원 ~</div>
                 
               </div>
             </div>
           </div>
           <hr />


           <div className="user-content-container2">
           <div className="user-reserve-title">예약일자</div>
             <div className="user-reserve-data">
               <div>
                 <i className="bi bi-calendar-check-fill"></i> {date}
               </div>
               <div>
                 <i className="bi bi-clock-fill"></i> {slot}
               </div>
             </div>
           </div>
           <hr />

           <div className="user-content-container6">
              <div className="user-reserve-title2">예약 정보</div>
            </div>
          <div className="user-content-container2">
            <div className="user-content-container3">
            <div>기본 가격 :  {reserveModi.serviceName} (+  {reserveModi.servicePrice} ) </div>
            <div>
                {categories.map((category, index) => (
                  <div key={index}>

                    <span>
                      <span>  {category.serviceName} :  {category.servicePrice > 0 && ( // 가격이 0보다 큰 경우에만 출력
                  <span>  (+ {category.servicePrice} )</span>
                )}  </span>
                      
                    </span>

                    <span>
                    {combinedInputs[index] && (
                      <span>
                        {Object.entries(combinedInputs[index]).map(([key, value]) => {
                        
                          if (Array.isArray(value)) {
                            return value.map((item, itemIndex) => (
                              <span key={itemIndex}>
                                {item.serviceName} (+{item.servicePrice}) 
                              </span>
                            ));
                          } 
                     
                        else if (typeof value === 'string') {
                          return (
                            <span key={key}>
                              {value}
                            </span>
                          );
                        }
              
                return null;
              })}
            </span>
          )}

                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr/>

          <div className="user-content-container2">
         
  
           <div className="user-content-container3">
               <div className="sub-container5">
                  <div> 총액 </div>
                 <div> {totalPrice} </div>
               </div>
             </div>
           </div>
           <hr />

          <div className="user-content-container2">


      <div className="user-content-container3">
        <div className="sub-title">
                요청사항
        </div>
        <div className="sub-container3">
          <input
            className="input-text"
            type="text"
            value={requestText}
            onChange={handleRequestChange}
          />
        </div>
      </div>
             {/* <div className="user-reserve-title"></div>
             <div className="user-content-container3">
                <div> 요청사항 </div>
                 <div>  <input
              type="text"
              value={requestText}
              onChange={handleRequestChange}
            /> </div> 
             </div> */}
           </div>
           <hr/>

           <div className="user-content-container2">
           <div className="user-reserve-title">주의사항</div>
        
           </div>
           <hr />

           <div className="user-content-container2">
           <div className="user-reserve-title">취소 환불 규정 </div>
        
           </div>
           <hr />

<div className="user-content-container6">
  <div className="user-content-last">
    <button type="button"  onClick={() => {submitBtn(); goToAdminPage(); }}>
      다음 <i className="bi bi-chevron-right"></i>
    </button>
  </div>
</div>

         </div>
       </div>


     </div>
  )
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <UserReservationConfirm />
);



