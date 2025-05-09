import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getCalendarEvents } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, useLocation } from 'wouter';
import FadeIn from '@/components/ui/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

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
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
      setLocation(`/calendar/${currentYear}/${currentMonth}`);
    }
  }, [params, setLocation]);

  const year = params.year || new Date().getFullYear().toString();
  const month = params.month || (new Date().getMonth() + 1).toString();

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/calendar/${year}/${month}`],
    queryFn: () => getCalendar(year, month),
    enabled: !!year && !!month,
    retry: 1
  });

  const handlePreviousMonth = () => {
    const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
    const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
    setLocation(`/calendar/${prevYear}/${prevMonth}`);
  };

  const handleNextMonth = () => {
    const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
    const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
    setLocation(`/calendar/${nextYear}/${nextMonth}`);
  };

  return (
    <MainLayout 
      title="Nepali Calendar" 
      description="View and navigate through Bikram Sambat (BS) calendar with corresponding Gregorian (AD) dates."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-primary font-poppins mb-4 text-center">Nepali Calendar</h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto">
              Browse through the Bikram Sambat (BS) calendar and view corresponding Gregorian (AD) dates.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-12 bg-white">
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
                        <div key={index} className="text-center font-medium text-neutral py-2">{day}</div>
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
                        data?.days?.map((day: any, index: number) => {
                          // Check if we need empty cells at the beginning (for proper day alignment)
                          if (index === 0 && day.dayOfWeek > 0) {
                            const emptyCells = Array(day.dayOfWeek).fill(null).map((_, i) => (
                              <div key={`empty-${i}`} className="aspect-square"></div>
                            ));
                            return [
                              ...emptyCells,
                              <div 
                                key={index}
                                className={`aspect-square border border-gray-100 rounded p-1 hover:bg-gray-50 ${
                                  day.isHoliday ? 'bg-red-50' : day.events?.length ? 'bg-primary-light/10' : ''
                                } transition-colors`}
                              >
                                <div className="flex flex-col h-full">
                                  <div className="text-xs text-gray-500">{day.bs.day}</div>
                                  <div className="text-sm font-medium">{day.ad.day}</div>
                                  {day.tithi && (
                                    <div className="text-[9px] text-gray-500 italic">{day.tithi}</div>
                                  )}
                                  {day.events?.length > 0 && (
                                    <div className="mt-auto text-xs text-primary-dark truncate">{day.events[0]}</div>
                                  )}
                                </div>
                              </div>
                            ];
                          }
                          
                          return (
                            <div 
                              key={index}
                              className={`aspect-square border border-gray-100 rounded p-1 hover:bg-gray-50 ${
                                day.isHoliday ? 'bg-red-50' : day.events?.length ? 'bg-primary-light/10' : ''
                              } transition-colors`}
                            >
                              <div className="flex flex-col h-full">
                                <div className="text-xs text-gray-500">{day.bs.day}</div>
                                <div className="text-sm font-medium">{day.ad.day}</div>
                                {day.tithi && (
                                  <div className="text-[9px] text-gray-500 italic">{day.tithi}</div>
                                )}
                                {day.events?.length > 0 && (
                                  <div className="mt-auto text-xs text-primary-dark truncate">{day.events[0]}</div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-light/10 p-3 rounded-lg flex items-center">
                    <div className="w-4 h-4 bg-primary-light/10 border border-gray-200 rounded mr-2"></div>
                    <span className="text-sm">Event/Festival</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-gray-200 rounded mr-2"></div>
                    <span className="text-sm">Public Holiday</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                    <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
                    <span className="text-sm">Regular Day</span>
                  </div>
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
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Calendar;
