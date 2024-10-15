import React from 'react';
import './StoreInfoModal.css';

function StoreInfoModal({ isOpen, onClose, store, storeInfo }) {
  if (!isOpen || !store || !storeInfo) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>

        <h2>{store.storeName} 정보</h2>

        <div className="modal-body">
          <div className="info-section">
            <h3>기본 정보</h3>
            <p><strong>가입일:</strong> {store.storeSignup}</p>
            <p><strong>업종:</strong> {store.storeCate}</p>
          </div>

          <div className="info-section">
            <h3>운영 정보</h3>
            <p><strong>영업시간:</strong> {storeInfo.storeStartTime} - {storeInfo.storeEndTime}</p>
            <p><strong>휴무일:</strong> {storeInfo.storeBreakDate}</p>
            <p><strong>계좌번호:</strong> {storeInfo.accountNumber}</p>
          </div>

          <div className="info-section">
            <h3>추가 정보</h3>
            <p><strong>소개:</strong> {storeInfo.storeIntro}</p>
            <p><strong>주차가능여부:</strong> {storeInfo.storeParkingYn}</p>
            <p><strong>SNS:</strong> {storeInfo.storeSns}</p>
            <p><strong>공지사항:</strong> {storeInfo.notice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreInfoModal;
