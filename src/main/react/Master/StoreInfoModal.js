import React from 'react';
import './StoreInfoModal.css';

function StoreInfoModal({ isOpen, onClose, store }) {
  console.log(store);
  
  if (!isOpen || !store) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>

        <h2>{store.storeName} 정보</h2>

        <div className="modal-body">
          <div className="info-section">
            <h3>기본 정보</h3>
            <p><strong>가입일:</strong> {new Date(store.storeSignup).toLocaleDateString('ko-KR')}</p>
            <p><strong>업종:</strong> {store.storeCate}</p>
            <p><strong>우편번호:</strong> {store.zipcode}</p>
            <p><strong>주소:</strong> {store.addr} {store.addrdetail}</p>
          </div>

          <div className="info-section">
            <h3>운영 정보</h3>
            <p><strong>영업시간:</strong> {store.storeOpenTime} - {store.storeCloseTime}</p>
            <p><strong>휴무일:</strong> {store.dayOffs.length > 0 ? (
              store.dayOffs.map((day, index) => (
                <span key={index}>{day.dayOffDay || day}{index < store.dayOffs.length - 1 ? ', ' : ''}</span>
              ))
            ) : (
              <span>정보 없음</span>
            )}</p>

            <p><strong>공지사항:</strong> {store.storeNotice}</p>
            <p><strong>계좌번호:</strong> {store.accountBank} : {store.accountNumber}</p>
          </div>

          <div className="info-section">
            <h3>추가 정보</h3>
            <p><strong>소개:</strong> {store.storeIntro}</p>
            <p><strong>주차가능여부:</strong> {store.storeParkingYn === 'Y' ? '가능' : '불가능'}</p>
            {store.snsLinks.length > 0 ? (
              store.snsLinks.map((sns, index) => (
                <div key={index}>
                  <p><strong>{sns.snsName}:</strong> <a href={sns.snsLink} target="_blank" rel="noopener noreferrer">{sns.snsLink}</a></p>
                </div>
              ))
            ) : (
              <p>정보 없음</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreInfoModal;
