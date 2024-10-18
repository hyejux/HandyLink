import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import './UserReservationConfirm.css';


function UserReservationConfirm() {
  

  const loadFromSessionStorage = () => {
    const storedData = sessionStorage.getItem('combinedInputs');
    if (storedData) {
      // JSON 문자열을 다시 객체로 변환
      const parsedData = JSON.parse(storedData);
      console.log(parsedData);
      setCombinedInputs(parsedData);
    }
  };

  useEffect(() => {
    loadFromSessionStorage(); // 저장된 데이터를 불러옴
  }, []);
  
  const slot = sessionStorage.getItem('selectSlot');
  const date = sessionStorage.getItem('formattedDate');
  const reservationSlotKey = sessionStorage.getItem('reservationSlotKey');

  console.log('Slot:', slot);
  console.log('Date:', date);
  console.log('reservationSlotKey:', reservationSlotKey);


   // 상태 변경 시 콘솔에 출력
   useEffect(() => {
    console.log('Category Inputs:', combinedInputs);
}, [combinedInputs]);

//------------------------------------



 return (
   <div>
   \

     </div>
  )
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <UserReservationConfirm />
);



