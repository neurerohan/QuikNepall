import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getTodayNepaliDate, getMonthName } from '@/lib/api';
import { Link } from 'wouter';

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CalendarWidget = () => {
  // Fetch today's Nepali date
  const { data: nepaliToday, isLoading: loadingNepaliToday } = useQuery({
    queryKey: ['/api/today'],
    queryFn: getTodayNepaliDate,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // State to track current month/year being displayed
  const [currentYear, setCurrentYear] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<string>("");
  
  // Initialize with today's Nepali date once we have it
  useEffect(() => {
    if (nepaliToday) {
      setCurrentYear(nepaliToday.year.toString());
      setCurrentMonth(nepaliToday.month.toString());
    }
  }, [nepaliToday]);

  // Fetch calendar data
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar/${currentYear}/${currentMonth}`],
    queryFn: () => getCalendar(currentYear, currentMonth),
    enabled: !!currentYear && !!currentMonth, // Only run query when we have both values
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
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

  // Check if a date is today
  const isToday = (bsDay: number, bsMonth: number, bsYear: number) => {
    if (nepaliToday) {
      return nepaliToday.year === bsYear && 
             nepaliToday.month === bsMonth && 
             nepaliToday.day === bsDay;
    }
    return false;
  };

  // Check if we need to show loading state
  const showLoading = isLoading || loadingNepaliToday || !currentYear || !currentMonth;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="bg-primary p-4 flex justify-between items-center">
        <button 
          aria-label="Previous Month" 
          className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
          onClick={handlePreviousMonth}
          disabled={showLoading}
        >
          <i className="ri-arrow-left-s-line text-xl"></i>
        </button>
        <h2 className="text-xl font-semibold text-white font-montserrat">
          {showLoading ? 'Loading...' : error ? 'Error loading calendar' : 
            `${getMonthName(parseInt(currentMonth))} ${currentYear}`}
        </h2>
        <button 
          aria-label="Next Month" 
          className="text-white hover:bg-primary-dark rounded-full p-2 transition-colors"
          onClick={handleNextMonth}
          disabled={showLoading}
        >
          <i className="ri-arrow-right-s-line text-xl"></i>
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {weekdays.map((day, index) => (
            <div key={index} className={`text-center font-medium py-2 text-xs 
              ${index === 0 ? 'text-red-500' : ''} 
              ${index === 6 ? 'text-green-600' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {showLoading ? (
            // Loading skeleton
            Array(35).fill(null).map((_, i) => (
              <div key={i} className="relative aspect-square border border-gray-100 rounded bg-gray-50 animate-pulse"></div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-7 text-center py-8 text-red-500 text-sm">
              Failed to load calendar
            </div>
          ) : (
            <>
              {/* First, create empty cells for proper alignment */}
              {data?.days && data?.days[0]?.dayOfWeek && Array(data.days[0].dayOfWeek).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              
              {/* Then render all day cells */}
              {data?.days?.map((day: any, index: number) => {
                // Determine if the day is today
                const isTodayHighlight = isToday(day.bs.day, day.bs.month, day.bs.year);
                // Check if it's a weekend
                const isSunday = day.dayOfWeek === 0;
                const isSaturday = day.dayOfWeek === 6;
                
                return (
                  <div 
                    key={`day-${index}`}
                    className={`aspect-square border border-gray-100 rounded-lg p-1
                      ${day.isHoliday ? 'bg-red-50' : day.events?.length ? 'bg-primary-light/10' : ''}
                      hover:bg-gray-50 transition-all cursor-pointer`}
                  >
                    <div className="flex flex-col h-full items-center justify-center">
                      {/* Nepali date - emphasized */}
                      <div className={`text-base font-bold 
                        ${isSunday ? 'text-red-500' : isSaturday ? 'text-green-600' : 'text-gray-700'} 
                        ${isTodayHighlight ? 'bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}
                      >
                        {day.bs.nepaliDay || day.bs.day}
                      </div>
                      
                      {/* English date - smaller */}
                      <div className="text-[10px] text-gray-500 leading-tight">
                        {day.ad.day}
                      </div>
                      
                      {/* Event indicator */}
                      {day.events?.length > 0 && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* View full calendar link */}
        <div className="mt-4 text-center">
          <Link 
            href={`/nepalicalendar/${currentYear}/${getMonthName(parseInt(currentMonth)).toLowerCase()}`}
            className="text-primary text-sm font-medium hover:underline"
          >
            View Full Calendar →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
