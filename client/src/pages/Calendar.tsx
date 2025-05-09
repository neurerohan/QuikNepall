import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getCalendarEvents, getMonthName } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, useLocation } from 'wouter';
import FadeIn from '@/components/ui/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

// YearEvents component to display events for a specific year
const YearEvents = ({ year }: { year: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar-events?year_bs=${year}`],
    queryFn: () => getCalendarEvents({ year_bs: year }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load events data</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  if (!data || !data.calendar_events || data.calendar_events.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No events found for this year</p>
        <p className="text-sm mt-2">Try selecting a different year</p>
      </div>
    );
  }

  // Group events by month
  const eventsByMonth: Record<string, any[]> = {};
  
  data.calendar_events.forEach((event: any) => {
    const date = event.date_bs || event.date;
    if (!date) return; // Skip if no date
    
    // Extract month from date (assuming format YYYY-MM-DD or DD.MM.YYYY)
    let month: string;
    if (date.includes('-')) {
      // Format: YYYY-MM-DD
      month = date.split('-')[1];
    } else if (date.includes('.')) {
      // Format: DD.MM.YYYY
      month = date.split('.')[1];
    } else {
      return; // Skip if invalid date format
    }
    
    const monthName = getMonthName(parseInt(month));
    
    if (!eventsByMonth[monthName]) {
      eventsByMonth[monthName] = [];
    }
    eventsByMonth[monthName].push(event);
  });

  // Helper to determine event type and color
  const getEventTypeAndColor = (event: any) => {
    const title = (event.title || event.name || '').toLowerCase();
    const type = event.event_type || '';
    
    if (type.includes('holiday') || title.includes('holiday')) {
      return {
        type: 'Public Holiday',
        color: 'bg-red-100 border-red-200 text-red-700'
      };
    }
    
    if (title.includes('festival') || type.includes('festival')) {
      return {
        type: 'Festival',
        color: 'bg-orange-100 border-orange-200 text-orange-700'
      };
    }
    
    if (title.includes('birthday') || type.includes('birthday')) {
      return {
        type: 'Birthday',
        color: 'bg-blue-100 border-blue-200 text-blue-700'
      };
    }
    
    return {
      type: 'Event',
      color: 'bg-green-100 border-green-200 text-green-700'
    };
  };
  
  // Format date nicely
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    
    if (date.includes('-')) {
      const parts = date.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    if (date.includes('.')) {
      return date.replace(/\./g, '-');
    }
    
    return date;
  };

  return (
    <div className="p-6">
      {Object.keys(eventsByMonth).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">No events found for this year</p>
          <p>Try selecting a different year or check back later</p>
        </div>
      ) : (
        Object.keys(eventsByMonth).map((month) => (
          <div key={month} className="mb-8">
            <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">{month}</h3>
            <div className="space-y-4">
              {eventsByMonth[month].map((event, index) => {
                const { type, color } = getEventTypeAndColor(event);
                const bsDate = event.date_bs || '';
                const adDate = event.date_ad || event.date || '';
                
                // Extract day number for display
                let dayNumber = 'N/A';
                if (bsDate.includes('-')) {
                  dayNumber = bsDate.split('-')[2];
                } else if (bsDate.includes('.')) {
                  dayNumber = bsDate.split('.')[0];
                }
                
                return (
                  <div 
                    key={index} 
                    className="border border-gray-100 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-md p-2 text-center min-w-[60px] mr-4">
                        <div className="text-xs uppercase">{getMonthName(parseInt(month))}</div>
                        <div className="text-2xl font-bold">{dayNumber}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{event.title || event.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs py-0.5 px-2 rounded-full ${color}`}>
                            {type}
                          </span>
                          <p className="text-sm text-gray-500">
                            BS: {formatDate(bsDate)} | AD: {formatDate(adDate)}
                          </p>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};



const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarParams {
  year?: string;
  month?: string;
}

const Calendar = () => {
  const [location, setLocation] = useLocation();
  const params = useParams<CalendarParams>();
  
  // If no params are provided, use current date and redirect
  useEffect(() => {
    if (!params.year || !params.month) {
      const today = new Date();
      // Get current Nepali year (roughly AD + 56/57 years)
      const currentNepaliYear = today.getFullYear() + 57;
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
      
      // We'll use the /nepalicalendar path format with month name
      const nepaliMonthName = getMonthName(currentMonth);
      setLocation(`/nepalicalendar/${currentNepaliYear}/${nepaliMonthName.toLowerCase()}`);
    }
  }, [params, setLocation]);
  
  // Helper function to get month number from name
  const getMonthNumberFromName = (monthName: string): number => {
    const nepaliMonths = [
      'baishakh', 'jestha', 'ashadh', 'shrawan', 
      'bhadra', 'ashwin', 'kartik', 'mangsir', 
      'poush', 'magh', 'falgun', 'chaitra'
    ];
    const index = nepaliMonths.findIndex(m => 
      m.toLowerCase() === monthName?.toLowerCase()
    );
    return index !== -1 ? index + 1 : 1;
  };
  
  // Support both numeric month and month name formats
  let year = params.year || new Date().getFullYear().toString();
  let month = params.month || '1';
  
  // Check if month is a string name (like "baishakh") and convert to number
  if (isNaN(parseInt(month))) {
    month = getMonthNumberFromName(month).toString();
  }

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar/${year}/${month}`],
    queryFn: () => getCalendar(year, month),
    enabled: !!year && !!month,
    retry: 1
  });

  const handlePreviousMonth = () => {
    const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
    const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
    const prevMonthName = getMonthName(prevMonth).toLowerCase();
    setLocation(`/nepalicalendar/${prevYear}/${prevMonthName}`);
  };

  const handleNextMonth = () => {
    const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
    const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
    const nextMonthName = getMonthName(nextMonth).toLowerCase();
    setLocation(`/nepalicalendar/${nextYear}/${nextMonthName}`);
  };

  // Get today's date to highlight
  const today = new Date();
  const isToday = (bsDay: number, bsMonth: number, bsYear: number) => {
    return parseInt(year) === bsYear && parseInt(month) === bsMonth && today.getDate() === bsDay;
  };
  
  return (
    <MainLayout 
      title={`Nepali Calendar ${params.year} - ${getMonthName(parseInt(month))}` }
      description="View and navigate through Bikram Sambat (BS) calendar with corresponding Gregorian (AD) dates."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary font-poppins mb-2">
                  {isLoading ? 'Loading Calendar...' : 
                    `Nepali Calendar ${params.year} - ${getMonthName(parseInt(month))}`}
                </h1>
                <p className="text-neutral mb-2">
                  नेपाली पात्रो {params.year} - {getMonthName(parseInt(month))}
                </p>
                <p className="text-sm text-gray-500">
                  Today: {today.toLocaleDateString()} ({weekdays[today.getDay()]})
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <button 
                  className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    const today = new Date();
                    // Get Nepali year (roughly AD + 57)
                    const currentNepaliYear = today.getFullYear() + 57;
                    const currentMonth = today.getMonth() + 1;
                    const nepaliMonthName = getMonthName(currentMonth).toLowerCase();
                    setLocation(`/nepalicalendar/${currentNepaliYear}/${nepaliMonthName}`);
                  }}
                >
                  Go to Today
                </button>
                
                <div className="flex gap-1 items-center">
                  <select 
                    className="px-2 py-1.5 border border-gray-200 rounded-md text-sm"
                    defaultValue={month}
                    onChange={(e) => {
                      const monthName = getMonthName(parseInt(e.target.value)).toLowerCase();
                      setLocation(`/nepalicalendar/${year}/${monthName}`);
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{getMonthName(m)}</option>
                    ))}
                  </select>
                  
                  <select 
                    className="px-2 py-1.5 border border-gray-200 rounded-md text-sm"
                    defaultValue={year}
                    onChange={(e) => {
                      const monthName = getMonthName(parseInt(month)).toLowerCase();
                      setLocation(`/nepalicalendar/${e.target.value}/${monthName}`);
                    }}
                  >
                    {/* Range from 2000 BS to current year plus a few years */}
                    {Array.from({ length: 83 }, (_, i) => 2000 + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <p className="text-center text-neutral mb-4 max-w-2xl mx-auto">
              Browse through the Bikram Sambat (BS) calendar and view corresponding Gregorian (AD) dates.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="month" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="month">Calendar View</TabsTrigger>
                <TabsTrigger value="events">Year Events</TabsTrigger>
              </TabsList>
              
              {/* MONTH VIEW TAB */}
              <TabsContent value="month">
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
                        data?.monthDetails?.meta?.nepaliHeader || 
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
                        <div 
                          key={index} 
                          className={`text-center font-medium py-2 
                            ${index === 0 ? 'text-red-500' : ''} 
                            ${index === 6 ? 'text-green-600' : ''}
                          `}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {isLoading ? (
                        // Loading skeleton
                        Array(35).fill(null).map((_, i) => (
                          <div key={i} className="aspect-square border border-gray-100 rounded bg-gray-50 animate-pulse"></div>
                        ))
                      ) : error ? (
                        // Error state
                        <div className="col-span-7 text-center py-8 text-red-500">
                          Failed to load calendar data
                        </div>
                      ) : (
                        // Calendar grid with actual data
                        (() => {
                          if (!data?.days?.length) return null;
                          
                          // First, create and render empty cells for proper day alignment
                          const firstDay = data.days[0];
                          const emptyCellCount = firstDay.dayOfWeek;
                          const emptyCells = Array(emptyCellCount).fill(null).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                          ));
                          
                          // Then render all the day cells
                          const dayCells = data.days.map((day: any, index: number) => {
                            const isTodayHighlight = isToday(day.bs.day, day.bs.month, day.bs.year);
                            const isSunday = day.dayOfWeek === 0;
                            const isSaturday = day.dayOfWeek === 6;
                            
                            return (
                              <div 
                                key={`day-${index}`}
                                className={`aspect-square border border-gray-100 rounded p-1.5 hover:bg-gray-50 
                                  ${day.isHoliday ? 'bg-red-50' : day.events?.length ? 'bg-primary-light/10' : ''}
                                  ${isTodayHighlight ? 'ring-2 ring-green-500' : ''}
                                  transition-all`}
                              >
                                <div className="flex flex-col h-full">
                                  {/* Nepali date - emphasized */}
                                  <div className={`text-lg font-bold ${isSunday ? 'text-red-500' : isSaturday ? 'text-green-600' : 'text-gray-700'} ${isTodayHighlight ? 'bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto' : ''}`}>
                                    {day.bs.nepaliDay}
                                  </div>
                                  
                                  {/* English date - smaller */}
                                  <div className="text-xs text-gray-500 text-center">
                                    {day.ad.day}
                                  </div>
                                  
                                  {/* Tithi information */}
                                  {day.tithi && (
                                    <div className="text-[9px] text-gray-500 italic mt-1 text-center">{day.tithi}</div>
                                  )}
                                  
                                  {/* Event indicator */}
                                  {day.events?.length > 0 && (
                                    <div className="mt-auto text-[10px] text-primary-dark truncate bg-primary-light/20 px-1 py-0.5 rounded text-center">
                                      {day.events[0]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          });
                          
                          // Return all cells - empty cells first, then day cells
                          return [...emptyCells, ...dayCells];
                        })()
                      )}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-primary-light/10 p-3 rounded-lg flex items-center">
                    <div className="w-4 h-4 bg-primary-light/10 border border-gray-200 rounded mr-2"></div>
                    <span className="text-sm">Event/Festival</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-gray-200 rounded mr-2"></div>
                    <span className="text-sm">Public Holiday</span>
                  </div>
                  <div className="p-3 rounded-lg flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Today</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                    <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
                    <span className="text-sm">Regular Day</span>
                  </div>
                </div>
                
                {/* Month Summary */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-primary mb-3">About {getMonthName(parseInt(month))} Month</h3>
                  <p className="text-neutral mb-4">
                    {getMonthName(parseInt(month))} is the {parseInt(month)}{parseInt(month) === 1 ? 'st' : parseInt(month) === 2 ? 'nd' : parseInt(month) === 3 ? 'rd' : 'th'} month in the Nepali Bikram Sambat calendar. 
                    This month typically falls during {
                      ['April-May', 'May-June', 'June-July', 'July-August', 'August-September', 'September-October', 
                       'October-November', 'November-December', 'December-January', 'January-February', 'February-March', 'March-April'][parseInt(month) - 1]
                    } in the Gregorian calendar.
                  </p>
                  <p className="text-neutral">
                    The calendar used in Nepal is based on the Vikram Samvat (BS) which is approximately 56.7 years ahead of the Gregorian calendar (AD).
                  </p>
                </div>
              </TabsContent>
              
              {/* YEAR EVENTS TAB */}
              <TabsContent value="events">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-primary p-4">
                    <h2 className="text-xl font-semibold text-white font-montserrat text-center">
                      {`Holidays & Events for ${params.year || new Date().getFullYear().toString()}`}
                    </h2>
                  </div>
                  
                  <YearEvents year={params.year || new Date().getFullYear().toString()} />
                </div>
              </TabsContent>
            </Tabs>
            
            {/* FAQs Section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-primary mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">How to check today's Nepali date?</h4>
                  <p className="text-neutral">Click the "Go to Today" button at the top of the page to view today's date in the Nepali calendar.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">How do I view events for a month?</h4>
                  <p className="text-neutral">Navigate to the desired month using the month selector at the top, then click on the "Events" tab to see all events for that month.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">What do the different colored days mean?</h4>
                  <p className="text-neutral">Red indicates Sundays, green indicates Saturdays, and other special holidays are marked with background colors. The legend below the calendar explains the color coding.</p>
                </div>
              </div>
            </div>
            
            {/* Explore Other Tools */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-primary mb-6">Explore Other Tools</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/vegetables" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-center">
                  <h4 className="font-medium text-lg mb-2 text-primary">Vegetable Prices</h4>
                  <p className="text-neutral text-sm">Check daily vegetable prices from Kalimati market.</p>
                </a>
                
                <a href="/date-converter" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-center">
                  <h4 className="font-medium text-lg mb-2 text-primary">Date Converter</h4>
                  <p className="text-neutral text-sm">Convert dates between Nepali (BS) and English (AD) calendars.</p>
                </a>
                
                <a href="/rashifal" className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow text-center">
                  <h4 className="font-medium text-lg mb-2 text-primary">Daily Rashifal</h4>
                  <p className="text-neutral text-sm">Check your daily horoscope prediction.</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Calendar;
