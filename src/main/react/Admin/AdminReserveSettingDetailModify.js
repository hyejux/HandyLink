import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';

const AdminReserveSettingDetailModify = () => {
  const [cateId, setCateId] = useState(0);
  const [reserveModi, setReserveModi] = useState('');
  const [subItemModi, setSubItemModi] = useState('');
  const [categories, setCategories] = useState([{ name: '', price: '', isPaid: false, isRequired: false, inputType: '' }]);

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
      .get(`/adminReservation/getSubItem/${cateId}`)
      .then(response => {
        console.log(response.data);
        const transformedData = response.data.map(item => ({
          name: item.serviceName, // serviceName -> name
          price: item.servicePrice, // servicePrice -> price
          isPaid: item.isPaid === 'Y', // isPaid ("Y"/"N") -> true/false
          isRequired: item.isRequired === 'Y', // isRequired ("Y"/"N") -> true/false
          inputType: item.subCategoryType // subCategoryType -> inputType
        }));

        setCategories(transformedData);
      })
      .catch(error => {
        console.log('Error subItemModi', error);
      });
  }, [cateId]);




  const handleAddCategory = () => {
    setCategories([...categories, { name: '', price: '', isPaid: false, isRequired: false, inputType: '' }]);
  };

  const handleRemoveCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleChangeCategory = (index, field, value) => {
    const newCategories = categories.map((category, i) =>
      i === index ? { ...category, [field]: value } : category
    );
    setCategories(newCategories);
  };




  return (
    <div>
      <div className="main-content-title">예약 서비스 수정22</div>
      <div className="main-btns">
        <button type="button" className="btn-st">수정완료</button>
      </div>
      <div className="main-contents">
        <div className="reserve-container">
          <div className="reserve-img">
            <img src={`http://localhost:8585/img/${reserveModi.imageUrl}`} alt="My Image" />
            <button type="button" className="btn-st btn-imgChg">사진 변경하기</button>
          </div>
          <div className="reserve-content">
            <div className="reserve-content-title">
              <div className="reserve-content-title-name">
                <input type="text" value={reserveModi.serviceName} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="reserve-content-title-price">
                <input type="number" value={reserveModi.servicePrice} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
            <div className="reserve-content-text">
              <textarea value={reserveModi.serviceContent} onChange={(e) => setDescription(e.target.value)} />
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
                    value={category.name}
                    onChange={(e) => handleChangeCategory(index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="가격"
                    value={category.price}
                    disabled={category.isPaid === true && (category.inputType === 'SELECT1' || category.inputType === 'SELECTN')}
                    onChange={(e) => handleChangeCategory(index, 'price', e.target.value)}
                  />
                </div>
                <div className="type-input-type">
                  <input
                    type="checkbox"
                    checked={category.inputType === 'SELECT1'}
                    onChange={() => handleChangeCategory(index, 'inputType', 'SELECT1')}
                  /> 선택 (하나)
                  <input
                    type="checkbox"
                    checked={category.inputType === 'SELECTN'}
                    onChange={() => handleChangeCategory(index, 'inputType', 'SELECTN')}
                  /> 선택 (다중)
                  <input
                    type="checkbox"
                    checked={category.inputType === 'NUMBER'}
                    onChange={() => handleChangeCategory(index, 'inputType', 'NUMBER')}
                  /> 숫자
                  <input
                    type="checkbox"
                    checked={category.inputType === 'TEXT'}
                    onChange={() => handleChangeCategory(index, 'inputType', 'TEXT')}
                  /> 텍스트
                </div>
              </div>
              <button type="button" className="btn-del" onClick={() => handleRemoveCategory(index)}>
                <i className="bi bi-x-square"></i>
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
