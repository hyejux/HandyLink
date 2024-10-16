import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';

const AdminReserveSettingDetailModify = () => {
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
          {/* <img src={http://localhost:8585/img/${reserveModi.imageUrl}} alt="My Image" /> */}
          <button type="button" className="btn-st btn-imgChg">사진 변경하기</button>
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
