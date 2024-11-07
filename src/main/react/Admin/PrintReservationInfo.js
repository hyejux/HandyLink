import React from 'react';

const PrintReservationInfo = ({ reservation }) => {
    const containerStyle = {
        width: '210mm',
        height: '297mm',
        padding: '20mm',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        fontFamily: "'Noto Sans KR', sans-serif",
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '10px',
        color: '#333',
    };

    const reservationNumberStyle = {
        fontSize: '20px',
        color: '#777',
    };

    const infoContainerStyle = {
        marginTop: '30px',
    };

    const infoItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        fontSize: '16px',
    };

    const labelStyle = {
        color: '#777',
    };

    const valueStyle = {
        color: '#000',
        textAlign: 'right',
        fontSize: '20px',
    };

    const footerStyle = {
        marginTop: '30px',
        textAlign: 'left',
        fontSize: '12px',
        color: '#777',
    };

    const hrStyle = {
        border: 'none',
        height: '5px',
        backgroundColor: '#F5F5F5',
        margin: '30px 0',
    };

    const hrStyle2 = {
        border: 'none',
        height: '2px',
        background: 'linear-gradient(to right, #000 0%, #333 50%, #000 100%)',
        marginTop: '50px',
        marginBottom: '10px',
    };

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours() + 9).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1>예약 정보</h1>
                <p style={reservationNumberStyle}>{reservation.reservationNo} ({reservation.reservationStatus})</p>
            </div>

            <hr style={hrStyle} />

            <div style={infoContainerStyle}>
                <div style={infoItemStyle}>
                    <span style={labelStyle}>예약일시</span>
                    <span style={valueStyle}>{formatDate(reservation.regTime)}</span>
                </div>

                <div style={infoItemStyle}>
                    <span style={labelStyle}>픽업시간</span>
                    <span style={valueStyle}>{reservation.reservationSlotDate} {reservation.reservationTime}</span>
                </div>

                <hr style={hrStyle} />

                <div style={infoItemStyle}>
                    <span style={labelStyle}>서비스이름</span>
                    <span style={valueStyle}>{reservation.serviceName}</span>
                </div>

                <div style={infoItemStyle}>
                    <span style={labelStyle}>사용자ID</span>
                    <span style={valueStyle}>{reservation.userId}</span>
                </div>

                <hr style={hrStyle} />

                <div style={infoItemStyle}>
                    <span style={labelStyle}>고객요청</span>
                    <span style={valueStyle}>{reservation.customerRequest || '요청사항 없음'}</span>
                </div>

                <div style={infoItemStyle}>
                    <span style={labelStyle}>예약가격</span>
                    <span style={valueStyle}>{reservation.reservationPrice} 원</span>
                </div>

            </div>

            <hr style={hrStyle} />

            {/* 영수증 느낌을 주는 구간 */}
            <div style={footerStyle}>
                <p>HadnyLink는 업체를 응원합니다.</p>
                <p>HadnyLink는 어쩌고 어쩌고 어쩌고</p>
            </div>

            <hr style={hrStyle2} />
        </div>
    );
};

export default PrintReservationInfo;
