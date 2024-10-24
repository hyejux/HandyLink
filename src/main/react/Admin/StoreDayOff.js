import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './StoreDayOff.css';

function StoreDayOff() {
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');

    const [dayOffDayList, setDayOffDayList] = useState([]);
    const [dayOffSet, setDayOffSet] = useState({
        dayOffStart: null,
        dayOffEnd: null,
    });
    const [dayOffSetList, setDayOffSetList] = useState([]);

    const [selectingStart, setSelectingStart] = useState(true); // Start date selection mode

    // Function to handle fixed day off checkboxes
    const handleChangeDayOff = (e) => {
        const { value, checked } = e.target;
        setDayOffDayList(prev =>
        checked ? [...prev, value] : prev.filter(day => day !== value)
        );
    };

    // Handle selecting dates on the calendar
    const handleCalendarChange = (date) => {
        if (selectingStart) {
            setDayOffSet(prev => ({
                ...prev,
                dayOffStart: date,
                dayOffEnd: null, // Reset end date when start is chosen
            }));
            setSelectingStart(false); // Switch to end date selection
        } else {
            setDayOffSet(prev => ({
                ...prev,
                dayOffEnd: date,
            }));
            setSelectingStart(true); // Switch back to start date selection
        }
    };

    const handleAddList = () => {
        const { dayOffStart, dayOffEnd } = dayOffSet;

        if (dayOffStart && dayOffEnd) {
            setDayOffSetList(prevList => [...prevList, { dayOffStart, dayOffEnd }]);

            // Reset dayOffSet state after adding
            setDayOffSet({
                dayOffStart: null,
                dayOffEnd: null,
            });
        } else {
            alert('기간을 완전히 선택해 주세요.');
        }
    };

    const handleDeleteList = (index) => {
        const updatedList = dayOffSetList.filter((_, idx) => idx !== index);
        setDayOffSetList(updatedList);
    };

    const handleRegistDay = async () => {
        try {
            const dayOffDayObjects = dayOffDayList.map(day => ({
                dayOffDay: day,
                dayOffFixStatus: 'Y',
                storeId,
                storeNo,
            }));

            await axios.post('/adminStore/updateDay', {
                storeId,
                storeNo,
                dayOffDayList: dayOffDayObjects,
            });
            console.log("고정휴무등록성공");
        } catch (error) {
            console.log("고정휴무등록 중 error ", error);
        }
    };

    const handleRegistSet = async () => {
        try {
            await axios.post('/adminStore/registDayOffSet', {
                dayOffSetList: dayOffSetList.map(day => ({
                    dayOffStart: day.dayOffStart,
                    dayOffEnd: day.dayOffEnd,
                    storeId,
                    storeNo,
                })),
            });
            console.log("지정휴무등록성공");
        } catch (error) {
            console.log("지정휴무등록 중 error ", error);
        }
    };

    // Function to highlight selected date range
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const { dayOffStart, dayOffEnd } = dayOffSet;
            if (dayOffStart && dayOffEnd && date >= dayOffStart && date <= dayOffEnd) {
                return 'highlight';
            }
        }
        return null;
    };

    return (
    <div className="store-day-off-container">
        <div className="day-off fix">
            <label>고정휴무</label>
            {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'].map(day => (
                <div key={day}>
                    <label>
                        <input type="checkbox" name="dayOffDay" value={day} onChange={handleChangeDayOff} /> {day}
                    </label>
                </div>
            ))}
            <button type="button" className="day-off-btn" onClick={handleRegistDay}>
            고정휴무등록
            </button>
        </div>

        <div className="day-off set">
            <label>지정휴무</label>
            <div className="calendar-wrapper">
                <Calendar
                    onChange={handleCalendarChange}
                    tileClassName={tileClassName} // Apply the date highlight logic
                    selectRange={false} // Single date selection, manual range via state
                />
            </div>
            <button type="button" className="day-off add" onClick={handleAddList}>
                추가
            </button>
        </div>

        <div className="day-off-list">
            <h3>휴무 등록하기</h3>
            <ul>
                {dayOffSetList.map((dayOff, index) => (
                    <li key={index}>
                        {dayOff.dayOffStart?.toLocaleDateString()} ~ {dayOff.dayOffEnd?.toLocaleDateString()}
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
);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StoreDayOff />);
