import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './StoreDayOff.css';

function StoreDayOff(){
    // 세션 스토리지에서 storeId 가져오기
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');
    console.log("세션 storeId: ", storeId);
    console.log("세션 storeNo: ", storeNo);

    const [dayOffFixList, setDayOffFixList] = useState({
        dayOffType:'고정',
        dayOffFixStatus:'',
        dayOffFix:[]
    });

    const [dayOffSetList, setDayOffSetList] = useState([]);

    const [dayOffSet, setDayOffSet] = useState({
        dayOffType:'지정',
        //        dayOffFix:[],
        dayOffStart:'',
        dayOffEnd:''
    });

    // 고정
    const handleChangeDayOff = (e) => {
        const { value, checked } = e.target;
        setDayOffFixList(prev => ({
            ...prev,
            dayOffFix: checked
            ? [...prev.dayOffFix, value]  // Add day if checked
            : prev.dayOffFix.filter(day => day !== value) // Remove if unchecked
        }));
    };

    const handleSetChange = (e) => {
        const {name, value} = e.target;
        setDayOffSet( prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 지정 - 리스트 추가
    const handleAddList = () => {
        const { dayOffStart, dayOffEnd } = dayOffSet;

        // 시작일과 종료일이 유효하면 리스트에 추가
        if (dayOffStart && dayOffEnd) {
            setDayOffSetList(prevList => [...prevList, { dayOffStart, dayOffEnd }]);

            // 날짜 추가 후, 입력 필드 초기화
            setDayOffSet({
                dayOffStart: '',
                dayOffEnd: ''
            });
        } else {
            alert('날짜를 선택해 주세요.');
        }
    };

    console.log("고정휴무 ", dayOffFixList);
    console.log("지정휴무 ", dayOffSetList)

    return(

        <div className="store-day-off-container">
            <div className="day-off fix">
                <label htmlFor="">고정휴무</label>
                <div className="day-off-day">
                    <label htmlFor="mon"><input type="checkbox" name="dayOffFix" id="mon" value="월요일" onChange={handleChangeDayOff}/> 월요일</label>
                    <label htmlFor="tue"><input type="checkbox" name="dayOffFix" id="tue" value="화요일" onChange={handleChangeDayOff} /> 화요일</label>
                    <label htmlFor="wed"><input type="checkbox" name="dayOffFix" id="wed" value="수요일" onChange={handleChangeDayOff} /> 수요일</label>
                    <label htmlFor="thu"><input type="checkbox" name="dayOffFix" id="thu" value="목요일" onChange={handleChangeDayOff} /> 목요일</label>
                    <label htmlFor="fri"><input type="checkbox" name="dayOffFix" id="fri" value="금요일" onChange={handleChangeDayOff} /> 금요일</label>
                    <label htmlFor="sat"><input type="checkbox" name="dayOffFix" id="sat" value="토요일" onChange={handleChangeDayOff} /> 토요일</label>
                    <label htmlFor="sun"><input type="checkbox" name="dayOffFix" id="sun" value="일요일" onChange={handleChangeDayOff} /> 일요일</label>
                </div>
            </div>

            <div className="day-off set">
                <label htmlFor="">지정휴무</label>
                <div className="day-off-period">
                    <label htmlFor="dayOffStart"><input type="date" name="dayOffStart" value={dayOffSet.dayOffStart} onChange={handleChangeDayOff}/></label>
                    <label htmlFor="dayOffEnd"><input type="date" name="dayOffEnd" value={dayOffSet.dayOffEnd} onChange={handleChangeDayOff}/></label>
                </div>
                <button type="button" className="day-off add" onClick={handleAddList}>
                    추가
                </button>
            </div>


            {/* 추가된 날짜 리스트 렌더링 */}
            <div className="day-off-list">
                <h3>추가된 지정휴무일</h3>
                <ul>
                    {dayOffSetList.map((dayOff, index) => (
                        <li key={index}>
                            {dayOff.dayOffStart} ~ {dayOff.dayOffEnd}
                        </li>
                    ))}
                </ul>
            </div>

        </div>

    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StoreDayOff />
);
