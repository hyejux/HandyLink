import React, { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function AgeChart() {
    const storeNo = sessionStorage.getItem('storeNo');

    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '연령대 비율',
                data: [], // 데이터를 동적으로 설정
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const fetchAgeDistribution = async () => {
            try {
                const response = await fetch(`/adminStore/getAgeDistribution?storeNo=${storeNo}`); // API 호출
                const data = await response.json(); // JSON 변환

                // 예: data = { labels: ['10대', '20대', '30대', '40대 이상'], values: [15, 30, 25, 30] }
                setChartData({
                    labels: data.labels, // API 응답에서 레이블 설정
                    datasets: [{
                        ...chartData.datasets[0],
                        data: data.values, // API 응답에서 데이터 설정
                    }],
                });
            } catch (error) {
                console.error("연령대 비율을 불러오는 중 오류 발생:", error);
            }
        };

        fetchAgeDistribution();

        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [storeNo]); // 의존성 배열이 비어 있으므로 컴포넌트가 처음 마운트될 때만 호출됩니다.

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

export default AgeChart;
