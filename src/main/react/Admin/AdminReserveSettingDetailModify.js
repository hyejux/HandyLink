import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import axios from 'axios';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';

const AdminReserveSettingDetailModify = () => {

    const [cateId, setCateId] = useState(0);
    const [reserveModi, setReserveModi] = useState('');

    useEffect(() => {
        const path = window.location.pathname;
        const pathSegments = path.split('/'); // URL 경로를 '/'로 나눕니다.
        const categoryId = pathSegments[pathSegments.length - 1]; // 마지막 세그먼트를 가져옵니다.
        setCateId(categoryId);


    }, []);

        useEffect(() => {
        axios.get(`/adminReservation/getListDetail/${cateId}`)
                           .then(response => {
                               console.log(response.data);
                               setReserveModi(response.data);
                           })
                           .catch(error => {
                               console.log('Error Category', error);
                           });


        }, [cateId]);




  const [name, setName] = useState("미니 팬케이크");
  const [price, setPrice] = useState(13000);
  const [description, setDescription] = useState("작은 선물용으로 좋은 미니 팬케이크 입니다. 다양한 옵션으로 주문가능합니다.");
  const [subCategories, setSubCategories] = useState([{ name: '', price: '' }]);



  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, { name: '', price: '' }]);
  };

  const handleRemoveSubCategory = (index) => {
    const newSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(newSubCategories);
  };

  const handleChangeSubCategory = (index, field, value) => {
    const newSubCategories = subCategories.map((sub, i) =>
      i === index ? { ...sub, [field]: value } : sub
    );
    setSubCategories(newSubCategories);
  };

  return (
    <div>
      <div className="main-content-title">예약 수정</div>
      <div className="main-btns">
        <button type="button" className="btn-st"> 수정완료 </button>
      </div>
      <div className="main-contents">
        <div className="reserve-container">
          <div className="reserve-img">
             <img src={`http://localhost:8585/img/${reserveModi.imageUrl}`} alt="My Image" />
            <button type="button" className="btn-st btn-imgChg"> 사진 변경하기 </button>
          </div>
          <div className="reserve-content">
            <div className="reserve-content-title">
              <div className="reserve-content-title-name">
                <input
                  type="text"
                  value={reserveModi.serviceName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="reserve-content-title-price">
                <input
                  type="number"
                  value={reserveModi.servicePrice}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="reserve-content-text">
              <textarea
                value={reserveModi.serviceContent}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="main-btns">
          <button type="button" className="btn-st"> 추가하기 </button>
        </div>

        <div className="category-contents">
          <div className="category-container">
            <div className="category-container-content">
              <div className="type-input-require">
                <div className="type-paid">
                  <input type="checkbox" /> 무료
                  <input type="checkbox" /> 유료
                </div>
                <div className="type-require">
                  <input type="checkbox" /> 필수
                  <input type="checkbox" /> 선택
                </div>
              </div>
              <div className="type-category-sub">
                <input type="text" placeholder="이름" />
                <input type="number" placeholder="가격" />
              </div>

              <div className="type-input-type">
                <input type="checkbox" /> 선택 (하나)
                <input type="checkbox" /> 선택 (다중)
                <input type="checkbox" /> 숫자
                <input type="checkbox" /> 텍스트
              </div>

              <div className="category-sub-sub">
                {subCategories.map((sub, index) => (
                  <div className="type-category-sub-sub" key={index}>
                    <input
                      type="text"
                      placeholder="이름"
                      value={sub.name}
                      onChange={(e) => handleChangeSubCategory(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="가격"
                      value={sub.price}
                      onChange={(e) => handleChangeSubCategory(index, 'price', e.target.value)}
                    />
                    <button type="button" className="btn-sub-del" onClick={() => handleRemoveSubCategory(index)}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-sub-add" onClick={handleAddSubCategory}>
                  +
                </button>
              </div>
            </div>
            <button type="button" className="btn-modi">
              <i className="bi bi-x-square"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminReserveSettingDetailModify />);
