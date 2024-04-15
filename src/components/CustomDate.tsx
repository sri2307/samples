import React, { useState, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {}

interface CustomHeaderProps {
  date: Date;
  decreaseYear: () => void;
  increaseYear: () => void;
}

const App: React.FC<Props> = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [frequency, setFrequency] = useState<string>('');

  const calculateMinEndDate = (): Date | null => {
    if (startDate && frequency) {
      const minEndDate = new Date(startDate);
      if (frequency === 'weekly') {
        minEndDate.setDate(minEndDate.getDate() + 7);
      } else if (frequency === 'monthly') {
        minEndDate.setMonth(minEndDate.getMonth() + 1);
      } else if (frequency === 'quarterly') {
        minEndDate.setMonth(minEndDate.getMonth() + 3);
      } else if (frequency === 'yearly') {
        minEndDate.setFullYear(minEndDate.getFullYear() + 1);
      }
      return minEndDate;
    }
    return null;
  };
  let count=0;

  const filterSelectableDates = useMemo(() => {
    return (date: Date): boolean => {
      if (!startDate || !frequency) return true;

      if (frequency === 'weekly') {
        const dayOfWeek = date.getDay();
        return dayOfWeek === startDate.getDay();
      } else if (frequency === 'monthly') {
        return date.getDate() === startDate.getDate();
      } else if (frequency === 'yearly') {
        console.log(frequency,count)
        count++
        return (
          date.getMonth() === startDate.getMonth() && date.getDate() === startDate.getDate()
        );
      } else if (frequency === 'quarterly') {
        const startQuarter = Math.floor(startDate.getMonth() / 3);
        const endQuarter = Math.floor(date.getMonth() / 3);
        console.log(frequency,count)
        count++
        return startQuarter === endQuarter && date.getFullYear() === startDate.getFullYear();
      }

      return true;
    };
  }, [startDate, frequency]);

  const handleStartDateChange = (date: Date | null): void => {
    setStartDate(date);
    if (date && frequency) {
      const nextEndDate = calculateNextEndDate(date, frequency);
      setEndDate(nextEndDate);
    }
  };

  const calculateNextEndDate = (startDate: Date, frequency: string): Date => {
    const nextEndDate = new Date(startDate);
    if (frequency === 'weekly') {
      nextEndDate.setDate(nextEndDate.getDate() + 7);
    } else if (frequency === 'monthly') {
      nextEndDate.setMonth(nextEndDate.getMonth() + 1);
    } else if (frequency === 'quarterly') {
      nextEndDate.setMonth(nextEndDate.getMonth() + 3);
    } else if (frequency === 'yearly') {
      nextEndDate.setFullYear(nextEndDate.getFullYear() + 1);
    }
    return nextEndDate;
  };

  const CustomHeader: React.FC<CustomHeaderProps> = ({
    date,
    decreaseYear,
    increaseYear,
  }) => {
    return (
      <div className='custom-header'>
        <button onClick={decreaseYear}>&lt;</button>
        <span>{date.toLocaleDateString()}</span>
        <button onClick={increaseYear}>&gt;</button>
      </div>
    );
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
    setStartDate(null); // Reset startDate
    setEndDate(null); // Reset endDate
  };

  return (
    <div>
      <h1>Select Dates</h1>
      <section className='timeline'>
        <div className='group'>
          <label>Frequency:</label>
          <select value={frequency} onChange={(e) => handleFrequencyChange(e)}>
            <option value="">Select Frequency</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className='group'>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="MM/dd/yyyy"
            minDate={new Date()} // Disable past dates
          />
        </div>
        <div className='group'>
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="MM/dd/yyyy"
            minDate={calculateMinEndDate()} // Restrict end date based on frequency
            filterDate={filterSelectableDates} // Only allow frequency dates
            adjustDateOnChange
            renderCustomHeader={
              frequency === 'yearly'
                ? ({ date, decreaseYear, increaseYear }) => (
                    <CustomHeader date={date} decreaseYear={decreaseYear} increaseYear={increaseYear} />
                  )
                : undefined
            }
          />
        </div>
      </section>
    </div>
  );
};

export default App;
