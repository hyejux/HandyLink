import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import './UserReservationOption.css';


function UserReservationOption() {

  const [selectedFlavors, setSelectedFlavors] = useState([]); // 빈 배열로 초기화
 const [categoryInputs, setCategoryInputs] = useState({});


/*// SELECT1인 경우 선택 처리 함수
const handleFlavorSelect1 = (subCategory) => {
  setSelectedFlavor(subCategory);
  console.log("Selected (SELECT1):", subCategory);
};

// SELECTN인 경우 선택 처리 함수
const handleFlavorSelectN = (subCategory) => {
  if (selectedFlavors.includes(subCategory)) {
    setSelectedFlavors((prev) => prev.filter((flavor) => flavor !== subCategory)); // 이미 선택된 경우 제거
  } else {
    setSelectedFlavors((prev) => [...prev, subCategory]); // 선택되지 않은 경우 추가
  }

};*/

  // selectedFlavors 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("Selected (SELECTN):", selectedFlavors);
  }, [selectedFlavors]); // selectedFlavors가 변경될 때마다 실행


// SELECT1, SELECTN에 따라 버튼 선택 방식 결정
const isSelectN = true; // SELECTN이면 true, SELECT1이면 false로 설정

      const [reserveModi, setReserveModi] = useState('');
         const [categories, setCategories] = useState([{
           serviceName: '',
           servicePrice: 0,
           isPaid: false,
           isRequired: false,
           subCategoryType: 'SELECT1',
           subCategories: [ {serviceName : '', servicePrice : ''}]
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
             console.log("get"  + JSON.stringify(response.data));

             const transformedData = response.data.map(item => ({
               serviceName: item.serviceName, // serviceName -> name
               servicePrice: item.servicePrice, // servicePrice -> price
               isPaid: item.isPaid === 'Y', // isPaid ("Y"/"N") -> true/false
               isRequired: item.isRequired === 'Y', // isRequired ("Y"/"N") -> true/false
               subCategoryType: item.subCategoryType, // subCategoryType -> inputType
               subCategories: item.subCategories.map(sub => ({
                 serviceName: sub.serviceName,
                 servicePrice: sub.servicePrice,
                 categoryId : sub.categoryId
               }))
             }));
             setCategories(transformedData);
           })
           .catch(error => {
             console.log('Error subItemModi', error);
           });
       }, [cateId]);



 const [lettering, setLettering] = useState("");
  const [candleCount, setCandleCount] = useState(0);


  const handleLetteringChange = (e) => setLettering(e.target.value);
  const handleCandleCountChange = (e) => setCandleCount(e.target.value);
  // lettering와 candleCount 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("Lettering:", lettering);
  }, [lettering]); // lettering이 변경될 때마다 실행

  useEffect(() => {
    console.log("Candle Count:", candleCount);
  }, [candleCount]); // candleCount가 변경될 때마다 실행

   const [selectedSubCategories, setSelectedSubCategories] = useState({ parentCategoryId: null, subCategoryIds: [] });



// Handle flavor selection for SELECT1 (single selection)
const handleFlavorSelect1 = (subCategory, index) => {
  setSelectedFlavors(prev => ({
      ...prev,
      [index]: [subCategory] // 단일 선택 설정
  }));
};


const handleFlavorSelectN = (subCategory, index) => {
  setSelectedFlavors(prev => {
      const currentSelection = prev[index] || [];
      return {
          ...prev,
          [index]: currentSelection.includes(subCategory)
              ? currentSelection.filter(item => item !== subCategory) // 이미 선택된 경우 제거
              : [...currentSelection, subCategory] // 선택되지 않은 경우 추가
      };
  });
};



  useEffect(() => {
    console.log("setSelectedSubCategories", selectedSubCategories);
  }, [selectedSubCategories]);


  // Log category inputs whenever they change
  useEffect(() => {
    console.log("Category Inputs:", categoryInputs);
  }, [categoryInputs]);

    const slot = sessionStorage.getItem('selectSlot');
    const date = sessionStorage.getItem('formattedDate');

    console.log('Slot:', slot);
    console.log('Date:', date);


    // ---------------------------------


    // 입력 값이 변경될 때마다 상태 업데이트
    const handleInputChange = (index, value) => {
        setCategoryInputs(prev => ({
            ...prev,
            [index]: value
        }));
    };

    // 상태 변경 시 콘솔에 출력
    useEffect(() => {
        console.log('Category Inputs:', categoryInputs);
    }, [categoryInputs]);



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
        {category.subCategoryType  === "TEXT" && (
          <div className="user-content-container3">
            <div className="sub-title">
              <div>{category.serviceName}</div>
              <div className="option-title"> *필수</div>
            </div>
            <div className="sub-container3">
              <input
                className="input-text"
                type="text"
                      value={categoryInputs[index] || ''} // value를 categoryInputs에서 가져오도록 설정
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          </div>
        )}

        {category.subCategoryType  === "NUMBER" && (
          <div className="user-content-container3">
            <div className="sub-title">
              <div>{category.serviceName}</div>
              <div className="option-title"> *필수</div>
            </div>
            <div className="sub-container4">
              <input
                className="input-text2"
                type="number"
                    value={categoryInputs[index] || ''} // value를 categoryInputs에서 가져오도록 설정
                  onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          </div>
        )}

        {(category.subCategoryType  === "SELECT1" || category.subCategoryType  === "SELECTN") && (
          <div className="user-content-container3">
            <div className="sub-title">
              <div>{category.serviceName}</div>
              <div className="option-title"> *필수</div>
            </div>
            <div className="sub-container5">
                 {category.subCategories.map((subCategory, subIndex) => (
                     <button
                             key={subIndex}
                             className={`option-btn ${selectedFlavors[index]?.includes(subCategory) ? 'selected' : ''}`} // Conditionally add 'selected' class
                             onClick={() => category.subCategoryType === 'SELECT1'
                               ? handleFlavorSelect1(subCategory, index)
                               : handleFlavorSelectN(subCategory, index)}
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
        <div> 기본 가격 : 대분류 + 가격 </div>
        <div> 중분류이름 : </div>
        <div> 중분류 이름: </div>
        <div> 기본 가격 : </div>
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

         <div className="user-bottom-nav">
           <a href="#">
             <span>메인</span>
           </a>
           <a href="#">
             <span>검색</span>
           </a>
           <a href="#">
             <span>예약</span>
           </a>
           <a href="#">
             <span>문의</span>
           </a>
           <a href="#">
             <span>MY</span>
           </a>
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




