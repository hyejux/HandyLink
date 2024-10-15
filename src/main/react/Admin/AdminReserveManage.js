import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminReserveManage.css';

function AdminReserveManage() {
const [passengers, setPassengers] = useState([
        {
            id: 1,
            name: "Clara Smith",
            email: "tranthuy.nute@...",
            phone: "(319) 555-0115",
            airline: "ATLANTA JET Airlines",
            flightStatus: "대 기",
            date: "09/18/23",
            time: "08:40",
            seat: "18F",
            destination: "RDU",
        },
        {
            id: 2,
            name: "Floyd Miles",
            email: "vuahiuthoungnt@...",
            phone: "(405) 555-0128",
            airline: "PEGASUS Airlines",
            flightStatus: "완 료",
            date: "09/18/23",
            time: "09:45",
            seat: "1D",
            destination: "RDU",
        },
        {
            id: 3,
            name: "Jerome Bell",
            email: "manhhackit08@...",
            phone: "(252) 555-0126",
            airline: "UIA Airlines",
            flightStatus: "#5028",
            date: "09/18/23",
            time: "12:37",
            seat: "16A",
            destination: "RDU",
        },
        {
            id: 4,
            name: "Ronald Richards",
            email: "binhan628@...",
            phone: "(208) 555-0112",
            airline: "MONTANA Airways",
            flightStatus: "#5028",
            date: "09/18/23",
            time: "16:45",
            seat: "2E",
            destination: "RDU",
        },
    ]);

     const [reservationList, setReservationList] = useState([]);

       useEffect(() => {
            axios.get('/adminReservation/getManageList')
                .then(response => {
                    console.log(response.data);
                    setReservationList(response.data);
                })
                .catch(error => {
                    console.log('Error Category', error);
                });
        }, [])



  return (





    <div>
            <div className="main-content-title">예약 관리</div>

        <div className="main-btns">
            {/* <button type="button" className="btn-st" >
                    추가하기
                </button> */}
        </div>

        <div className="main-contents">
       <div className="management-container">
                
                   <table className="management-table">
                       <thead>
                           <tr>
                               <th></th>
                               <th>
                                   <div>예약 번호<span className="material-symbols-outlined">expand_all</span></div>
                               </th>
                               <th>
                                   <div>  고객 명 <span className="material-symbols-outlined">expand_all</span></div>
                               </th>
                               <th>
                                   <div>예약일 <span className="material-symbols-outlined">expand_all</span></div>
                               </th>
                               <th>
                                   <div>총액 <span className="material-symbols-outlined">expand_all</span></div>
                               </th>
                               <th>
                                   <div>요청사항 <span className="material-symbols-outlined">expand_all</span></div>
                               </th>
                               <th>
                                   <div>예약 상태 <span className="material-symbols-outlined">expand_all</span></div>
                               </th>
                               
                     
                           </tr>
                       </thead>
                       <tbody>
                           {reservationList.map((value,index) => (
                               <tr key={index}>
                                   <td><input type="checkbox" /></td>
                                   <td>{value.reservationNo}</td>
                                   <td>{value.userId}</td>
                                   <td> {value.confirmTime}</td>
                                   
                                   
                                   
                                   <td>{value.reservationPrice}</td>
                                   <td>{value.customerRequest}</td>
                                   <td><button className="flight-btn">{value.reservationStatus}</button></td>
                                   {/* <td>{value.storeId}</td> */}
                                   

                               </tr>
                           ))}
                       </tbody>
                   </table>

                   {/* Pagination can be added here if needed */}
                   {/* <div className="pagination">
                       <span>Rows per page: 14</span>
                       <span>1-4 of 4</span>
                       <button>&lt;</button>
                       <button>&gt;</button>
                   </div> */}
               </div>

        </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminReserveManage />
);