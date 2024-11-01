import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import MwChart from './MwChart.js';
import AgeChart from './AgeChart.js';
import ReservationBarChart from './ReservationBarChart.js';
import './AdminStoreReport.css';

function AdminStoreReport(){
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');

    useEffect(() => {
        const fetchReport = async() => {
            const resp = await axios.get(`/adminStore/getStoreReport?storeNo=${storeNo}`); //아직 서버 안함.
            console.log("리포트정보 ", resp.data);
        };
    },[]);


    return(
        <div className="admin-store-report-container">
            <label htmlFor="store-report">데이터 아님</label>
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
                    <div className="reservation-graph">
                        <div className="graph-filter">
                            <span>이번 달</span>
                            <span>올해</span>
                            <span>작년</span>
                        </div>
                        <div className="graph">
                            <ReservationBarChart/>
                        </div>
                    </div>
                </div>
        
                <div className="report-section">
                    <h2>고객 통계</h2>
                    <div className="customer-section-box">
                
                        <div className="customer mw">
                            <h3>성비</h3>
                            <div>
                                <MwChart/>
                            </div>
                        </div>
                
                        <div className="mw-detail">
                            <table className="mwtable table">
                                <thead>
                                    <tr>
                                        <th>남자</th>
                                        <th>여자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>150명</td>
                                        <td>200명</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                
                        <div className="customer age">
                            <h3>나이</h3>
                            <div>
                                <AgeChart />
                            </div>
                        </div>
                
                        <div className="age-detail">
                            <table className="agetable table">
                                <thead>
                                    <tr>
                                        <th>나이</th>
                                        <th>주로 찾는 서비스</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>10대</td>
                                        <td>하츄핑 케이크</td>
                                    </tr>
                                    <tr>
                                        <td>20대</td>
                                        <td>빵빵이 케이크</td>
                                    </tr>
                                    <tr>
                                        <td>30대</td>
                                        <td>퇴사 케이크</td>
                                    </tr>
                                </tbody>
                            </table>
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
