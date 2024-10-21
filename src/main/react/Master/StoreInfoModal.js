import React from 'react';
import './StoreInfoModal.css';

function StoreInfoModal({ isOpen, onClose, store }) {
  if (!isOpen || !store) return null;

  const parseJson = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("JSON 파싱 오류:", error);
      return {};
    }
  };

  const parseDayOff = (dayOffString) => {
    return dayOffString.replace(/{|}/g, "").split(",").map(dayOff => dayOff.trim());
  };

  const addrInfo = parseJson(store.storeAddr);
  const dayOffInfo = parseDayOff(store.storeDayOff);
  const accountInfo = parseJson(store.storeAccount);
  const snsInfo = parseJson(store.storeSns);
  console.log("store:", store);


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
            <p><strong>우편번호:</strong> {addrInfo.zipcode}</p>
            <p><strong>주소:</strong> {addrInfo.addr} {addrInfo.addrdetail}</p>
          </div>

          <div className="info-section">
            <h3>운영 정보</h3>
            <p><strong>영업시간:</strong> {store.storeOpenTime} - {store.storeCloseTime}</p>
            <p><strong>휴무일:</strong> {Array.isArray(dayOffInfo) && dayOffInfo.length > 0 ? (
              dayOffInfo.map((day, index) => (
                <span key={index}>{day}{index < dayOffInfo.length - 1 ? ', ' : ''}</span>
              ))
            ) : (
              <span>정보 없음</span>
            )}</p>
            <p><strong>공지사항:</strong> {store.storeNotice}</p>
            <p><strong>계좌번호:</strong> {accountInfo.accountBank} : {accountInfo.accountNumber}</p>
          </div>

          <div className="info-section">
            <h3>추가 정보</h3>
            <p><strong>소개:</strong> {store.storeIntro}</p>
            <p><strong>주차가능여부:</strong> {store.storeParkingYn}</p>
            {Array.isArray(snsInfo) && snsInfo.length > 0 ? (
              snsInfo.map((sns, index) => (
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
