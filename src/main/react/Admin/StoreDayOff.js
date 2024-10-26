import React, { useState, useEffect } from 'react';
import { formatISO } from 'date-fns';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './StoreDayOff.css';

function StoreDayOff() {
    const storeId = sessionStorage.getItem('storeId');
    const storeNo = sessionStorage.getItem('storeNo');

    //고정휴무
    const [dayOffDayList, setDayOffDayList] = useState([]); //고정휴무 저장하기
    const [offDay, setOffDay] = useState([]); //고정휴무 불러오기

    //지정휴무
    const [dayOffSet, setDayOffSet] = useState({ //추가리스트에 담기 위한
        dayOffStart: null,
        dayOffEnd: null,
    });
    const [dayOffSetList, setDayOffSetList] = useState([]); //지정휴무 추가
    const [offSet, setOffSet] = useState({ // 지정휴무 불러오기
        setNo:'',
        dayOffStart: '',
        dayOffEnd: '',
    });

    const [selectingStart, setSelectingStart] = useState(true); // Start date selection mode

    useEffect(() => {
        const fetchDay = async () => {
            try {
                const respDay = await axios.get(`/adminStore/getOffDay?storeNo=${storeNo}`);
                setOffDay(respDay.data);

                const respSet = await axios.get(`/adminStore/getOffSet?storeNo=${storeNo}`);
                setOffSet(respSet.data);
            } catch (error) {
                console.log("휴무 부르는 중 error", error);
            }
        }
        fetchDay();
    }, []);



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
            const start = dayOffStart.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            const end = dayOffEnd.toISOString().split('T')[0]; // Format as YYYY-MM-DD

            setDayOffSetList(prevList => [...prevList, { dayOffStart: start, dayOffEnd: end }]);

            // Reset dayOffSet state after adding
            setDayOffSet({
                dayOffStart: null,
                dayOffEnd: null,
            });
        } else {
            alert('기간을 완전히 선택해 주세요.');
        }
    };

    const handleDeleteList = (index) => {//선택한 지정휴무 삭제
        const updatedList = dayOffSetList.filter((_, idx) => idx !== index);
        setDayOffSetList(updatedList);
    };

    const handleDeleteSetList = (index) => {//지정된 지정휴무 삭제
        // Confirm deletion
        const confirmDelete = window.confirm("해당 지정 휴무일을 삭제하시겠습니까?");

        if (confirmDelete) {
            const setNoToDelete = offSet[index].setNo;



            const fetchSetList = async () => {
                try {
                    const resp = await axios.delete(`/adminStore/deleteOffSet?storeNo=${storeNo}&setNo=${setNoToDelete}`);

                    if (resp.data){
                        console.log("삭제 성공");

                        const updatedSetList = offSet.filter((_, idx) => idx !== index);
                        setOffSet(updatedSetList);

                    } else {
                        alert('삭제 실패');
                    }
                } catch (error) {
                    console.log("지정휴무 삭제 중 error ", error);
                }
            }

            fetchSetList(); // Call the function to delete the entry
        } else {
            // User clicked 'No', do nothing
            console.log("Deletion cancelled");
        }
    }


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
            window.location.href="/storedayoff.admin";
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
            window.location.href="/storedayoff.admin";
        } catch (error) {
            console.log("지정휴무등록 중 error ", error);
        }
    };

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
            {offDay.length > 0 && offDay.some(offday => offday) ? (
                offDay.map(offday =>(
                        <div key={offday}>
                            {offday}
                        </div>
                    )
                )
            ) : (
                <div>고정된 휴무일 없음</div>
            )}

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
            <div className="day-off-set-list">
                <label>지정휴무 목록</label>
                {offSet.length > 0 ? (
                    offSet.map((offSet, index) => (
                        <div key={index}>
                            {offSet.dayOffStart} ~ {offSet.dayOffEnd}
                            <button type="button" onClick={() => handleDeleteSetList(index)}>
                                삭제
                            </button>
                        </div>
                    ))
                    ) : <div>지정된 휴무일 없음</div>
                }
            </div>

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
                        {new Date(dayOff.dayOffStart)?.toLocaleDateString()} ~ {new Date(dayOff.dayOffEnd)?.toLocaleDateString()}
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
