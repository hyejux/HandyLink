import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminReserveSetting.css';
import './AdminReserveSettingDetail.css';


function AdminReserveSettingDetail() {
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
      <div>
          <div className="main-content-title">예약 수정</div>
          <div className="main-btns">
            <button type="button" className="btn-st"> 수정완료 </button>
          </div>
          <div className="main-contents">
            <div className="reserve-container">
              <div className="reserve-img">
                <img src="http://localhost:8585/img/cake001.jpg" alt="My Image" />
                <button type="button" className="btn-st btn-imgChg"> 사진 변경하기 </button>
              </div>
              <div className="reserve-content">
                <div className="reserve-content-title">
                  <div className="reserve-content-title-name">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="reserve-content-title-price">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="reserve-content-text">
                  <textarea
                    value={description}
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
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminReserveSettingDetail />
);