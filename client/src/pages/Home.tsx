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
          <div className="max-w-5xl mx-auto">
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

      {/* Featured Services Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary font-poppins mb-10 text-center">Our Featured Services</h2>
          
          {/* Vegetable Price Tracker */}
          <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-primary font-poppins mb-4">Vegetable Price Tracker</h3>
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
          
          {/* Rashifal Service */}
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center mb-20">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-primary font-poppins mb-4">Daily Rashifal Readings</h3>
              <p className="text-neutral mb-6">Access personalized daily horoscope predictions based on traditional Nepali astrology. Our Rashifal service features:</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Daily updated predictions for all 12 zodiac signs</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Guidance on relationships, career, health, and finances</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Traditional Nepali astrological interpretations</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Beautiful, interactive zodiac sign cards</span>
                </li>
              </ul>
              
              <Link href="/rashifal" className="inline-flex items-center bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                Read Your Rashifal <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
            
            <div className="md:w-1/2">
              <div className="p-6 bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-md text-white">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-xl font-semibold">आजको राशिफल</h4>
                  <span className="text-sm font-medium">{formattedDate}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  {rashifalQuery.data && rashifalQuery.data.predictions ? (
                    rashifalQuery.data.predictions.slice(0, 4).map((sign: any, index: number) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                        <h5 className="font-medium text-white">{sign.sign_nepali}</h5>
                        <p className="text-sm text-white/80 mt-2 line-clamp-3">{sign.prediction}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-4 text-center">
                      <div className="animate-pulse bg-white/20 h-5 w-3/4 mx-auto rounded mb-3"></div>
                      <div className="animate-pulse bg-white/20 h-4 w-2/3 mx-auto rounded"></div>
                    </div>
                  )}
                </div>
                
                <div className="text-center mt-5">
                  <p className="text-white/80 text-sm mb-3">Read your complete daily horoscope</p>
                  <Link href="/rashifal" className="inline-block bg-white text-primary px-5 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                    View All Signs
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Date Converter Service */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-primary font-poppins mb-4">BS-AD Date Converter</h3>
              <p className="text-neutral mb-6">Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our precise conversion tool. Features include:</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Instant conversion between Nepali and Gregorian calendars</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Simple, intuitive interface with date pickers</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Additional date information including day of week and tithis</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-primary">
                    <i className="ri-check-line text-xl"></i>
                  </div>
                  <span>Support for dates from 1975 BS to 2100 BS</span>
                </li>
              </ul>
              
              <Link href="/date-converter" className="inline-flex items-center bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                Convert Dates <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm p-6">
                <h4 className="text-xl font-semibold text-primary mb-4">Date Converter</h4>
                <div className="flex flex-col space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Convert from BS to AD</div>
                    <div className="flex gap-3 items-center justify-between">
                      <div className="font-medium text-neutral">2080 Kartik 15</div>
                      <div className="text-2xl text-primary">→</div>
                      <div className="font-medium text-neutral">2023 November 1</div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Convert from AD to BS</div>
                    <div className="flex gap-3 items-center justify-between">
                      <div className="font-medium text-neutral">2025 April 14</div>
                      <div className="text-2xl text-primary">→</div>
                      <div className="font-medium text-neutral">2082 Baishakh 1</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Link href="/date-converter" className="text-primary text-sm font-medium hover:underline">
                    Try the converter yourself →
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

      {/* SEO-friendly Informational Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary font-poppins mb-8 text-center">
              The Ultimate Nepali Information Resource
            </h2>
            
            <div className="prose prose-lg max-w-none text-neutral">
              <p>
                QuikNepal provides comprehensive Nepali information resources designed specifically for the unique needs of Nepali citizens and anyone interested in Nepal. Our platform integrates essential daily utilities with cultural context to make everyday life easier for Nepali users.
              </p>
              
              <h3 className="text-primary font-semibold mt-8 mb-4">The Importance of Nepali Calendar (Bikram Sambat)</h3>
              <p>
                The Bikram Sambat calendar holds immense cultural significance in Nepal, serving as the country's official calendar system. It's not just a way to track dates—it's integral to planning festivals, religious ceremonies, and agricultural activities. Our detailed calendar presentation includes:
              </p>
              <ul>
                <li>Traditional festivals and celebrations highlighted throughout the year</li>
                <li>Important national holidays and observances clearly marked</li>
                <li>Tithi information for religious and cultural practices</li>
                <li>Seasonal contextual information for each month</li>
              </ul>
              
              <h3 className="text-primary font-semibold mt-8 mb-4">Practical Daily Information</h3>
              <p>
                QuikNepal goes beyond calendar services to provide practical information that impacts daily life in Nepal. Our vegetable price tracker helps families budget effectively by providing up-to-date information on market prices, while our metal prices section allows users to track the value of investments in gold and silver—traditional stores of value in Nepali culture.
              </p>
              
              <h3 className="text-primary font-semibold mt-8 mb-4">Cultural Alignment</h3>
              <p>
                Our platform respectfully integrates traditional Nepali practices with modern technology. The Rashifal (horoscope) section honors the astrological traditions important to many Nepali citizens, while our intuitive design makes this cultural information accessible to users of all ages.
              </p>
              
              <div className="bg-primary-light/10 p-6 rounded-xl my-8 border border-primary-light/20">
                <h4 className="text-primary font-semibold mb-4">Why QuikNepal?</h4>
                <p className="mb-0">
                  QuikNepal stands out by providing authentic, accurate information specifically tailored to the Nepali context. Unlike general information sites, our platform deeply understands the cultural significance behind the data we present. We're committed to preserving cultural heritage while making essential information easily accessible for the modern Nepali user.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Link href="#features" className="inline-flex items-center bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                Explore All Services <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;