import MainLayout from '@/components/layout/MainLayout';
import FadeIn from '@/components/ui/FadeIn';
import Bounce from '@/components/ui/Bounce';
import CalendarWidget from '@/components/ui/CalendarWidget';
import FeatureCard from '@/components/ui/FeatureCard';
import DataTable from '@/components/ui/DataTable';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  getVegetables, 
  getMetals, 
  getRashifal, 
  getTodayNepaliDate,
  getCalendarEvents 
} from '@/lib/api';

const Home = () => {
  // Get sample vegetable data for the preview
  const vegetablesQuery = useQuery({
    queryKey: ['/api/vegetables'],
    queryFn: getVegetables,
    staleTime: 3600000 // 1 hour
  });

  // Get sample metal data for the preview
  const metalsQuery = useQuery({
    queryKey: ['/api/metals'],
    queryFn: getMetals,
    staleTime: 3600000 // 1 hour
  });

  // Get sample rashifal data for the preview
  const rashifalQuery = useQuery({
    queryKey: ['/api/rashifal'],
    queryFn: getRashifal,
    staleTime: 3600000 // 1 hour
  });

  // Get current date in AD format
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get today's Nepali date
  const { data: nepaliToday, isLoading: loadingNepaliToday } = useQuery({
    queryKey: ['/api/today'],
    queryFn: getTodayNepaliDate,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Get today's events
  const { data: eventsData } = useQuery({
    queryKey: ['/api/calendar-events'],
    queryFn: () => getCalendarEvents({}),
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  const vegetableColumns = [
    { header: 'Item', accessor: 'name' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Min Price', accessor: 'minPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Max Price', accessor: 'maxPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Avg Price', accessor: 'avgPrice', cell: (value: number) => `Rs. ${value}` },
  ];

  return (
    <MainLayout
      title="QuikNepal - Your Essential Nepali Information Hub"
      description="Access Nepali calendars, vegetable rates, metal prices, rashifal readings and more at QuikNepal, your comprehensive Nepali information portal."
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins mb-4">Essential Nepali Information Hub</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-8">Your comprehensive resource for Nepali calendars, vegetable rates, metal prices, rashifal readings and more</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <Bounce>
                <Link href="/calendar" className="bg-accent text-primary font-bold py-3 px-6 rounded-lg hover:shadow-lg transition duration-300" aria-label="Explore Nepali Calendar">
                  Explore Calendar
                </Link>
              </Bounce>
              <Link href="#features" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium py-3 px-6 rounded-lg hover:bg-white/20 transition duration-300" aria-label="Discover Features">
                Discover Features
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Calendar Widget Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <CalendarWidget />
            
            <div className="mt-6 bg-primary-light/20 rounded-lg p-4 flex items-start gap-4">
              <div className="text-primary-dark rounded-full bg-white p-2 mt-1">
                <i className="ri-calendar-line text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-primary-dark text-lg mb-1">Today's Date</h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
                    <p className="text-xs text-gray-500">Gregorian (AD)</p>
                    <p className="text-primary-dark font-medium">{formattedDate}</p>
                  </div>
                  
                  {nepaliToday ? (
                    <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
                      <p className="text-xs text-gray-500">Bikram Sambat (BS)</p>
                      <p className="text-primary-dark font-medium">
                        {nepaliToday.day} {nepaliToday.month_name} {nepaliToday.year}
                      </p>
                    </div>
                  ) : loadingNepaliToday ? (
                    <div className="bg-white rounded-lg p-2 shadow-sm flex-1 animate-pulse">
                      <p className="text-xs text-gray-300">Loading Nepali date...</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-2 shadow-sm flex-1">
                      <p className="text-xs text-gray-500">Bikram Sambat (BS)</p>
                      <p className="text-red-400 text-sm">Error loading Nepali date</p>
                    </div>
                  )}
                </div>
                
                {/* Display today's events if available */}
                {eventsData?.calendar_events?.length > 0 && (
                  <div className="mt-3 bg-white p-2 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-primary-dark mb-1">Today's Events</h4>
                    <ul className="space-y-1">
                      {eventsData.calendar_events.slice(0, 2).map((event: any, index: number) => (
                        <li key={index} className="text-xs text-neutral flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {event.title || event.name}
                        </li>
                      ))}
                    </ul>
                    {eventsData.calendar_events.length > 2 && (
                      <Link href="/calendar" className="text-xs text-primary hover:underline mt-1 inline-block">
                        + {eventsData.calendar_events.length - 2} more events
                      </Link>
                    )}
                  </div>
                )}
                
                <div className="mt-2 text-right">
                  <Link href="/nepalicalendar/2082/baishakh" className="text-primary text-xs font-medium hover:underline">
                    View Full Calendar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary font-poppins mb-4">Explore Our Features</h2>
            <p className="text-neutral max-w-2xl mx-auto">Access a wide range of essential Nepali information and utilities in one place</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              title="Nepali Calendar"
              description="Access a comprehensive Bikram Sambat (BS) calendar with corresponding Gregorian (AD) dates."
              icon="calendar-2"
              link="/calendar"
              linkText="View Calendar"
            />
            
            <FeatureCard 
              title="Date Converter"
              description="Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars."
              icon="repeat"
              link="/date-converter"
              linkText="Convert Dates"
            />
            
            <FeatureCard 
              title="Vegetable Rates"
              description="Track current vegetable prices from Kalimati market to make informed shopping decisions."
              icon="shopping-basket"
              link="/vegetables"
              linkText="Check Rates"
            />
            
            <FeatureCard 
              title="Metal Prices"
              description="Stay updated with the latest gold and silver prices in the Nepali market."
              icon="coin"
              link="/metals"
              linkText="View Prices"
            />
            
            <FeatureCard 
              title="Rashifal"
              description="Read daily horoscope predictions for all zodiac signs in the Nepali tradition."
              icon="star"
              link="/rashifal"
              linkText="Read Rashifal"
            />
            
            <FeatureCard 
              title="Forex Rates"
              description="Check current and historical foreign exchange rates for Nepali Rupee (NPR)."
              icon="exchange-dollar"
              link="/forex"
              linkText="View Forex Rates"
            />
          </div>
        </div>
      </section>

      {/* Vegetable Prices Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-primary font-poppins mb-4">Featured Service: Vegetable Price Tracker</h2>
              <p className="text-neutral mb-6">Stay informed about current vegetable prices at Kalimati Market to make better shopping decisions. Our tracker provides:</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Daily updated prices for common vegetables</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Minimum and maximum price ranges for each item</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Price trend indicators to track changes</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Easy-to-read table format with sorting options</span>
                </li>
              </ul>
              
              <Link href="/vegetables" className="inline-flex items-center bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                View Vegetable Prices <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
            
            <div className="md:w-1/2">
              <DataTable
                title="Today's Vegetable Prices"
                subtitle={`Last updated: ${formattedDate}`}
                columns={vegetableColumns}
                data={(vegetablesQuery.data || []).slice(0, 5).map((item: any) => ({
                  name: item.name_nepali ? `${item.name} (${item.name_nepali})` : item.name,
                  unit: item.unit,
                  minPrice: parseFloat(item.min_price),
                  maxPrice: parseFloat(item.max_price),
                  avgPrice: parseFloat(item.avg_price)
                }))}
                isLoading={vegetablesQuery.isLoading}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
