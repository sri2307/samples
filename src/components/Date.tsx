import { useEffect, useState } from "react";
import "./Date.css";

interface DateObject {
  date: Date;
  isCurrentMonth: boolean;
}

interface CDateProps {
    initialDate?: Date |null; // Optional initial selected date
    disabled?: boolean; // Option to disable the whole calendar
    minDate?: Date; //  Optional minimum selectable date
    maxDate?: Date; //  Optional maximum selectable date
    onDateChange?: (date: Date) => void; // Optional callback when date changes
    frequency?: string; 
  }
  

const CDate = ({ 
    initialDate, 
    disabled = false,  // Default to enabled
    minDate, 
    maxDate,
    onDateChange 
  }: CDateProps) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Assuming 'date-picker' or other identifier is on your dropdown container 
      if (toggle && !event.target.closest('.date-picker')) { 
         setToggle(false);
      } 
    };
  
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setToggle(false);
      }
    };
  
    // Add listeners when dropdown is open
    if (toggle) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscKey);
    }
  
   // Cleanup function to remove listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [toggle]);
  

  useEffect(() => { 
    setSelectedDate(initialDate || null);
  }, [initialDate]); 
  

  const generateDatesForMonth = (date: Date) => {
    const dates = [];

    // Get starting blank days (previous month's dates)
    const prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0);
    const prevMonthDays = prevMonthLastDate.getDate();

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
      dates.push(new Date(date.getFullYear(), date.getMonth() - 1, i));
    }

    // Get days of current month
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    // Get ending blank days (next month's dates)
    let i = dates.length;
    let daysToAdd = 1;
    while (i % 7 !== 0) {
      dates.push(new Date(date.getFullYear(), date.getMonth() + 1, daysToAdd));
      i++;
      daysToAdd++;
    }

    return dates.map((d) => ({
      date: d,
      isCurrentMonth: d.getMonth() === date.getMonth(),
    }));
  };

  const handleDateClick = (dateObject: DateObject) => {
    if (dateObject.isCurrentMonth && !disabled) { 
      if ((!minDate || dateObject.date >= minDate) && 
          (!maxDate || dateObject.date <= maxDate) &&
          (selectedDate ? dateObject.date > selectedDate : true)) { // Check against selectedDate
        if (onDateChange) {
          onDateChange(dateObject.date); 
          setSelectedDate(dateObject.date)
          setToggle(false)
        }
      }
    }
  };


  return (
    <div className="date-picker">
      <button
        className="date-field"
        onClick={() => setToggle((state) => !state)}
      >
        <span>
          {selectedDate ? selectedDate.toLocaleDateString() : "Select a Date"}
        </span>
        {toggle ? (
          <span className="icon">&and;</span>
        ) : (
          <span className="icon">&or;</span>
        )}
      </button>

      {toggle && (
        <section className="dates-container">
          <header>
            <button
              onClick={() =>
                setCurrentDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                )
              }
            >
              &lt;
            </button>
            <span>
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() =>
                setCurrentDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                )
              }
            >
              &gt;
            </button>
          </header>

          <main>
            <div className="day-headings">
              {dayNames.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="dates">
              {generateDatesForMonth(currentDate).map((dateObject) => (
                <div
                key={dateObject.date.toString() || Math.random()}
                className={`
                  ${dateObject.isCurrentMonth ? '' : 'disabled other-month'} 
                  ${dateObject.isCurrentMonth && dateObject.date.toDateString() === selectedDate?.toDateString() 
                    ? 'selected' 
                    : ''}
                  ${selectedDate && dateObject.date < selectedDate ? 'pre-selected-disabled' : ''}  `}
                onClick={() => dateObject && handleDateClick(dateObject)}
              >
                {dateObject.date.getDate()}
              </div>
              ))}
            </div>
          </main>
        </section>
      )}
    </div>
  );
};

export default CDate;
