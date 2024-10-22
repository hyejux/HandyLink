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

    const [dayOffDayList, setDayOffDayList] = useState([]);

    const [dayOffSet, setDayOffSet] = useState({
        dayOffType:'지정',
        dayOffStart:'',
        dayOffEnd:''
    });

    const [dayOffSetList, setDayOffSetList] = useState([]);


    // 고정
    const handleChangeDayOff = (e) => {
        const { value, checked } = e.target;
        setDayOffDayList(prev =>
            checked
            ? [...prev, value]  // 체크
            : prev.filter(day => day !== value) // 체크삭제
        );
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
            if (new Date(dayOffStart) > new Date(dayOffEnd)) {
                alert('종료일이 시작일보다 이전일 수 없습니다.');
                return;
            }
            setDayOffSetList(prevList => [...prevList, { dayOffStart, dayOffEnd }]);

            // 날짜 추가 후, 입력 필드 초기화
            setDayOffSet({
                dayOffType: '지정', // 초기값 복원
                dayOffStart: '',
                dayOffEnd: ''
            });
        } else {
            alert('날짜를 선택해 주세요.');
        }
    };

    const handleDeleteList = (index) => {
        const updatedList = dayOffSetList.filter((_, idx) => idx !== index);
        setDayOffSetList(updatedList); // Just update dayOffSetList directly
    };


    console.log("고정휴무 ", dayOffDayList);
    console.log("지정휴무 ", dayOffSetList);

    const handleRegistDay = async() => {
      try{
          const dayOffDayObjects = dayOffDayList.map(day => ({
              dayOffDay: day,
              dayOffType: '고정',
              dayOffFixStatus: 'Y',
              storeId,
              storeNo
          }));

          const resp = await axios.post('/adminStore/updateDay', {
              dayOffDayList: dayOffDayObjects
          });
          console.log("고정휴무등록성공");
      }catch (error){
          console.log("고정휴무등록 중 error ", error);
      }
    };

    const handleRegistSet = async() => {
        try{
            const resp = await axios.post('/adminStore/registDayOffSet', {
                dayOffSetList: dayOffSetList.map(day => ({
                    dayOffStart: day.dayOffStart,
                    dayOffEnd: day.dayOffEnd,
                    storeId,
                    storeNo,
                }))
            });
            console.log("지정휴무등록성공");
        }catch (error){
            console.log("지정휴무등록 중 error ", error);
        }
    };

    return(

        <div className="store-day-off-container">
            <div className="day-off fix">
                <label htmlFor="">고정휴무</label>

                {['월요일','화요일','수요일','목요일','금요일','토요일','일요일'].map(day => (
                    <div key={day}>
                        <label>
                            <input type="checkbox" name="dayOffDay" value={day} onChange={handleChangeDayOff}/> {day}
                        </label>
                    </div>
                ))}

                <button type="button" className="day-off-btn" onClick={handleRegistDay}>
                    고정휴무등록
                </button>
            </div>

            <div className="day-off set">
                <label htmlFor="">지정휴무</label>
                <div className="day-off-period">
                    <label htmlFor="dayOffStart"><input type="date" name="dayOffStart" value={dayOffSet.dayOffStart} onChange={handleSetChange}/></label>
                    <label htmlFor="dayOffEnd"><input type="date" name="dayOffEnd" value={dayOffSet.dayOffEnd} onChange={handleSetChange}/></label>
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

                            <button type="button" onClick={() => handleDeleteList(index)}>
                            삭제
                            </button>
                        </li>

                    ))}
                </ul>
                <button type="button" className="day-off add" onClick={handleRegistSet}>
                    등록하기
                </button>
            </div>



        </div>

    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StoreDayOff />
);
