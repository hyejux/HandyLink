import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';


function UserReservationOption() {

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
                 servicePrice: sub.servicePrice
               }))
             }));
             setCategories(transformedData);
           })
           .catch(error => {
             console.log('Error subItemModi', error);
           });
       }, [cateId]);





 return (
   <div>
  <div>
        <h2>예약 수정</h2>
        <div>
          <h3>카테고리 ID: {cateId}</h3>



                       <span> {reserveModi.serviceName} </span>
                     <span>   {reserveModi.serviceContent}</span>
                        <span>{reserveModi.servicePrice}</span>





          {categories.map((category, index) => (
            <div key={index} className="category">
              <h4>{category.serviceName}</h4>


          {(category.subCategoryType === 'TEXT' || category.subCategoryType === 'NUMBER') && (
            <span>가격: {category.servicePrice} 원</span>
          )}



              <p>{category.isRequired ? '* 필수' : '필수아님'} </p>
              {/*<p>유료: {category.isPaid ? '예' : '아니오'}</p>*/}
              <p>하위 카테고리 타입: {category.subCategoryType}</p>
                 {category.subCategoryType === 'SELECT1' && (

                          <div>
                            {category.subCategories && category.subCategories.length > 0 && (
                              <div>
                                {category.subCategories.map((subCategory, subIndex) => (
                                  <div key={subIndex}>
                                    <button>
                                      {subCategory.serviceName} + {subCategory.servicePrice} 원
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {category.subCategoryType === 'TEXT' && (
                          <div>
                            <input type="text" placeholder="입력해주세요" />
                          </div>
                        )}
            </div>
          ))}
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




