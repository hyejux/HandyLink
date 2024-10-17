import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import './UserReservationOption.css';


function UserReservationOption() {
  {/*const [combinedInputs, setCombinedInputs] = useState({
    selectedFlavors: [], // 빈 배열로 초기화
    categoryInputs: {} // 빈 객체로 초기화
  }); */}
  
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
  

// combinedInputs 상태 정의
const [combinedInputs, setCombinedInputs] = useState([]); // 배열로 초기화

// 입력값 변경 처리
  // 입력값 변경 처리
  const handleCategoryInputChange = (index, value, servicePrice) => {
    setCombinedInputs(prev => {
      const updatedInputs = [...prev];
      updatedInputs[index] = { 
        ...updatedInputs[index], 
        inputValue: value, // 입력값 업데이트
        servicePrice: servicePrice // 서비스 가격 업데이트
      };
      return updatedInputs;
    });
  };

// 옵션 선택 처리 (단일 선택)
const handleFlavorSelect1 = (subCategory, index) => {
  setCombinedInputs(prev => {
    const updatedInputs = [...prev];
    updatedInputs[index] = { ...updatedInputs[index], [index]: [subCategory] }; // 단일 선택 업데이트
    return updatedInputs;
  });
};

// 옵션 선택 처리 (다중 선택)
const handleFlavorSelectN = (subCategory, index) => {
  setCombinedInputs(prev => {
    const updatedInputs = [...prev];
    const currentSelection = updatedInputs[index]?.[index] || [];
    updatedInputs[index] = {
      ...updatedInputs[index],
      [index]: currentSelection.includes(subCategory)
        ? currentSelection.filter(item => item !== subCategory) // 이미 선택된 경우 제거
        : [...currentSelection, subCategory] // 선택되지 않은 경우 추가
    };
    return updatedInputs;
  });
};









   // 상태 변경 시 콘솔에 출력
   useEffect(() => {
    console.log('Category Inputs:', combinedInputs);
}, [combinedInputs]);

//------------------------------------
    const slot = sessionStorage.getItem('selectSlot');
    const date = sessionStorage.getItem('formattedDate');

    console.log('Slot:', slot);
    console.log('Date:', date);



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
           <div className="store-detail-menu">
             <button type="button">홈</button>
             <button type="button">정보</button>
             <button type="button">예약</button>
             <button type="button">리뷰</button>
           </div>

           <div className="user-content-container">
             <div className="user-reserve-menu">
               <div className="user-reserve-menu-img">
               <img src="/img/user_basic_profile.jpg" />
               </div>
               <div className="user-reserve-menu-content">
                 <div>{reserveModi.serviceName} </div>
                 <div>
                   {reserveModi.serviceContent}
                   {reserveModi.servicePrice}
                 </div>
               </div>
             </div>
           </div>

           <div className="user-content-container2">
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

           <div className="user-content-container6">
  <div className="user-reserve-title2">옵션 선택</div>
</div>
{categories.map((category, index) => (
  <div key={index} className="user-content-container2">
    {category.subCategoryType === "TEXT" && (
      <div className="user-content-container3">
        <div className="sub-title">
          <div>{category.serviceName} {category.servicePrice > 0 && ( // 가격이 0보다 큰 경우에만 출력
        <span>  (+ {category.servicePrice} )</span>
      )} </div>
          
          <div className="option-title"> *필수</div>
        </div>
        <div className="sub-container3">
          <input
            className="input-text"
            type="text"
            value={combinedInputs[index]?.inputValue || ''}  // combinedInputs에서 value 가져오기
            onChange={(e) => handleCategoryInputChange(index, e.target.value, category.servicePrice)}
          />
        </div>
      </div>
    )}

    {/* NUMBER 타입일 때 */}
    {category.subCategoryType === "NUMBER" && (
      <div className="user-content-container3">
        <div className="sub-title">
          <div>{category.serviceName} {category.servicePrice > 0 && ( // 가격이 0보다 큰 경우에만 출력
        <span>  (+ {category.servicePrice} )</span>
      )} </div>
          <div className="option-title"> *필수</div>
        </div>
        <div className="sub-container4">
          <input
            className="input-text2"
            type="number"
            value={combinedInputs[index]?.inputValue || ''}  // 통합된 상태에서 값 가져오기
            onChange={(e) => handleCategoryInputChange(index, e.target.value, category.servicePrice)}
          />
        </div>
      </div>
    )}

    {/* SELECT1 혹은 SELECTN 타입일 때 */}
    {(category.subCategoryType === "SELECT1" || category.subCategoryType === "SELECTN") && (
      <div className="user-content-container3">
        <div className="sub-title">
          <div>{category.serviceName}</div>
          <div className="option-title"> *필수</div>
        </div>
        <div className="sub-container5">
          {category.subCategories.map((subCategory, subIndex) => (
            <button
              key={subIndex}
              className={`option-btn ${combinedInputs[index]?.[index]?.includes(subCategory) ? 'selected' : ''}`}
              onClick={() =>
                category.subCategoryType === "SELECT1"
                  ? handleFlavorSelect1(subCategory, index)
                  : handleFlavorSelectN(subCategory, index)
              }
            >
              {subCategory.serviceName} <div> +{subCategory.servicePrice}</div>
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
))}

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
                // 값이 배열인 경우
                if (Array.isArray(value)) {
                  return value.map((item, itemIndex) => (
                    <span key={itemIndex}>
                      {item.serviceName} (+{item.servicePrice}) 
                    </span>
                  ));
                } 
              // 값이 문자열인 경우
              else if (typeof value === 'string') {
                return (
                  <span key={key}>
                    {value}
                  </span>
                );
              }
      // 값이 undefined이거나 다른 경우
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

<div className="user-content-container6">
  <div className="user-content-last">
    <button type="button">
      다음 <i className="bi bi-chevron-right"></i>
    </button>
  </div>
</div>

         </div>
       </div>


     </div>
  )
};

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <UserReservationOption />
);




