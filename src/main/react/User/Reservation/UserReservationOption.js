import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import './UserReservationOption.css';


function UserReservationOption() {

    const [selectedFlavor, setSelectedFlavor] = useState(null); // SELECT1의 경우
    const [selectedFlavors, setSelectedFlavors] = useState([]); // SELECTN의 경우


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
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState([]);

  const handleInputChange = (index, type, value) => {
    setCategoryInputs(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: value
      }
    }));
  };

  const handleFlavorSelect1 = (subCategory) => {
    setSelectedFlavor(subCategory);
    setSelectedSubCategoryIds([subCategory.categoryId]); // SELECT1의 경우 ID를 배열에 저장
    setCategoryInputs(prev => ({
      ...prev,
      [subCategory.serviceName]: subCategory // Store selected flavor
    }));
  };

  const handleFlavorSelectN = (subCategory) => {
        if (selectedFlavors.includes(subCategory)) {
            // 선택된 경우, 제거
            setSelectedFlavors((prev) => prev.filter((flavor) => flavor !== subCategory));
            setSelectedSubCategories((prev) => ({
                parentCategoryId: prev.parentCategoryId,
                subCategoryIds: prev.subCategoryIds.filter(id => id !== subCategory.categoryId), // ID 제거
            }));
        } else {
            // 선택되지 않은 경우, 추가
            setSelectedFlavors((prev) => [...prev, subCategory]);
            setSelectedSubCategories((prev) => ({
                parentCategoryId: subCategory.categoryId, // 상위 카테고리 ID 저장
                subCategoryIds: [...prev.subCategoryIds, subCategory.categoryId], // ID 추가
            }));

        }
    };
  // 선택된 subCategory ID 배열 로그 출력
  useEffect(() => {
    console.log("setSelectedSubCategories", selectedSubCategories);
  }, [selectedSubCategories]);



/*
   // Handle input changes for TEXT and NUMBER types
    const handleInputChange = (index, subCategoryType, value) => {
        setCategoryInputs(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                [subCategoryType]: value
            }
        }));
        console.log("Category Inputs:", { ...categoryInputs, [index]: { ...categoryInputs[index], [subCategoryType]: value } });
    };

*/

/*  // Handle flavor selection for SELECT1
  const handleFlavorSelect1 = (subCategory) => {
    setSelectedFlavor(subCategory);
    setCategoryInputs(prev => ({
      ...prev,
      [subCategory.serviceName]: subCategory // Store selected flavor
    }));
    console.log("Selected (SELECT1):", subCategory);
  };*/
/*
  // Handle flavor selection for SELECTN
  const handleFlavorSelectN = (subCategory) => {
    if (selectedFlavors.includes(subCategory)) {
      setSelectedFlavors((prev) => prev.filter((flavor) => flavor !== subCategory)); // Remove selected
      setCategoryInputs(prev => {
        const { [subCategory.serviceName]: removed, ...rest } = prev; // Remove from inputs
        return rest;
      });
    } else {
      setSelectedFlavors((prev) => [...prev, subCategory]); // Add selected
      setCategoryInputs(prev => ({
        ...prev,
        [subCategory.serviceName]: subCategory // Store selected flavor
      }));
    }
  };*/

  // Log category inputs whenever they change
  useEffect(() => {
    console.log("Category Inputs:", categoryInputs);
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
                 <i className="bi bi-calendar-check-fill"></i> 가져온 날짜
               </div>
               <div>
                 <i className="bi bi-clock-fill"></i> 가져온 시간
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
                value={lettering}
                onChange={handleLetteringChange}
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
                value={candleCount}
                onChange={handleCandleCountChange}
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
                     type="button"
                     className={`option-btn ${
                       isSelectN
                         ? selectedFlavors.includes(subCategory) // SELECTN일 때 여러 개 선택 가능
                           ? "selected"
                           : ""
                         : selectedFlavor === subCategory // SELECT1일 때 하나만 선택 가능
                         ? "selected"
                         : ""
                     }`}
                     onClick={() =>
                       isSelectN
                         ? handleFlavorSelectN(subCategory) // SELECTN 선택
                         : handleFlavorSelect1(subCategory) // SELECT1 선택
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




