import { useEffect, useState } from 'react';
import './App.css'
import CustomDate from './components/CustomDate';
import CDate from './components/Date';
import DropDown from './components/DropDown';
import { DropDown as IDropDown } from './types/DropDownInterface';

const calculateEndDate = (startDate: Date|null, frequency: string): Date | null => {
  console.log(!startDate || !frequency,!startDate,!frequency)
  // if (!startDate ) return null;

  const endDate = new Date(startDate as Date); 
  switch (frequency) {
    case "weekly":
      endDate.setDate(endDate.getDate() + 7);
      break;
     // ... other cases for monthly, quarterly, etc. 
    default:
      return null;
  }
  return endDate;
}; 

function App() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [frequency, setFrequency] = useState<string>('');
  
  const dropdownData:IDropDown = {
    menu: [
      
    ],
    hasMultiSelect:true
  };

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  }

  const handleEndDateChange = (date: Date) => {

    setEndDate(date);
  }

  useEffect(() => {

    if (startDate && frequency) {
      const newEndDate = calculateEndDate(startDate, frequency);
      console.log(newEndDate)
      setEndDate(newEndDate);
    } else {
      setEndDate(null); // Reset when no start date or frequency 
    } 
  }, [startDate, frequency]); 

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
    setStartDate(null); // Reset startDate
    setEndDate(null); // Reset endDate
  };
  return (
    <>
     <DropDown 
      data={dropdownData}
       
      />
      {/* <CustomDate/> */}
      <div className='timeline'>
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
      <CDate 
  initialDate={startDate?startDate:new Date()} 
  minDate={new Date()} // Disable past dates
  onDateChange={handleStartDateChange} 
/>
      <CDate 
  initialDate={endDate?endDate:calculateEndDate(startDate, frequency)} 
  minDate={startDate?startDate:new Date()} // Disable past dates
  onDateChange={handleEndDateChange} 
  frequency={frequency}

/>
      </div>
      
    </>
  )
}

export default App
