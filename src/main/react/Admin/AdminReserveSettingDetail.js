import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';

const AdminReserveSettingDetailModify = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // 이미지 미리보기
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };



  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('file', selectedImage); // 'image'는 서버에서 기대하는 필드명입니다.
    formData.append('category_id', 118);
    console.log(formData);
    
    try {
      const response = await axios.post('/adminReservation/setMainCategoryImg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('파일 업로드 성공:', response.data);
    } catch (error) {
      console.error('파일 업로드 실패:', error);
    }
  };


// ---------------------------- 사진 등록하기

const [selectedImages, setSelectedImages] = useState([]); // 화면에 보여질 파일 리스트 (미리보기 URL)
const [uploadedImageUrls, setUploadedImageUrls] = useState([]); // 서버에서 반환된 실제 이미지 URL들

const onSelectFile = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files); // 선택된 파일들 배열로 변환

    // 이미지는 8장 이하일 때만 추가
    if (selectedImages.length + files.length <= 8) {

        // 미리보기
        const selectImgs = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...selectImgs]);

        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                // 서버에 파일 업로드
                const response = await axios.post('/adminStore/uploadImageToServer', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // 서버에서 반환된 URL
                return response.data; // imageUrl만 반환해야 합니다.
            } catch (error) {
                console.error("파일 업로드 오류: ", error); // 오류 로그 추가
                return null; // 오류가 발생할 경우 null 반환
            }
        });

        // 모든 URL을 받아서 상태 업데이트
        const imageUrls = await Promise.all(uploadPromises);
        console.log("업로드된 이미지 URL들: ", imageUrls); // 확인 로그 추가

        // null 값 필터링
        const filteredUrls = imageUrls.filter(url => url !== null);

        // 실제 서버 URL 배열 업데이트
        setUploadedImageUrls((prev) => [...prev, ...filteredUrls]);

        // Store 정보 업데이트
        setStoreInfoRegistData((prev) => ({
            ...prev,
            imageUrl: [...prev.imageUrl, ...filteredUrls], // URL 배열로 업데이트
        }));
    } else {
        alert('이미지는 최대 8장까지 업로드 가능합니다.');
    }
};

const removeImage = async (index) => {
    // 미리보기와 서버 URL이 각각 동기화되어야 함
    const imageUrlToRemove = uploadedImageUrls[index];

    try {
        // 서버에 삭제 요청
        await axios.delete('/adminStore/deleteImage', { data: { imageUrl: imageUrlToRemove } });

        // 미리보기 이미지 상태 업데이트
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));

        // 서버에서 저장된 실제 URL 상태 업데이트
        setUploadedImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));

        // Store 정보 업데이트
        setStoreInfoRegistData((prev) => ({
            ...prev,
            imageUrl: prev.imageUrl.filter((_, i) => i !== index), // URL 배열에서 삭제
        }));

    } catch (error) {
        console.error("이미지 삭제 오류: ", error); // 오류 로그 추가
    }
};

//사진업로드











  // -----------------------------------
  const [categories, setCategories] = useState([{
    serviceName: '',
    servicePrice: 0,
    isPaid: false,
    isRequired: false,
    subCategoryType: 'SELECT1',
    subCategories: [{ name: '', price: 0 }]
  }]);

  const [reserveAdd, setReserveAdd] = useState({
    serviceName: '',
    servicePrice: 0,
    serviceContent: ''
  });

  const handleComplete = () => {
    const transformedCategories = categories.map(category => ({
      ...category,
      isPaid: category.isPaid ? 'Y' : 'N',
      isRequired: category.isRequired ? 'Y' : 'N'
    }));

    const requestData = {
      serviceName: reserveAdd.serviceName,
      servicePrice: reserveAdd.servicePrice,
      serviceContent: reserveAdd.serviceContent,
      categories: transformedCategories
    };

    axios.post(`/adminReservation/setMainCategory`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log(response.data);
      // window.location.href = '../AdminReserveSetting.admin';
    })
    .catch(error => {
      console.log('Error setMainCategory', error);
    });
  };

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

  const handleAddSubCategory = (categoryIndex) => {
    const newSubCategory = { name: '', price: 0 };
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
      <div className="main-contents">
      <div className="reserve-container">
      <div className="reserve-img">

        
      <div>
      <input type="file" className="btn-st btn-imgChg"  accept="image/*" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="미리보기" style={{ width: '100px', height: '100px' }} />}
   
    </div>
    <button type="button" className="btn-st btn-imgChg" onClick={handleUpload}>
        사진 변경하기
      </button>
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
        <button type="button" className="btn-st" onClick={handleAddCategory}>추가하기</button>
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

                      {/* <button type="button" onClick={() => handleRemoveSubCategory(index, subIndex)}>삭제하기</button>
                      <div className="remove-category-btn">
                     
                        <button type="button" onClick={() => handleAddSubCategory(index)}>서브카테고리 추가</button>
                      </div> */}

                     
                  <div className="category-sub-sub">
                      {category.subCategories.map((subCategory, subIndex) => (
                           
                        <div key={subIndex} className="type-category-sub-sub">
                          <input
                            type="text"
                            placeholder="서브카테고리 이름"
                            value={subCategory.name}
                            onChange={(e) => handleChangeSubCategory(index, subIndex, 'name', e.target.value)}
                          />
                          <input
                            type="number"
                            placeholder="서브카테고리 가격"
                            value={subCategory.price}
                            onChange={(e) => handleChangeSubCategory(index, subIndex, 'price', Number(e.target.value))}
                          />
                           <button type="button" className="btn-sub-del" onClick={() => handleRemoveSubCategory(index, subIndex)}>
                          <i className="bi bi-x-lg"></i>
                        </button>


                        </div>
                    
                         
                      ))}
                          <button type="button" className="btn-sub-add" onClick={() => handleAddSubCategory(index)}> + </button>
                          </div>
                    </div>
                    
                    <button type="button" className="btn-del" onClick={() => handleRemoveCategory(index)}>
                  <i className="bi bi-x-lg"></i>
                </button>
                    {/* <button type="button" onClick={() => handleRemoveCategory(index)}>삭제하기</button> */}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* <div className="main-btns">
        <button type="button" className="btn-st" onClick={handleComplete}>완료</button>
        <button type="button" className="btn-st" onClick={handleAddCategory}>추가하기</button>
      </div> */}
    </DragDropContext>

    </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminReserveSettingDetailModify />);
