import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './AdminStoreReport.css';

function AdminStoreReport(){


    return(
        <div className="admin-store-report-container">
            <label htmlFor="store-report">통계 관리</label>
            <div className="store-report">

                <div className="report-section">
                    <h2>우리 가게</h2>
                    <div className="reservation-status">
                        <div className="reservation-field">
                            <p className="wait-count"> 0 </p>
                            <p className=""> 예약 대기 </p>
                        </div>
                        <div className="reservation-field">
                            <p className="refund-count"> 0 </p>
                            <p className=""> 환불 신청 </p>
                        </div>
                        <div className="reservation-field">
                            <p className="today-count"> 0 </p>
                            <p className=""> 오늘 픽업 </p>
                        </div>
                        <div className="reservation-field">
                            <p className="doing-count"> 0 </p>
                            <p className=""> 예약 진행 </p>
                        </div>
                    </div>
                </div>


                <div className="report-section">
                    <h2>일일 통계</h2>
                    <div classNAme="reservation-graph">
                        <p> 2024-09-25 ~ 2024-10-25 </p>
                        <div className="graph-filter">

                        </div>

                    </div>
                </div>






            </div>
        </div>
    )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminStoreReport/>
);
