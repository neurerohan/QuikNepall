import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar } from '@/lib/api';

interface Day {
  bs: {
    year: number;
    month: number;
    day: number;
  };
  ad: {
    year: number;
    month: number;
    day: number;
    monthName: string;
  };
  isHoliday: boolean;
  events: string[];
}

interface CalendarData {
  days: Day[];
  monthDetails: {
    bs: {
      monthName: string;
      year: number;
      month: number;
    };
    ad: {
      monthName: string;
      year: number;
      month: number;
    };
  };
}

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CalendarWidget = () => {
  // Get current date
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [currentMonth, setCurrentMonth] = useState((new Date().getMonth() + 1).toString());
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/calendar/${currentYear}/${currentMonth}`],
    enabled: !!currentYear && !!currentMonth
  });

  const handlePreviousMonth = () => {
    if (parseInt(currentMonth) === 1) {
      setCurrentMonth('12');
      setCurrentYear((parseInt(currentYear) - 1).toString());
    } else {
      setCurrentMonth((parseInt(currentMonth) - 1).toString());
    }
  };

  const handleNextMonth = () => {
    if (parseInt(currentMonth) === 12) {
      setCurrentMonth('1');
      setCurrentYear((parseInt(currentYear) + 1).toString());
    } else {
      setCurrentMonth((parseInt(currentMonth) + 1).toString());
    }
  };

  // Placeholder for empty calendar days (will be filled with data from API)
  const calendarDays = Array(35).fill(null);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-primary p-4 flex justify-between items-center">
        <button 
          aria-label="Previous Month" 
          className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
          onClick={handlePreviousMonth}
        >
          <i className="ri-arrow-left-s-line text-xl"></i>
        </button>
        <h2 className="text-xl font-semibold text-white font-montserrat">
          {isLoading ? 'Loading...' : error ? 'Error loading calendar' : 
            `${data?.monthDetails?.bs?.monthName} ${data?.monthDetails?.bs?.year} | ${data?.monthDetails?.ad?.monthName} ${data?.monthDetails?.ad?.year}`}
        </h2>
        <button 
          aria-label="Next Month" 
          className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
          onClick={handleNextMonth}
        >
          <i className="ri-arrow-right-s-line text-xl"></i>
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {weekdays.map((day, index) => (
            <div key={index} className="text-center font-medium text-neutral py-2">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {isLoading ? (
            // Loading skeleton
            Array(35).fill(null).map((_, i) => (
              <div key={i} className="relative aspect-square border border-gray-100 rounded bg-gray-50 animate-pulse"></div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-7 text-center py-8 text-red-500">
              Failed to load calendar data
            </div>
          ) : (
            data?.days?.map((day, index) => {
              const isToday = day?.bs.year === today.getFullYear() && 
                             day?.bs.month === (today.getMonth() + 1) && 
                             day?.bs.day === today.getDate();
              
              return (
                <div 
                  key={index}
                  className={`relative aspect-square border border-gray-100 rounded ${
                    isToday ? 'bg-primary-light/10 hover:bg-primary-light/20' : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-xs ${isToday ? 'text-primary-dark font-medium' : 'text-gray-500'} p-1`}>
                      {day?.bs.day}
                    </div>
                    <div className={`text-sm ${isToday ? 'text-primary font-medium' : ''} p-1`}>
                      {day?.ad.day}
                    </div>
                  </div>
                  {day?.events?.length > 0 && (
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
