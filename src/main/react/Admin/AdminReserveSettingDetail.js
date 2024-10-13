import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';

const AdminReserveSettingDetailModify = () => {
  const [categories, setCategories] = useState([{
    serviceName: '',
    servicePrice: 0,
    isPaid: false,
    isRequired: false,
    subCategoryType: 'SELECT1',
    subCategories: [] // Added to manage subcategories
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

    axios
      .post(`/adminReservation/setMainCategory`, requestData, {
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

  const setName = (value) => {
    setReserveAdd((prevState) => ({
      ...prevState,
      serviceName: value
    }));
  };

  const setPrice = (value) => {
    setReserveAdd((prevState) => ({
      ...prevState,
      servicePrice: value
    }));
  };

  const setDescription = (value) => {
    setReserveAdd((prevState) => ({
      ...prevState,
      serviceContent: value
    }));
  };

  const handleAddCategory = () => {
    setCategories([...categories, {
      serviceName: '',
      servicePrice: 0,
      isPaid: false,
      isRequired: false,
      subCategoryType: '',
      subCategories: [{ name: '', price: 0 }] 
    }]);
  };

   
  useEffect(() => {
      console.log(categories);
  });

  const handleRemoveCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleChangeCategory = (index, field, value) => {
    const newCategories = categories.map((category, i) =>
      i === index ? { ...category, [field]: value } : category
    );
    setCategories(newCategories);
  };

  const handleAddSubCategory = (categoryIndex) => {
    const newSubCategory = { name: '', price: 0 };
    const updatedCategories = categories.map((category, index) =>
      index === categoryIndex
        ? { ...category, subCategories: [...category.subCategories, newSubCategory] }
        : category
    );
    setCategories(updatedCategories);
  };

  const handleRemoveSubCategory = (categoryIndex, subCategoryIndex) => {
    const updatedCategories = categories.map((category, index) =>
      index === categoryIndex
        ? {
            ...category,
            subCategories: category.subCategories.filter((_, i) => i !== subCategoryIndex)
          }
        : category
    );
    setCategories(updatedCategories);
  };

  const handleChangeSubCategory = (categoryIndex, subCategoryIndex, field, value) => {
    const updatedCategories = categories.map((category, index) =>
      index === categoryIndex
        ? {
            ...category,
            subCategories: category.subCategories.map((sub, i) =>
              i === subCategoryIndex ? { ...sub, [field]: value } : sub
            )
          }
        : category
    );
    setCategories(updatedCategories);
  };

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
          {categories.map((category, index) => (
            <div className="category-container" key={index}>
              <div className="category-container-content">
                <div className="type-input-require">
                  <div className="type-paid">
                    <input
                      type="checkbox"
                      checked={!category.isPaid}
                      onChange={(e) => handleChangeCategory(index, 'isPaid', !e.target.checked)}
                    /> 무료
                    <input
                      type="checkbox"
                      checked={category.isPaid}
                      onChange={(e) => handleChangeCategory(index, 'isPaid', e.target.checked)}
                    /> 유료
                  </div>
                  <div className="type-require">
                    <input
                      type="checkbox"
                      checked={category.isRequired}
                      onChange={(e) => handleChangeCategory(index, 'isRequired', e.target.checked)}
                    /> 필수
                    <input
                      type="checkbox"
                      checked={!category.isRequired}
                      onChange={(e) => handleChangeCategory(index, 'isRequired', !e.target.checked)}
                    /> 선택
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
                    disabled={category.isPaid === true && (category.subCategoryType === 'SELECT1' || category.subCategoryType === 'SELECTN')}
                    onChange={(e) => handleChangeCategory(index, 'servicePrice', e.target.value)}
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

                {category.subCategoryType === 'SELECT1' || category.subCategoryType === 'SELECTN' ? (
                  <div className="category-sub-sub">
                    {category.subCategories.map((subCategory, subIndex) => (
                      <div className="type-category-sub-sub" key={subIndex}>
                        <input
                          type="text"
                          placeholder="이름"
                          value={subCategory.name}
                          onChange={(e) => handleChangeSubCategory(index, subIndex, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="가격"
                          value={subCategory.price}
                          onChange={(e) => handleChangeSubCategory(index, subIndex, 'price', e.target.value)}
                        />
                        <button type="button" className="btn-sub-del" onClick={() => handleRemoveSubCategory(index, subIndex)}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ))}
                    <button type="button" className="btn-sub-add" onClick={() => handleAddSubCategory(index)}> + </button>
                  </div>
                ) : null}

              
              </div>
              <button type="button" className="btn-del" onClick={() => handleRemoveCategory(index)}>
                  <i className="bi bi-x-lg"></i>
                </button>
            </div>
          ))}
            
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminReserveSettingDetailModify />);
