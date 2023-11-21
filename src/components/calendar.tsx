import dayjs from 'dayjs';
import locale from 'dayjs/locale/en';
import isTodayPlugin from 'dayjs/plugin/isToday';
import objectPlugin from 'dayjs/plugin/toObject';
import weekdayPlugin from 'dayjs/plugin/weekday';
import { useEffect, useState } from 'react';
import './calendar.css';

const Calendar = () => {
  const now = dayjs().locale({
    ...locale,
  });
  dayjs.extend(weekdayPlugin);
  dayjs.extend(objectPlugin);
  dayjs.extend(isTodayPlugin);

  const [currentMonth, setCurrentMonth] = useState(now);
  const [arrayOfDays, setArrayOfDays] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(Number);
  const nextMonth = () => {
    const plus = currentMonth.add(1, 'month');

    setCurrentMonth(plus);
  };

  const prevMonth = () => {
    const minus = currentMonth.subtract(1, 'month');

    setCurrentMonth(minus);
  };

  const nextWeek = () => {
    if (currentWeek !== 5) {
      const plus = currentWeek + 1;

      setCurrentWeek(plus);
    }
  };

  const prevWeek = () => {
    if (currentWeek !== 1) {
      const minus = currentWeek - 1;

      setCurrentWeek(minus);
    }
  };

  const renderHeader = () => {
    const dateFormat = 'MMMM YYYY';

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => prevMonth()}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{currentMonth.format(dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={() => nextMonth()}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  };
  const renderFooter = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => prevWeek()}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{currentWeek}</span>
        </div>
        <div className="col col-end" onClick={() => nextWeek()}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'dddd';
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {now.weekday(i).format(dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  const getAllDays = () => {
    let currentDate = currentMonth.startOf('month').weekday(0);
    const nextMonth = currentMonth.add(1, 'month').month();
    const allDates = [];
    let weekDates = [];
    let weekCounter = 1;
    while (currentDate.weekday(0).toObject().months !== nextMonth) {
      const formated = formateDateObject(currentDate);

      weekDates.push(formated);

      if (weekCounter === 7) {
        allDates.push({ dates: weekDates });
        weekDates = [];
        weekCounter = 0;
      }

      weekCounter++;

      currentDate = currentDate.add(1, 'day');
    }

    setArrayOfDays(allDates);
  };

  useEffect(() => {
    getAllDays();
  }, [currentMonth]);

  useEffect(() => {
    arrayOfDays.some((week, i) => {
      // console.log(week)
      week.dates.some((d) => {
        if (d.isCurrentDay) setCurrentWeek(i + 1);
      });
    });
  }, [arrayOfDays]);

  const renderCells = () => {
    const rows = [];
    let days = [];

    arrayOfDays.forEach((week, index) => {
      week.dates.forEach((d, i) => {
        days.push(
          <div
            className={`col cell ${!d.isCurrentMonth ? 'disabled' : d.isCurrentDay ? 'selected' : ''
              }`}
            key={i}
          >
            <span className="number">{d.day}</span>
            <span className="bg">{d.day}</span>
          </div>
        );
      });
      rows.push(
        <div
          className={`row ${currentWeek - 1 === index ? '' : 'invisible'
            } ${index}`}
          key={index}
        >
          {days}
        </div>
      );
      days = [];
    });

    return <div className="body">{rows}</div>;
  };

  const formateDateObject = (date) => {
    const clonedObject = { ...date.toObject() };

    const formatedObject = {
      day: clonedObject.date,
      month: clonedObject.months,
      year: clonedObject.years,
      isCurrentMonth: clonedObject.months === currentMonth.month(),
      isCurrentDay: date.isToday(),
    };

    return formatedObject;
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderFooter()}
    </div>
  );
};

export default Calendar;
