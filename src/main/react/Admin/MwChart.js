// src/PieChart.js

import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2'; // Chart.js에서 Pie 차트를 가져옵니다.
import { Chart, registerables } from 'chart.js';

// Chart.js의 기본 구성 요소를 등록합니다.
Chart.register(...registerables);

function MwChart(){

    const chartRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 데이터 설정
    const data = {
        labels: ['남자', '여자'], // 레이블
        datasets: [
            {
                label: '인원 수',
                data: [150, 200], // 데이터 (남자, 여자)
                backgroundColor: ['#36A2EB', '#FF6384'], // 색상
                borderColor: '#fff', // 테두리 색상
                borderWidth: 1, // 테두리 두께
            },
        ],
    };

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
                        return `${label}: ${value}명`;
                    },
                },
            },
        },
    };

    return <Pie ref={chartRef} data={data} options={options} />;
};

export default MwChart;
