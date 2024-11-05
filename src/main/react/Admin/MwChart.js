// src/PieChart.js

import React, { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2'; // Chart.js에서 Pie 차트를 가져옵니다.
import { Chart, registerables } from 'chart.js';

// Chart.js의 기본 구성 요소를 등록합니다.
Chart.register(...registerables);

function MwChart() {
    const storeNo = sessionStorage.getItem('storeNo');

    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: '인원 수',
            data: [], // 데이터를 동적으로 설정할 예정입니다.
            backgroundColor: ['#36A2EB', '#FF6384'], // 색상
            borderColor: '#fff', // 테두리 색상
            borderWidth: 1, // 테두리 두께
        }],
    });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // 데이터를 가져올 API 엔드포인트를 호출합니다
                const response = await fetch(`/adminStore/getGenderCount?storeNo=${storeNo}`);
                const data = await response.json(); // JSON으로 변환

                const { females, males } = data; // 올바른 데이터 구조에서 추출

                // 예: data = { males: 150, females: 200 };
                setChartData({
                    labels: ['남자', '여자'], // 레이블
                    datasets: [{
                        ...chartData.datasets[0],
                        data: [males, females], // API 응답에서 데이터 설정
                    }],
                });
            } catch (error) {
                console.error("고객성별을 불러오는 중 error: ", error);
            }
        };

        fetchChartData();

        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 의존성 배열이 비어 있으므로 컴포넌트가 처음 마운트될 때만 호출됩니다.

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);
                        const percentage = ((value/total) * 100).toFixed(1);
                        return `${label}: ${percentage}%`;
                    },
                },
            },
        },
    };

    return <Pie ref={chartRef} data={chartData} options={options} />;
};

export default MwChart;
