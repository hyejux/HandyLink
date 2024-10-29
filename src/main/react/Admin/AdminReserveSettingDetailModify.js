import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';

const AdminReserveSettingDetailModify = () => {





  const [reserveModi, setReserveModi] = useState('');
  const [subItemModi, setSubItemModi] = useState('');
  const [categories, setCategories] = useState([{
    serviceName: '',
    servicePrice: 0,
    isPaid: false,
    isRequired: false,
    subCategoryType: 'SELECT1',
    subCategories: [ {serviceName : '', servicePrice : ''}]
  }]);

  const [reserveAdd, setReserveAdd] = useState({
    serviceName: '',
    servicePrice: 0,
    serviceContent: ''
  });


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
        const { imageUrl,serviceContent,serviceName,servicePrice,serviceStart} = response.data; 
        setImagePreview(imageUrl);
        setName(serviceName);
        setPrice(servicePrice);
        setDescription(serviceContent);
        setServiceStart(serviceStart);
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
  


  //--------------------------------------------------





  //-------------------------------------------
  const handleComplete = () => {
    const transformedCategories = categories.map(category => ({
      ...category,
      isPaid: category.isPaid ? 'Y' : 'N',
      isRequired: category.isRequired ? 'Y' : 'N'
    }));




    console.log(transformedCategories);
    const requestData = {
      serviceName: reserveAdd.serviceName,
      servicePrice: reserveAdd.servicePrice,
      serviceContent: reserveAdd.serviceContent,
      categories: transformedCategories,
      ServiceStart: serviceStart,
      StoreNo : 7,
      StoreId: 'bbb123'
    };

    console.log(requestData);
    
    // 첫 번째 요청: 메인 카테고리 설정
    axios.post(`/adminReservation/setMainCategoryModi/${cateId}`, requestData, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
   
        console.log('메인 카테고리 설정 성공:', response.data);
        const formData = new FormData();
        formData.append('file', selectedImage); // 'file'은 서버에서 기대하는 필드명입니다.
        formData.append('category_id', response.data);
    
        // 두 번째 요청: 카테고리 이미지 업로드
        return axios.post('/adminReservation/setMainCategoryImg', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    })
    .then(response => {
        console.log('파일 업로드 성공:', response.data);
        console.log('파일 업로드 성공:', response.data);
        alert("서비스 등록이 완료되었습니다.");
        // window.location.href = '/AdminReserveSetting.admin'; // 페이지 이동
        
    })
    .catch(error => {
        console.error('에러 발생:', error);
    });
    
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
      <div className="main-content-title">예약 서비스 수정</div>
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
      <div className="main-slot">
        <div> 시간별 예약 건수 </div>
        <input type="number" value={timeNumCase} onChange={handleTimeNumChange} />
      </div>
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
                          type="checkbox"
                          checked={category.isPaid}
                          onChange={() => handleChangeCategory(index, 'isPaid', !category.isPaid)}
                        />
                        유료
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={!category.isPaid}
                          onChange={() => handleChangeCategory(index, 'isPaid', category.isPaid)}
                        />
                        무료
                      </label>
                    </div>
                    <div className="type-require">
                      <label>
                        <input
                          type="checkbox"
                          checked={category.isRequired}
                          onChange={() => handleChangeCategory(index, 'isRequired', !category.isRequired)}
                        />
                        필수
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={!category.isRequired}
                          onChange={() => handleChangeCategory(index, 'isRequired', category.isRequired)}
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
                      value={category.servicePrice}
                      onChange={(e) => handleChangeCategory(index, 'servicePrice', Number(e.target.value))}
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
                            value={subCategory.servicePrice}
                            onChange={(e) => handleChangeSubCategory(index, subIndex, 'servicePrice', Number(e.target.value))}
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
root.render(<AdminReserveSettingDetailModify />);
