import React, { useState } from 'react';
import './UserAddressPage.css';
import ReactDOM from "react-dom/client";

function UserAddressPage() {
    const [addresses, setAddresses] = useState([
        { name: '홍길동', address: '[07280] 서울특별시 영등포구 선유로 00 현대아파트 000동 000호', phone: '010-0000-0000', subPhone: '010-9999-0000', isDefault: true },
        { name: '홍이름', address: '[07280] 서울특별시 영등포구 당산동 0가 현대아파트 000동 000호', phone: '010-0000-0000', subPhone: '02-2000-0000', isDefault: false },
        { name: '홍아름', address: '[07280] 서울특별시 영등포구 당산동 0가 현대아파트 000동 000호', phone: '010-0000-0000', subPhone: '02-2000-0000', isDefault: false },
        { name: '김이름', address: '[07280] 서울특별시 영등포구 당산동 0가 현대아파트 000동 000호', phone: '010-0000-0000', subPhone: '02-2000-0000', isDefault: false }
    ]);

    const handleAddAddress = () => {
        const newAddress = prompt("추가할 주소를 입력하세요");
        if (newAddress) {
            setAddresses([...addresses, { name: '새 주소', address: newAddress, phone: '010-0000-0000', subPhone: '', isDefault: false }]);
        }
    };

    const handleDeleteAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const handleSelectAddress = (index) => {
        setAddresses(
            addresses.map((addr, i) => ({
                ...addr,
                isDefault: i === index
            }))
        );
    };

    return (
        <div className="address-page">
            <button className="add-address-btn" onClick={handleAddAddress}>+ 신규 배송지 추가</button>
            <ul className="address-list">
                {addresses.map((address, index) => (
                    <li key={index} className={`address-item ${address.isDefault ? 'default' : ''}`}>
                        <div className="address-info">
              <span className="address-name">
                {address.name} {address.isDefault && <span className="default-label">기본주소</span>}
              </span>
                            <p>{address.address}</p>
                            <p>{address.phone} | {address.subPhone}</p>
                        </div>
                        <div className="address-actions">
                            <button onClick={() => handleSelectAddress(index)} className="select-btn">
                                {address.isDefault ? '선택됨' : '선택'}
                            </button>
                            <button onClick={() => handleDeleteAddress(index)} className="delete-btn">삭제</button>
                        </div>
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