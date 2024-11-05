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
    console.log("storeNo ", storeNo);

    const [reportCount, setReportCount] = useState({
        cancledCount: 0,
        doingCount: 0,
        waitCount: 0,
        reviewCount: 0
    });

    const [genderCount, setGenderCount] = useState({});

    const [ageDistribution, setAgeDistribution] = useState({
        labels: [],
        values: [],
        serviceName: []
    });

    useEffect(() => {
        //우리가게
        const fetchReport = async () => {
            try {
                const resp = await axios.get(`/adminStore/getReportCount?storeNo=${storeNo}`);
                setReportCount(prev => ({
                    ...prev,
                    ...resp.data
                }));
            } catch (error) {
                console.error("예약 건수 통계 중 error: ", error);
            }
        };

        //고객통계 - 성별
        const fetchGender = async() => {
            try {
                const response = await fetch(`/adminStore/getGenderCount?storeNo=${storeNo}`);
                const data = await response.json(); // JSON으로 변환
                setGenderCount(data); // genderCount 상태 업데이트

            } catch (error) {
                console.error("고객 성별 수를 불러오는 중 error:", error);
            }
        };

        //나이대 별 인기상품
        const fetchAge = async() => {
            try {
                const response = await axios.get(`/adminStore/getAgeDistribution?storeNo=${storeNo}`);
                setAgeDistribution(response.data);
            } catch (error) {
                console.error("나이 별 top1 불러오는 중 error: ", error);
            }
        };

        fetchReport();
        fetchGender();
        fetchAge();

    }, [storeNo]);

    console.log("ageDistribution: ", ageDistribution);

    const [selectedPeriod, setSelectedPeriod] = useState("이번달");

    const handlePeriodChange = (newPeriod) => {
        setSelectedPeriod(newPeriod);
    };

    return(
        <div className="admin-store-report-container">
            <div className="store-report">

                <div className="report-section">
                    <h2>우리 가게</h2>
                    <div className="reservation-status">
                        <div className="reservation-field">
                            <p className="userLike-count"> {reportCount.userLikeCount} </p>
                            <p className=""> 찜 수 </p>
                        </div>
                        <div className="reservation-field">
                            <p className="review-count"> {reportCount.reviewCount} </p>
                            <p className=""> 리뷰 수 </p>
                        </div>
                        <div className="reservation-field">
                            <p className="complete-count"> {reportCount.completeCount} </p>
                            <p className=""> 완료 건 </p>
                        </div>
                        <div className="reservation-field">
                            <p className="cancled-count"> {reportCount.cancledCount} </p>
                            <p className=""> 예약 취소 </p>
                        </div>
                    {/*<div className="reservation-field">
                            <p className="wait-count"> {reportCount.waitCount} </p>
                            <p className=""> 예약 대기 </p>
                        </div>*/}
                        <div className="reservation-field">
                            <p className="doing-count"> {reportCount.doingCount} </p>
                            <p className=""> 진행 중 </p>
                        </div>
                    </div>
                </div>


                <div className="report-section">
                    <h2>일일 통계</h2>
                    <div className="reservation-graph">
                        <div className="graph-filter">
                            <span className={selectedPeriod === "이번달" ? 'active' : ''}
                                    onClick={() => handlePeriodChange("이번달")}>이번 달</span>
                            <span className={selectedPeriod === "올해" ? 'active' : ''}
                                    onClick={() => handlePeriodChange("올해")}>올해</span>
                            <span className={selectedPeriod === "작년" ? 'active' : ''}
                                    onClick={() => handlePeriodChange("작년")}>작년</span>
                        </div>
                        <div className="graph">
                            <ReservationBarChart period={selectedPeriod} />
                        </div>
                    </div>
                </div>
        
                <div className="report-section">
                    <h2>고객 통계</h2>
                    <div className="customer-section-box">
                        <div className="graph-section">
                            <div className="customer mw">
                                <h3>성비</h3>
                                <div>
                                    <MwChart/>
                                </div>
                            </div>


                            <div className="customer age">
                                <h3>나이</h3>
                                <div>
                                    <AgeChart data={ageDistribution} />
                                </div>
                            </div>
                        </div>

                        <div className="table-section">
                            <div className="mw detail">
                                <table className="mwtable">
                                    <thead>
                                        <tr>
                                            <th>남자</th>
                                            <th>여자</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{genderCount.males}</td>
                                            <td>{genderCount.females}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="age detail">
                                <table className="agetable">
                                    <thead>
                                        <tr>
                                            <th>나이</th>
                                            <th>주로 찾는 서비스</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ageDistribution.labels.map((label, index) => (
                                            <tr key={index}>
                                                <td>{label}</td>
                                                <td>{ageDistribution.serviceName[index] || '정보 없음'}</td> {/* Fallback if no service name */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
