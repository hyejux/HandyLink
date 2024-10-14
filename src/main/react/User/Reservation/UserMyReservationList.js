import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';
import './userMyReservationList.css';


function UserMyReservationList() {
    
    const [reservationList, setReservationList] = useState([]);

       useEffect(() => {
            axios.get('/userMyReservationList/getMyReserveList')
                .then(response => {
                    console.log(response.data);
                    setReservationList(response.data);
                })
                .catch(error => {
                    console.log('Error Category', error);
                });
        }, [])

  const [category, setCategory] = useState({
    categoryLevel: 0,
    parentCategoryLevel: 0,
    serviceName: '',
    servicePrice: 0,
    serviceContent: ''
  });

  return (
    <div>
           <div className="user-main-content">

           {reservationList.map((value, index) => (
            <div className="user-content-container"  key={index}>
              <div className="reservation-header">
                <span className="reservation-status">{value.reservationStatus}</span>
                <div className="reservation-time">{value.regTime} </div>
              </div>
              <div className="store-name-title">{value.storeName} <i class="bi bi-chevron-right"></i> </div>
              <div className="product-details">{value.serviceName} | {value.reservationPrice} 원</div>

              <div className="reservation-info">

                <div className="reservation-info-box">
                    <div className="date">
                    <i class="bi bi-calendar-check-fill"></i>
                    <span>{value.reservationSlotDate} </span>
                    </div>
                <div className="time">
                <i class="bi bi-clock-fill"></i>
                    <span>{value.reservationSlotTime.split("T")[1].substring(0, 5)}</span>
                    </div>
                </div>
                
                </div>
               </div>
  ))}


                </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserMyReservationList />
);