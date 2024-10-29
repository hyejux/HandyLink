import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2'; // Bar 차트를 가져옵니다.
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function ReservationBarChart() {

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

    const labels = [
        '10 / 01', '10 / 02', '10 / 03', '10 / 04', '10 / 05',
        '10 / 06', '10 / 07', '10 / 08', '10 / 09', '10 / 10',
        '10 / 11', '10 / 12', '10 / 13', '10 / 14', '10 / 15',
        '10 / 16', '10 / 17', '10 / 18', '10 / 19', '10 / 20',
        '10 / 21', '10 / 22', '10 / 23', '10 / 24', '10 / 25'
    ];

    const data = {
        labels: labels,
        datasets: [
            {
                label: '진행된 예약',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
                hoverBorderColor: 'rgba(75, 192, 192, 1)',
                data: [5, 7, 4, 6, 8, 3, 5, 9, 2, 4, 7, 6, 8, 5, 7, 3, 4, 6, 9, 5, 7, 6, 4, 8, 9],
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                bodyColor: '#fff',
                titleColor: '#fff'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '날짜',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#666'
                },
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                }
            },
            y: {
                title: {
                    display: true,
                    text: '건 수',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#666'
                },
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)'
                },
                ticks: {
                    stepSize: 2
                }
            }
        }
    };

    return <Bar ref={chartRef} data={data} options={options} />;
};

export default ReservationBarChart;
