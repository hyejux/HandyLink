import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';

const AdminReserveSettingDetail = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // 이미지 미리보기
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      console.log(previewUrl);
    }
  };


//사진업로드


const [serviceStart, setServiceStart] = useState('');
const [dateNumCase, setDateNumCase] = useState(0);
const [timeNumCase, setTimeNumCase] = useState(0);

// 입력값 변경 처리 함수
const handleServiceStartChange = (e) => {
  setServiceStart(e.target.value);
};

const handleDateNumChange = (e) => {
  setDateNumCase(Number(e.target.value));
};

const handleTimeNumChange = (e) => {
  setTimeNumCase(Number(e.target.value));
};

  // -----------------------------------
  const [categories, setCategories] = useState([{
    serviceName: '',
    servicePrice: 0,
    isPaid: false,
    isRequired: false,
    subCategoryType: 'SELECT1',
    subCategories: [{ serviceName: '', servicePrice: 0 }]
  }]);

  const [reserveAdd, setReserveAdd] = useState({
    serviceName: '',
    servicePrice: 0,
    serviceContent: ''
  });
  
  const setName = (name) => {
    setReserveAdd(prev => ({
      ...prev,
      serviceName: name
    }));
  };
  
  const setPrice = (price) => {
    setReserveAdd(prev => ({
      ...prev,
      servicePrice: price
    }));
  };
  
  const setDescription = (description) => {
    setReserveAdd(prev => ({
      ...prev,
      serviceContent: description
    }));
  };
  


  const isValid = () => {
    if (reserveAdd.serviceName.trim() === '' || categories.some(category => {
      return (
        category.serviceName.trim() === '' ||
        category.subCategories.some(sub => sub.serviceName.trim() === '')
      );
    })) {
      return false; // Invalid if any service name or subcategory name is empty
    }
    return true; // Valid
  };

  const isValid2 = () => {
    if (reserveAdd.serviceName.trim() === '' || categories.some(category => {
      const hasEmptyServiceName = category.serviceName.trim() === '';
      const hasEmptySubCategoryName = category.subCategories.some(sub => sub.serviceName.trim() === '');
      const isSelectNType = category.subCategoryType === 'SELECTN' && category.subCategories.length < 2;
      return hasEmptyServiceName || hasEmptySubCategoryName || isSelectNType;
    })) {
      return false; // Invalid if any service name or subcategory name is empty or if SELECT_N condition fails
    }
    return true; // Valid
  };
 
    const handleComplete = () => {
   
   
   
      if (reserveAdd.serviceName === ''){
        alert("서비스 명을 입력해주세요.")
      }else if (reserveAdd.servicePrice === 0) {
        alert("서비스 가격을 입력해주세요.")
      }else if (selectedImage === null) {
        alert("사진은 필수입니다.")
      }else if (dateNumCase === 0) {
        alert("일별 건수 기본 값을 입력해주세요")
      }else if (serviceDate === '') {
        alert("시작일 을 입력해주세요")
      }else if (serviceHour === '') {
        alert("시작일의 시간을 입력해주세요")
      }else if (serviceHour === '') {
        alert("시작일의 시간을 입력해주세요")
      }else if(reserveAdd.serviceContent === ''){
        alert("서비스 설명을 입력해주세요");
      }
      else if (!isValid()) {
        alert("모든 서브카테고리 이름을 입력해주세요."); // Alert message for empty names
        // return;
      }else if(!isValid2()){
        alert("다중선택은 소분류를 두개이상 입력해주세요");
      }
     
    
  
    // const storeId = sessionStorage.getItem('storeId');
    // const storeNo = sessionStorage.getItem('storeNo');
    // console.log("세션 storeId: ", storeId);
    // console.log("세션 storeNo: ", storeNo);

    // const transformedCategories = categories.map(category => ({
    //   ...category,
    //   isPaid: category.isPaid ? 'Y' : 'N',
    //   isRequired: category.isRequired ? 'Y' : 'N'
    
    // }));


  

    // // 날짜와 시간을 결합하여 "YYYY-MM-DDTHH:00:00" 형식으로 만들기
    // const combinedDateTime = `${serviceDate}T${serviceHour}:00`;
    // console.log(combinedDateTime); // 서버로 전송할 데이터


    // console.log(transformedCategories);
    // const requestData = {
    //   serviceName: reserveAdd.serviceName,
    //   servicePrice: reserveAdd.servicePrice,
    //   serviceContent: reserveAdd.serviceContent,
    //   categories: transformedCategories,
    //   ServiceStart: combinedDateTime,
    //   DateNumCase: dateNumCase,
    //   TimeNumCase: timeNumCase,
    //   StoreNo : storeNo
    // };

    // console.log(requestData);
    
    // // 첫 번째 요청: 메인 카테고리 설정
    // axios.post(`/adminReservation/setMainCategory`, requestData, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // })
    // .then(response => {
   
    //     console.log('메인 카테고리 설정 성공:', response.data);
    //     const formData = new FormData();
    //     formData.append('file', selectedImage); // 'file'은 서버에서 기대하는 필드명입니다.
    //     formData.append('category_id', response.data);
    
    //     // 두 번째 요청: 카테고리 이미지 업로드
    //     return axios.post('/adminReservation/setMainCategoryImg', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     });
    // })
    // .then(response => {
    //     console.log('파일 업로드 성공:', response.data);
    //     console.log('파일 업로드 성공:', response.data);
    //     alert("서비스 등록이 완료되었습니다.");
    //     // window.location.href = '/AdminReserveSetting.admin'; // 페이지 이동
        
    // })
    // .catch(error => {
    //     console.error('에러 발생:', error);
    // });
    
  };
//-------------------------------------------------------

// const handleUpload = async () => {
//   if (!selectedImage) return;

//   const formData = new FormData();
//   formData.append('file', selectedImage); // 'image'는 서버에서 기대하는 필드명입니다.
//   formData.append('category_id', 118);
//   console.log(formData);
  
//   try {
//     const response = await axios.post('/adminReservation/setMainCategoryImg', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
 
//   } catch (error) {
//     console.error('파일 업로드 실패:', error);
//   }
// };


//-----------------------------------------------------------------
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleAddCategory = () => {
    setCategories(prev => [...prev, {
      serviceName: '',
      servicePrice: 0,
      isPaid: false,
      isRequired: false,
      subCategoryType: '',
      subCategories: [{ name: '', price: 0 }]
    }]);
  };

  const handleRemoveCategory = (index) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  const handleChangeCategory = (index, field, value) => {
    setCategories(prev => prev.map((category, i) =>
      i === index ? { ...category, [field]: value } : category
    ));
  };

// subCategory 객체를 { serviceName: '', servicePrice: 0 } 형태로 수정
const handleAddSubCategory = (categoryIndex) => {
  const newSubCategory = { serviceName: '', servicePrice: 0 }; // 오타 수정: servicePirce -> servicePrice
  setCategories(prev => prev.map((category, index) =>
    index === categoryIndex
      ? { ...category, subCategories: [...category.subCategories, newSubCategory] }
      : category
  ));
};

const handleRemoveSubCategory = (categoryIndex, subCategoryIndex) => {
  setCategories(prev => prev.map((category, index) =>
    index === categoryIndex
      ? { ...category, subCategories: category.subCategories.filter((_, i) => i !== subCategoryIndex) }
      : category
  ));
};

// 필드명이 serviceName 또는 servicePrice일 경우에만 값을 변경하도록 수정
const handleChangeSubCategory = (categoryIndex, subCategoryIndex, field, value) => {
  setCategories(prev => prev.map((category, index) =>
    index === categoryIndex
      ? {
        ...category,
        subCategories: category.subCategories.map((sub, i) =>
          i === subCategoryIndex ? { ...sub, [field]: value } : sub
        )
      }
      : category
  ));
};

const [serviceDate, setServiceDate] = useState(''); // 날짜 상태
const [serviceHour, setServiceHour] = useState(''); // 시간 상태


  


  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);
  };


  useEffect(() => {
    console.log('Category :', categories);
}, [categories]);


  return (
    <div>
      <div className="main-content-title">예약 서비스 추가</div>
      <div className="main-btns">
        <button type="button" className="btn-st" onClick={handleComplete}>완료</button>
      </div>
      <div className="main-slot">
        <div> 서비스 시작일 </div>
       {/* 날짜 입력 필드 */}
       <input 
                type="date" 
                value={serviceDate} 
                onChange={(e) => setServiceDate(e.target.value)} 
            />

            {/* 시간 입력을 위한 드롭다운 */}
            <select 
                value={serviceHour} 
                onChange={(e) => setServiceHour(e.target.value)}
            >
                <option value="">시간 선택</option>
                {[...Array(24)].map((_, index) => (
                    <option key={index} value={String(index).padStart(2, '0')}>
                        {String(index).padStart(2, '0')}:00 {/* 두 자리로 표현 */}
                    </option>
                ))}
            </select>
      </div>
      <div className="main-slot">
        <div> 일별 건수 </div>
        <input type="number" value={dateNumCase} onChange={handleDateNumChange} />
      </div>
      {/* <div className="main-slot">
        <div> 시간별 예약 건수 </div>
        <input type="number" value={timeNumCase} onChange={handleTimeNumChange} />
      </div> */}
      <div className="main-contents">
      <div className="reserve-container">
      <div className="reserve-img">

        
      <div>
      <input type="file" className="btn-st btn-imgChg"  accept="image/*" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="미리보기" style={{ width: '100px', height: '100px' }} />}
   
    </div>
    {/* <button type="button" className="btn-st btn-imgChg" onClick={handleUpload}>
        사진 변경하기
      </button> */}
        </div>
        <div className="reserve-content">
          <div className="reserve-content-title">
            <div className="reserve-content-title-name">
              <input
                type="text"
                value={reserveAdd.serviceName}
                onChange={(e) => setName(e.target.value)}
                placeholder='서비스 명'
              />
            </div>
            <div className="reserve-content-title-price">
              <input
                type="number"
                value={reserveAdd.servicePrice}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='서비스 가격'
              />
            </div>
          </div>
          <div className="reserve-content-text">
            <textarea
              value={reserveAdd.serviceContent}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='서비스 설명'
            />
          </div>
        </div>
      </div>

      <div className="main-btns">
        <button type="button" className="btn-st" onClick={() => { handleAddCategory();}}>추가하기</button>
      </div>

      <div className="category-contents">
      <DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="categories">
    {(provided) => (
      <div className="category-contents" {...provided.droppableProps} ref={provided.innerRef}>
        {categories.map((category, index) => (
          <Draggable key={index} draggableId={`category-${index}`} index={index}>
            {(provided) => (
              <div className="category-container" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <div className="category-container-content">
                  <div className="type-input-require">
                  <div className="type-paid">
                      <label>
                        <input
                          type="radio"
                          checked={category.isPaid}
                          onChange={() => handleChangeCategory(index, 'isPaid', true)}
                        />
                        유료
                      </label>
                      <label>
                        <input
                          type="radio"
                          checked={!category.isPaid}
                          onChange={() => handleChangeCategory(index, 'isPaid', false)}
                        />
                        무료
                      </label>
                    </div>

                    <div className="type-require">
                    <label>
                      <input
                        type="radio"
                        checked={category.isRequired}
                        onChange={() => handleChangeCategory(index, 'isRequired', true)}
                      />
                      필수
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={!category.isRequired}
                        onChange={() => handleChangeCategory(index, 'isRequired', false)}
                      />
                      선택
                    </label>
                  </div>

                  </div>
                  <div className="type-category-sub">
  <input
    type="text"
    placeholder="이름"
    value={category.serviceName}
    onChange={(e) => handleChangeCategory(index, 'serviceName', e.target.value)}
  />
  <input
    type="number"
    placeholder="가격"
    value={category.isPaid ? category.servicePrice : 0} // isPaid가 false일 경우 가격을 0으로 설정
    onChange={(e) => handleChangeCategory(index, 'servicePrice', category.isPaid ? Number(e.target.value) : 0)}
    disabled={!category.isPaid || category.subCategoryType === 'SELECT1' || category.subCategoryType === 'SELECTN'}
    
  />
</div>


                  <div className="type-input-type">
                    <input
                      type="checkbox"
                      checked={category.subCategoryType === 'SELECT1'}
                      onChange={() => handleChangeCategory(index, 'subCategoryType', 'SELECT1')}
                    /> 선택 (하나)
                    <input
                      type="checkbox"
                      checked={category.subCategoryType === 'SELECTN'}
                      onChange={() => handleChangeCategory(index, 'subCategoryType', 'SELECTN')}
                    /> 선택 (다중)
                    <input
                      type="checkbox"
                      checked={category.subCategoryType === 'NUMBER'}
                      onChange={() => handleChangeCategory(index, 'subCategoryType', 'NUMBER')}
                    /> 숫자
                    <input
                      type="checkbox"
                      checked={category.subCategoryType === 'TEXT'}
                      onChange={() => handleChangeCategory(index, 'subCategoryType', 'TEXT')}
                    /> 텍스트
                  </div>

                  {/* 조건부 렌더링 추가 */}
                  {category.subCategoryType !== 'NUMBER' && category.subCategoryType !== 'TEXT' && (
                    <div className="category-sub-sub">
                      {category.subCategories.map((subCategory, subIndex) => (
                        <div key={subIndex} className="type-category-sub-sub">
                          <input
                            type="text"
                            placeholder="서브카테고리 이름"
                            value={subCategory.serviceName}
                            onChange={(e) => handleChangeSubCategory(index, subIndex, 'serviceName', e.target.value)}
                          />
                          <input
                            type="number"
                            placeholder="서브카테고리 가격"
                            value={category.isPaid ? subCategory.servicePrice : 0} // isPaid가 false일 경우 가격을 0으로 설정
                            onChange={(e) => handleChangeSubCategory(index, subIndex, 'servicePrice', Number(e.target.value))}
                            disabled={!category.isPaid} // isPaid가 false일 경우 비활성화
                          />
                          <button type="button" className="btn-sub-del" onClick={() => handleRemoveSubCategory(index, subIndex)}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn-sub-add" onClick={() => handleAddSubCategory(index)}> + </button>
                    </div>
                  )}

                
                </div>
                <button type="button" className="btn-del" onClick={() => handleRemoveCategory(index)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>

    </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminReserveSettingDetail />);
