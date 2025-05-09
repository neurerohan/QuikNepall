import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getCalendarEvents, getMonthName, getTodayNepaliDate } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, useLocation } from 'wouter';
import FadeIn from '@/components/ui/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { getMonthContent, getYearInfo } from '@/lib/calendar-content';
import AnnualEvents from '@/components/ui/AnnualEvents';

// Helper function to convert Tithi names to Devanagari
const convertTithiToNepali = (tithi: string): string => {
  // Map of tithi names to Devanagari equivalents
  const tithiMap: Record<string, string> = {
    'Pratipada': 'प्रतिपदा',
    'Dwitiya': 'द्वितीया',
    'Tritiya': 'तृतीया',
    'Chaturthi': 'चतुर्थी',
    'Panchami': 'पञ्चमी',
    'Shashthi': 'षष्ठी',
    'Saptami': 'सप्तमी',
    'Ashtami': 'अष्टमी',
    'Navami': 'नवमी',
    'Dashami': 'दशमी',
    'Ekadashi': 'एकादशी',
    'Dwadashi': 'द्वादशी',
    'Trayodashi': 'त्रयोदशी',
    'Chaturdashi': 'चतुर्दशी',
    'Purnima': 'पूर्णिमा',
    'Amavasya': 'अमावस्या',
    // Add any other mappings needed
  };

  // Extract just the tithi name without Krishna/Shukla prefix if present
  const tithiParts = tithi.split(' ');
  const tithiName = tithiParts.length > 1 ? tithiParts[1] : tithi;

  return tithiMap[tithiName] || tithiName;
};

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

  // Get tithi information for a date
  const getTithiForDate = (date: string) => {
    // This is a placeholder - in a real app, you'd query this from your API
    const tithis = [
      'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'
    ];

    // Simple deterministic algorithm to assign a tithi based on date
    if (!date) return '';

    let dayOfMonth = 1;

    if (date.includes('-')) {
      dayOfMonth = parseInt(date.split('-')[2]) || 1;
    } else if (date.includes('.')) {
      dayOfMonth = parseInt(date.split('.')[0]) || 1;
    }

    // Map the day to a tithi (1-30 -> 0-15 with repetition)
    const tithiIndex = ((dayOfMonth - 1) % 15);

    // For the second half of the month, we're in the dark half (Krishna Paksha)
    const paksha = dayOfMonth > 15 ? 'Krishna' : 'Shukla';

    return `${tithis[tithiIndex]} (${paksha})`;
  };

  return (
    <div className="p-6">
      {Object.keys(eventsByMonth).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">No events found for this year</p>
          <p>Try selecting a different year or check back later</p>
        </div>
      ) : (
        <div>
          <h2 className="sr-only">Events for Year {year}</h2>
          {Object.keys(eventsByMonth).map((month) => (
            <div key={month} className="mb-8">
              <h3 className="text-lg font-semibold text-primary mb-4 border-b pb-2">{month}</h3>
              <div className="space-y-4">
                {eventsByMonth[month].map((event, index) => {
                  const { type, color } = getEventTypeAndColor(event);
                  const bsDate = event.date_bs || '';
                  const adDate = event.date_ad || event.date || '';
                  const tithi = event.tithi || getTithiForDate(bsDate);

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
                          <div className="text-xs uppercase">{month}</div>
                          <div className="text-2xl font-bold">{dayNumber}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{event.title || event.name}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className={`text-xs py-0.5 px-2 rounded-full ${color}`}>
                              {type}
                            </span>
                            <p className="text-sm text-gray-500">
                              BS: {formatDate(bsDate)} | AD: {formatDate(adDate)}
                            </p>
                          </div>

                          {tithi && (
                            <div className="mt-2 text-sm text-gray-600 italic">
                              <strong>Tithi:</strong> {tithi} <span className="text-primary">(तिथि: {convertTithiToNepali(tithi)})</span>
                            </div>
                          )}

                          {event.description && (
                            <div className="mt-2">
                              <h5 className="text-sm font-medium text-gray-700">Description:</h5>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                          )}

                          {/* Additional details for SEO */}
                          <div className="sr-only">
                            <h5>Event Details</h5>
                            <p>Date: {formatDate(bsDate)} BS ({formatDate(adDate)} AD)</p>
                            <p>Type: {type}</p>
                            {tithi && <p>Tithi: {tithi}</p>}
                            {event.description && <p>Description: {event.description}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* SEO Information */}
          <div className="sr-only">
            <h2>Nepali Calendar Events for Year {year}</h2>
            <p>This page displays all festivals, holidays, and important events for the Nepali year {year}.</p>
            <p>Events are organized by month and include tithi information.</p>
          </div>
        </div>
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

  // State to hold today's Nepali date from API
  const [todayNepaliDate, setTodayNepaliDate] = useState<any>(null);

  // State to hold the selected day for detail view
  const [selectedDay, setSelectedDay] = useState<any>(null);

  // Get today's Nepali date from API
  const { data: nepaliToday, isLoading: loadingToday } = useQuery({
    queryKey: ['/api/today'],
    queryFn: getTodayNepaliDate,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnWindowFocus: false,
  });

  // Update today state when data is loaded
  useEffect(() => {
    if (nepaliToday) {
      setTodayNepaliDate(nepaliToday);
    }
  }, [nepaliToday]);

  // If no params are provided, use current Nepali date from API and redirect
  useEffect(() => {
    if (!params.year || !params.month) {
      if (nepaliToday) {
        // Use the accurate Nepali date from API
        const nepaliMonthName = nepaliToday.month_name.toLowerCase();
        setLocation(`/nepalicalendar/${nepaliToday.year}/${nepaliMonthName}`);
      } else {
        // Fallback to approximation if API data not available yet
        const today = new Date();
        const currentNepaliYear = today.getFullYear() + 57; // Approximate
        const currentMonth = today.getMonth() + 1;
        const nepaliMonthName = getMonthName(currentMonth).toLowerCase();
        setLocation(`/nepalicalendar/${currentNepaliYear}/${nepaliMonthName}`);
      }
    }
  }, [params, setLocation, nepaliToday]);

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
    if (nepaliToday) {
      // Use accurate Nepali date from API
      // Only highlight if we're in the current month AND on the correct day
      return parseInt(year) === nepaliToday.year && 
             parseInt(month) === nepaliToday.month && 
             nepaliToday.day === bsDay;
    } else {
      // If API data not available, don't highlight any day
      return false;
    }
  };

  return (
    <MainLayout 
      title={`Nepali Calendar ${params.year} - ${getMonthName(parseInt(month))}` }
      description="View and navigate through Bikram Sambat (BS) calendar with corresponding Gregorian (AD) dates."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div className="relative">
                  <div className="absolute -top-2 -left-3 w-20 h-20 bg-primary/5 rounded-full blur-2xl"></div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-poppins mb-3">
                    {isLoading ? 'Loading Calendar...' : 
                      `Nepali Calendar ${params.year}`}
                  </h1>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl md:text-3xl font-semibold text-primary-dark">
                      {getMonthName(parseInt(month))}
                    </h2>
                    <div className="h-6 w-[2px] bg-gray-300 rounded-full"></div>
                    <p className="text-2xl font-medium text-neutral">
                      नेपाली पात्रो
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    <i className="ri-calendar-event-fill text-primary"></i>
                    <p className="text-base font-medium text-gray-700">
                      Today: {today.toLocaleDateString()} ({weekdays[today.getDay()]})
                      {nepaliToday && (
                        <span className="ml-2 text-primary">
                          BS: {nepaliToday.year}-{nepaliToday.month}-{nepaliToday.day} ({nepaliToday.month_name})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <button 
                  className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    if (nepaliToday) {
                      // Use accurate Nepali date from the API
                      const nepaliMonthName = nepaliToday.month_name.toLowerCase();
                      setLocation(`/nepalicalendar/${nepaliToday.year}/${nepaliMonthName}`);
                    } else {
                      // Fallback to approximation if API data not available
                      const today = new Date();
                      const currentNepaliYear = today.getFullYear() + 57;
                      const currentMonth = today.getMonth() + 1;
                      const nepaliMonthName = getMonthName(currentMonth).toLowerCase();
                      setLocation(`/nepalicalendar/${currentNepaliYear}/${nepaliMonthName}`);
                    }
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

                  <div className="p-4 md:p-5">
                    <div className="grid grid-cols-7 mb-3">
                      {weekdays.map((day, index) => (
                        <div 
                          key={index} 
                          className={`text-center font-medium py-2.5 text-sm md:text-base
                            ${index === 0 ? 'text-red-500' : ''} 
                            ${index === 6 ? 'text-green-600' : ''}
                          `}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 md:gap-3">
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
                            // Create our own holiday detection logic - be more specific with holiday detection
                            const isHoliday = day.events && day.events.some((event: string) => {
                              // Only mark true holidays as holidays, not every event with these common terms
                              const isPublicHoliday = 
                                event.toLowerCase().includes('public holiday') || 
                                event.toLowerCase().includes('federal holiday') ||
                                event.toLowerCase().includes('national holiday');

                              // Religious festivals that are holidays  
                              const isReligiousHoliday =
                                event.toLowerCase().includes('dashain') ||
                                event.toLowerCase().includes('tihar') ||
                                event.toLowerCase().includes('holi') ||
                                event.toLowerCase().includes('lhosar') ||
                                event.toLowerCase().includes('chhath');

                              return isPublicHoliday || isReligiousHoliday;
                            });

                            return (
                              <div 
                                key={`day-${index}`}
                                className={`aspect-square border border-gray-100 rounded p-2 hover:bg-gray-50 
                                  ${day.isHoliday === true || isHoliday ? 'bg-red-50' : day.dayOfWeek === 6 ? 'bg-red-50/30' : ''}
                                  ${isTodayHighlight ? 'ring-2 ring-green-500' : ''}
                                  transition-all cursor-pointer`}
                                onClick={() => setSelectedDay(day)}
                              >
                                <div className="flex flex-col h-full relative">
                                  {/* Nepali date - emphasized */}
                                  <div className={`text-xl md:text-2xl font-bold text-center ${day.isHoliday || isHoliday ? 'text-red-500' : isSaturday ? 'text-red-500' : isSunday ? 'text-primary' : 'text-gray-700'} ${isTodayHighlight ? 'bg-green-500 text-white rounded-full w-9 h-9 flex items-center justify-center mx-auto' : ''}`}>
                                    {day.bs.nepaliDay}
                                  </div>

                                  {/* English date - smaller, positioned in corner */}
                                  <div className="text-[10px] md:text-xs text-gray-500 absolute top-0 right-0 px-0.5">
                                    {day.ad.day}
                                  </div>

                                  {/* Tithi information in Devanagari */}
                                  {day.tithi && (
                                    <div className="text-[9px] md:text-[10px] text-gray-500 mt-1 text-center max-w-full px-1 truncate">
                                      <h4 className="sr-only">Tithi: {day.tithi}</h4>
                                      तिथि: {convertTithiToNepali(day.tithi)}
                                    </div>
                                  )}

                                  {/* Event indicator */}
                                  {day.events?.length > 0 && (
                                    <div className="mt-auto text-[9px] md:text-[10px] text-primary-dark truncate px-1 py-0.5 text-center">
                                      <h4 className="sr-only">Event: {day.events.join(', ')}</h4>
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

                {/* Monthly Events Section - Enlarged */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6 md:p-7 border border-gray-100">
                  <h4 className="text-xl font-semibold text-primary mb-5">Key Events in {getMonthName(parseInt(month))}</h4>

                  {/* Current month events from API data */}
                  {data && data.days && data.days.filter((day: any) => day.events && day.events.length > 0).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        // Safely extract all events with proper type handling
                        const allEvents: string[] = [];
                        data.days.forEach((day: any) => {
                          if (day.events && Array.isArray(day.events)) {
                            day.events.forEach((event: any) => {
                              if (typeof event === 'string' && !allEvents.includes(event)) {
                                allEvents.push(event);
                              }
                            });
                          }
                        });

                        return allEvents.map((event: string, index) => {
                          // Get days for this event
                          const eventDays = data.days
                            .filter((day: any) => 
                              day.events && 
                              Array.isArray(day.events) && 
                              day.events.includes(event)
                            )
                            .map((day: any) => day.bs.nepaliDay)
                            .join(', ');

                          // Determine if the event is a holiday - match the logic from day cells
                          const isEventHoliday = (() => {
                              // Only mark true holidays as holidays, not every event with these common terms
                              const isPublicHoliday = 
                                event.toLowerCase().includes('public holiday') || 
                                event.toLowerCase().includes('federal holiday') ||
                                event.toLowerCase().includes('national holiday');

                              // Religious festivals that are holidays  
                              const isReligiousHoliday =
                                event.toLowerCase().includes('dashain') ||
                                event.toLowerCase().includes('tihar') ||
                                event.toLowerCase().includes('holi') ||
                                event.toLowerCase().includes('lhosar') ||
                                event.toLowerCase().includes('chhath');

                              return isPublicHoliday || isReligiousHoliday;
                          })();

                          return (
                            <div 
                              key={index} 
                              className={`flex items-start p-3 rounded-lg border ${
                                isEventHoliday 
                                  ? 'bg-red-50/40 border-red-100' 
                                  : 'bg-white border-gray-100'
                              }`}
                            >
                              <div className={`text-lg mr-3 mt-0.5 ${
                                isEventHoliday ? 'text-red-500' : 'text-primary'
                              }`}>•</div>
                              <div>
                                <span className={`text-sm md:text-base font-medium ${
                                  isEventHoliday ? 'text-red-700' : 'text-gray-700'
                                }`}>
                                  {event}
                                </span>
                                <div className="text-xs md:text-sm text-gray-500 mt-1">
                                  {eventDays} {getMonthName(parseInt(month))}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    <p className="text-base text-gray-500 bg-gray-50 p-4 rounded-lg">No major events recorded for this month.</p>
                  )}

                  {/* Traditional festivals associated with this month */}
                  {params.year && (
                    <div className="mt-6">
                      <h5 className="font-medium text-primary-dark mb-3">Traditional Festivals</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getMonthContent(parseInt(month), parseInt(params.year)).festivals.map((festival, index) => (
                          <div key={index} className="bg-primary-light/5 p-3 rounded-lg border border-primary-light/20">
                            <div className="font-medium text-primary-dark">{festival}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Traditional festival celebrated in {getMonthName(parseInt(month))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Month Summary - Using dynamic content */}
                {params.year && (
                  <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-primary mb-3">About {getMonthName(parseInt(month))} Month</h3>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-3/4">
                        {/* Dynamic content */}
                        {(() => {
                          const monthContent = getMonthContent(parseInt(month), parseInt(params.year));
                          return (
                            <>
                              <p className="text-neutral mb-4">
                                <span className="font-medium">{monthContent.name}</span> (Nepali: <span className="font-medium">{monthContent.nepaliName}</span>) is 
                                the {parseInt(month)}{parseInt(month) === 1 ? 'st' : parseInt(month) === 2 ? 'nd' : parseInt(month) === 3 ? 'rd' : 'th'} month in the Nepali Bikram Sambat calendar. 
                                This month typically falls during <span className="font-medium">{monthContent.gregorianMonths}</span> in the Gregorian calendar.
                              </p>

                              <p className="text-neutral mb-4">
                                In {monthContent.name}, the average temperature in Nepal ranges from <span className="font-medium">{monthContent.temperature}</span>. 
                                This month is particularly known for <span className="font-medium">{monthContent.highlights}</span>.
                              </p>

                              <p className="text-neutral mb-4">
                                {monthContent.name} typically has <span className="font-medium">{monthContent.days} days</span> in most years of the Nepali calendar. 
                                The agricultural activities during this month generally include <span className="font-medium">{monthContent.agriculture}</span>.
                              </p>

                              <div className="bg-primary-light/10 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-primary mb-2">Seasonal Context</h4>
                                <p className="text-sm text-neutral">
                                  {monthContent.name} falls within {(() => {
                                    if ([1, 2, 3].includes(parseInt(month))) return "spring season in Nepal";
                                    if ([4, 5, 6, 7].includes(parseInt(month))) return "monsoon season in Nepal";
                                    if ([8, 9].includes(parseInt(month))) return "autumn season in Nepal";
                                    return "winter season in Nepal";
                                  })()} with particular importance to the agricultural calendar and cultural traditions.
                                  {parseInt(month) === 1 && " This is the beginning of the Nepali calendar year."}
                                  {parseInt(month) === 6 && " This month hosts Dashain, Nepal's most significant festival."}
                                  {parseInt(month) === 7 && " This month hosts Tihar, the festival of lights, second only to Dashain in importance."}
                                </p>
                              </div>
                            </>
                          )
                        })()}

                        {/* General information about Nepali calendar */}
                        <p className="text-neutral">
                          The Nepali calendar, officially known as Bikram Sambat (BS), is approximately 56.7 years ahead of the Gregorian calendar (AD) and is the official calendar of Nepal. It was introduced by King Bikramaditya and has been in use for over 2,000 years, making it one of the oldest continuously used calendars in the world.
                        </p>
                      </div>

                      <div className="md:w-1/4">
                        <div className="bg-gradient-to-r from-primary/80 to-primary p-4 rounded-lg text-white shadow-md">
                          <h4 className="font-medium mb-3 text-white/90">Month Facts</h4>
                          <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Position: {parseInt(month)}{parseInt(month) === 1 ? 'st' : parseInt(month) === 2 ? 'nd' : parseInt(month) === 3 ? 'rd' : 'th'} month</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Nepali Name: {getMonthContent(parseInt(month), parseInt(params.year)).nepaliName}</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Days: {getMonthContent(parseInt(month), parseInt(params.year)).days}</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Major Festivals: {getMonthContent(parseInt(month), parseInt(params.year)).festivals.length}</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Gregorian: {getMonthContent(parseInt(month), parseInt(params.year)).gregorianMonths}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* YEAR EVENTS TAB - Using our new Annual Events component */}
              <TabsContent value="events">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-primary p-4">
                    <h2 className="text-xl font-semibold text-white font-montserrat text-center">
                      {`Holidays & Events for ${params.year || new Date().getFullYear().toString()} BS`}
                    </h2>
                  </div>

                  {/* Standard API events first */}
                  <div className="border-b border-gray-100">
                    <YearEvents year={params.year || new Date().getFullYear().toString()} />
                  </div>

                  {/* Enhanced annual events with our new component */}
                  <AnnualEvents year={parseInt(params.year || new Date().getFullYear().toString())} />
                </div>
              </TabsContent>
            </Tabs>

            {/* Day Details Modal */}
            {selectedDay && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">
                          {selectedDay.bs.nepaliDay} {selectedDay.bs.monthName} {selectedDay.bs.year}
                        </h3>
                        <p className="text-neutral">
                          {selectedDay.ad.day} {selectedDay.ad.monthName} {selectedDay.ad.year} ({weekdays[selectedDay.dayOfWeek]})
                        </p>
                      </div>
                      <button 
                        className="text-gray-500 hover:text-gray-700 p-1" 
                        onClick={() => setSelectedDay(null)}
                      >
                        <i className="ri-close-line text-xl"></i>
                      </button>
                    </div>

                    {/* Tithi Information */}
                    {selectedDay.tithi && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Tithi</h4>
                        <p className="bg-primary-light/10 p-2 rounded text-sm">
                          {selectedDay.tithi} (तिथि: {convertTithiToNepali(selectedDay.tithi)})
                        </p>
                      </div>
                    )}

                    {/* Events */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Events</h4>
                      {selectedDay.events && selectedDay.events.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedDay.events.map((event: string, index: number) => (
                            <li key={index} className="bg-primary-light/10 p-2 rounded text-sm flex items-start">
                              <span className="mr-2 text-primary">•</span>
                              <span>{event}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No events on this day</p>
                      )}
                    </div>

                    {/* Holiday Information */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                        ${selectedDay.isHoliday 
                          ? 'bg-red-100 text-red-800' 
                          : selectedDay.dayOfWeek === 6 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {selectedDay.isHoliday 
                          ? 'Public Holiday' 
                          : selectedDay.dayOfWeek === 6 
                            ? 'Weekend (Saturday)'
                            : 'Working Day'
                        }
                      </div>
                    </div>

                    {/* SEO content */}
                    <div className="sr-only">
                      <h2>Day Details: {selectedDay.bs.nepaliDay} {selectedDay.bs.monthName} {selectedDay.bs.year}</h2>
                      <p>Gregorian date: {selectedDay.ad.day} {selectedDay.ad.monthName} {selectedDay.ad.year}</p>
                      <p>Weekday: {weekdays[selectedDay.dayOfWeek]}</p>
                      {selectedDay.tithi && <p>Tithi: {selectedDay.tithi}</p>}
                      {selectedDay.events && selectedDay.events.length > 0 && (
                        <>
                          <h3>Events on this day:</h3>
                          <ul>
                            {selectedDay.events.map((event: string, index: number) => (
                              <li key={index}>{event}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                        onClick={() => setSelectedDay(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <p className="text-neutral">Red indicates Saturdays (weekend holiday in Nepal), blue indicates Sundays, and other special holidays are marked with background colors. The legend below the calendar explains the color coding.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-medium text-lg mb-2">How do I see details for a specific day?</h4>
                  <p className="text-neutral">Click on any day in the calendar to see its detailed information, including the tithi, events, and holiday status.</p>
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