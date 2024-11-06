import React from 'react';

const PrintReservationInfo = ({ reservation }) => {
    const printContainerStyle = {
        width: '210mm', // A4 가로 크기
        height: '297mm', // A4 세로 크기
        padding: '20mm', // 여백 설정
        border: '1px solid #ddd',
        backgroundColor: 'white',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box'
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '10px'
    };

    const smallTextStyle = {
        fontSize: '14px',
        color: '#777',
        textAlign: 'center'
    };

    const reservationInfoStyle = {
        marginTop: '30px'
    };

    const infoItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '16px'
    };

    const labelStyle = {
        fontWeight: 'bold',
        color: '#333'
    };

    const valueStyle = {
        color: '#555',
        textAlign: 'right'
    };

    const footerStyle = {
        marginTop: '20px',
        textAlign: 'center'
    };

    return (
        <div style={printContainerStyle}>
            <div style={headerStyle}>
                <h1>예약 정보</h1>
                <p style={smallTextStyle}>고객님의 예약 내용을 확인하세요.</p>
            </div>
            <div style={reservationInfoStyle}>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>예약 번호:</span>
                    <span style={valueStyle}>{reservation.reservationNo}</span>
                </div>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>서비스 이름:</span>
                    <span style={valueStyle}>{reservation.serviceName}</span>
                </div>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>사용자 ID:</span>
                    <span style={valueStyle}>{reservation.userId}</span>
                </div>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>등록 시간:</span>
                    <span style={valueStyle}>{reservation.regTime}</span>
                </div>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>예약 가격:</span>
                    <span style={valueStyle}>{reservation.reservationPrice} 원</span>
                </div>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>고객 요청:</span>
                    <span style={valueStyle}>{reservation.customerRequest}</span>
                </div>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>예약 상태:</span>
                    <span style={valueStyle}>{reservation.reservationStatus}</span>
                </div>
            </div>
            <div style={footerStyle}>
                <p style={smallTextStyle}>감사</p>
            </div>
        </div>
    );
};

export default PrintReservationInfo;
