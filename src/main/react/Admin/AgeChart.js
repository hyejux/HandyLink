// src/AgePieChart.js

import React from 'react';
import { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function AgeChart(){
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

    // 임의의 연령대 비율 데이터
    const data = {
        labels: ['10대', '20대', '30대', '40대 이상'],
        datasets: [
            {
                label: '연령대 비율',
                data: [15, 30, 25, 30], // 각 연령대 비율 (임의의 값)
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderColor: '#fff',
                borderWidth: 1,
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
                    label: (tooltipItem) => {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        return `${label}: ${value}%`;
                    },
                },
            },
        },
    };

    return <Pie ref={chartRef} data={data} options={options} />;
};

export default AgeChart;
