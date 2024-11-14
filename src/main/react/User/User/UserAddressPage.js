import React, { useState } from 'react';
import './UserAddressPage.css';
import ReactDOM from "react-dom/client";

function UserAddressPage() {
    const [addresses, setAddresses] = useState([
        { name: '집', address: '[06000] 서울 강남구 압구정동 압구정로 113 라이프미성 2차 102동 1001호', phone: '010-4624-1221', isDefault: true },
        { name: '본가', address: '[13455] 경기 성남시 분당구 하오개로349번길 10 파크하임 1004동 701호', phone: '010-7643-3620', isDefault: false },
        { name: '회사', address: '[06431] 서울 강남구 테헤란로7길 7 에스코빌딩 1층 CU', phone: '010-4624-1221', isDefault: false },
    ]);

    const handleAddAddress = () => {
        const newAddress = prompt("추가할 주소를 입력하세요");
        if (newAddress) {
            setAddresses([...addresses, { name: '새 주소', address: newAddress, phone: '010-0000-0000', subPhone: '', isDefault: false }]);
        }
    };

    const handleSelectAddress = (index) => {
        setAddresses(
            addresses.map((addr, i) => ({
                ...addr,
                isDefault: i === index
            }))
        );
    };

    const handleDeleteAddress = (index) => {
        alert("선택한 배송지를 삭제하시겠습니까?");
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    return (
        <div className="address-page">
            <button className="add-address-btn" onClick={handleAddAddress}>+ 신규 배송지 추가</button>
            <ul className="address-list">
                {addresses.map((address, index) => (
                    <li
                        key={index}
                        className={`address-item ${address.isDefault ? 'default' : ''}`}
                        onClick={() => handleSelectAddress(index)}
                    >
                        <div className="address-info">
              <span className="address-name">
                  {address.isDefault && <i className="bi bi-check"></i>}
                  {address.name} {address.isDefault && <span className="default-label">기본주소</span>}
              </span>
                            <p>{address.address}</p>
                            <p>{address.phone}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(index); }} className="delete-btn">삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserAddressPage />
);