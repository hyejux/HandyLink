import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import MwChart from './MwChart.js';
import AgeChart from './AgeChart.js';
import ReservationBarChart from './ReservationBarChart.js';
import MonthlySalesBarChart from './MonthlySalesBarChart.js';
import './AdminStoreReport.css';

function AdminStoreReport() {
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');

    const [genderCount, setGenderCount] = useState({});

    const [ageDistribution, setAgeDistribution] = useState({
        labels: [],
        values: [],
        serviceName: []
    });

    useEffect(() => {

        //고객통계 - 성별
        const fetchGender = async () => {
            try {
                const response = await fetch(`/adminStore/getGenderCount?storeNo=${storeNo}`);
                const data = await response.json(); // JSON으로 변환
                setGenderCount(data); // genderCount 상태 업데이트

            } catch (error) {
                console.error("고객 성별 수를 불러오는 중 error:", error);
            }
        };

        //나이대 별 인기상품
        const fetchAge = async () => {
            try {
                const response = await axios.get(`/adminStore/getAgeDistribution?storeNo=${storeNo}`);
                setAgeDistribution(response.data);
            } catch (error) {
                console.error("나이 별 top1 불러오는 중 error: ", error);
            }
        };


        const fetchMonthlySales = async () => {
            try {
                // 서버에서 월별 매출 데이터를 가져옵니다.
                const response = await axios.get(`/adminReservation/priceMonth/${storeNo}`);
                console.log(response.data);
                setSalesData(response.data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            } finally {
                // setLoading(false);
            }
        };

        const fetchMonthlySales2 = async () => {
            try {
                // 서버에서 일별 매출 데이터를 가져옵니다.
                const response = await axios.get(`/adminReservation/priceDay/${storeNo}`);
                console.log(response.data);
                setSalesData2(response.data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            } finally {
                // setLoading(false);
            }
        };

        fetchMonthlySales();
        fetchMonthlySales2();
        fetchGender();
        fetchAge();

    }, [storeNo]);

    console.log("ageDistribution: ", ageDistribution);

    const [selectedPeriod, setSelectedPeriod] = useState("이번달");
    const [selectedPricePeriod, setSelectedPricePeriod] = useState("이번달");

    const handlePeriodChange = (newPeriod) => {
        setSelectedPeriod(newPeriod);
    };

    const handlePricePeriodChange = (newPeriod) => {
        setSelectedPricePeriod(newPeriod);
    };

    const [salesData, setSalesData] = useState([]);
    const [salesData2, setSalesData2] = useState([]);
 

 // 상태 변수를 사용하여 현재 선택된 테이블을 관리
   // 상태 변수를 사용하여 현재 선택된 테이블을 관리
   const [viewMode, setViewMode] = useState('monthly');  // 'monthly' 또는 'daily'

   // 월별 매출 테이블을 보여주는 버튼 클릭 시
   const showMonthlySales = () => {
       setViewMode('monthly');
   };

   // 일별 매출 테이블을 보여주는 버튼 클릭 시
   const showDailySales = () => {
       setViewMode('daily');
   };

    console.log("월별 매출 정보 ", salesData);
    console.log("일별 매출 정보 ", salesData2);

    return (
        <div className="admin-store-report-container">
            <div className="store-report">
                <div className="flex-left">

                    <div className="report-section">
                        <h2>매출 통계</h2>
                        <div className="reservation-graph">
                            <div className="graph-filter monthly">
                                <span className={selectedPricePeriod === "올해" ? 'active' : ''}
                                    onClick={() => handlePricePeriodChange("올해")}>올 해</span>
                                <span className={selectedPricePeriod === "이번달" ? 'active' : ''}
                                    onClick={() => handlePricePeriodChange("이번달")}>이번 달</span>
                            </div>
                            <div className="graph">
                                <MonthlySalesBarChart period={selectedPricePeriod}/>
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
                                        <MwChart />
                                    </div>
                                </div>


                                <div className="customer age">
                                    <h3>나이</h3>
                                    <div>
                                        <AgeChart data={ageDistribution} />
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


                <div className="flex-right">
                 
                    <div className="report-section">
                        <h2>주문 통계</h2>
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

                    <div className='report-section'>



                    <div>
            {/* 일별 / 월별 전환 버튼 */}
           

            {/* 월별 매출 테이블 */}
            {viewMode === 'monthly' && (
                <div className="table-container">
                    <div className='month-day'>
                    <h2>월별 매출</h2>
                    <div className="toggle-buttons">
                        <button onClick={showMonthlySales} className={viewMode === 'monthly' ? 'active' : ''}>
                            월별
                        </button>
                        <button onClick={showDailySales} className={viewMode === 'daily' ? 'active' : ''}>
                            일별
                        </button>
                    </div>
                        </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>년도</th>
                                <th>월</th>
                                <th>총 매출</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.year}</td>
                                    <td>{item.month}</td>
                                    <td>{item.totalSales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 일별 매출 테이블 */}
            {viewMode === 'daily' && (
                <div className="table-container">
                    <h2>일별 매출</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>년도</th>
                                <th>월</th>
                                <th>일</th>
                                <th>총 매출</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData2.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.year}</td>
                                    <td>{item.month}</td>
                                    <td>{item.day}</td>
                                    <td>{item.totalSales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

                    </div>
                </div>



             
            </div>

       

 
        </div>
    )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminStoreReport />
);
