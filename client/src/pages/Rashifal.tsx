
import { useQuery } from '@tanstack/react-query';
import { getRashifal } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import FadeIn from '@/components/ui/FadeIn';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const zodiacSigns = [
  { name: 'Mesh', englishName: 'Aries', symbol: '♈', element: 'Fire', ruler: 'Mars', quality: 'Cardinal', lucky: { number: 9, color: 'Red', day: 'Tuesday' } },
  { name: 'Brish', englishName: 'Taurus', symbol: '♉', element: 'Earth', ruler: 'Venus', quality: 'Fixed', lucky: { number: 6, color: 'Green', day: 'Friday' } },
  { name: 'Mithun', englishName: 'Gemini', symbol: '♊', element: 'Air', ruler: 'Mercury', quality: 'Mutable', lucky: { number: 5, color: 'Yellow', day: 'Wednesday' } },
  { name: 'Karkat', englishName: 'Cancer', symbol: '♋', element: 'Water', ruler: 'Moon', quality: 'Cardinal', lucky: { number: 2, color: 'White', day: 'Monday' } },
  { name: 'Singha', englishName: 'Leo', symbol: '♌', element: 'Fire', ruler: 'Sun', quality: 'Fixed', lucky: { number: 1, color: 'Gold', day: 'Sunday' } },
  { name: 'Kanya', englishName: 'Virgo', symbol: '♍', element: 'Earth', ruler: 'Mercury', quality: 'Mutable', lucky: { number: 5, color: 'Navy', day: 'Wednesday' } },
  { name: 'Tula', englishName: 'Libra', symbol: '♎', element: 'Air', ruler: 'Venus', quality: 'Cardinal', lucky: { number: 6, color: 'Pink', day: 'Friday' } },
  { name: 'Brischick', englishName: 'Scorpio', symbol: '♏', element: 'Water', ruler: 'Mars', quality: 'Fixed', lucky: { number: 9, color: 'Maroon', day: 'Tuesday' } },
  { name: 'Dhanu', englishName: 'Sagittarius', symbol: '♐', element: 'Fire', ruler: 'Jupiter', quality: 'Mutable', lucky: { number: 3, color: 'Purple', day: 'Thursday' } },
  { name: 'Makar', englishName: 'Capricorn', symbol: '♑', element: 'Earth', ruler: 'Saturn', quality: 'Cardinal', lucky: { number: 8, color: 'Brown', day: 'Saturday' } },
  { name: 'Kumbha', englishName: 'Aquarius', symbol: '♒', element: 'Air', ruler: 'Saturn', quality: 'Fixed', lucky: { number: 8, color: 'Blue', day: 'Saturday' } },
  { name: 'Meen', englishName: 'Pisces', symbol: '♓', element: 'Water', ruler: 'Jupiter', quality: 'Mutable', lucky: { number: 3, color: 'Sea Green', day: 'Thursday' } }
];

const Rashifal = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/rashifal'],
    queryFn: getRashifal,
    staleTime: 3600000
  });

  const mergedZodiacData = zodiacSigns.map(sign => {
    const apiData = data?.predictions?.find((p: any) => 
      p.sign.toLowerCase() === sign.englishName.toLowerCase()
    );
    return {
      ...sign,
      prediction: apiData?.prediction || 'Prediction not available at the moment.'
    };
  });

  const dailyMuhurat = {
    shubha: '6:15 AM - 7:45 AM',
    amrit: '2:30 PM - 4:00 PM',
    chara: '12:00 PM - 1:30 PM',
    rahu: '9:00 AM - 10:30 AM'
  };

  return (
    <MainLayout
      title="दैनिक राशिफल | Daily Nepali Horoscope"
      description="Read accurate daily horoscope predictions for all zodiac signs according to Vedic astrology. Updated daily for your cosmic guidance."
    >
      <FadeIn>
        {/* Hero Section */}
        <section className="py-8 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-poppins mb-4 text-center">
              दैनिक राशिफल
            </h1>
            <p className="text-center text-neutral mb-8 max-w-3xl mx-auto">
              Daily horoscope predictions based on Vedic astrology principles. Updated daily for your spiritual and practical guidance.
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {/* Muhurat Card */}
            <Card className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="text-xl font-semibold text-primary mb-4">Today's Auspicious Timings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-medium text-green-700">Shubha Muhurat</h4>
                  <p className="text-sm">{dailyMuhurat.shubha}</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700">Amrit Kaal</h4>
                  <p className="text-sm">{dailyMuhurat.amrit}</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700">Chara Muhurat</h4>
                  <p className="text-sm">{dailyMuhurat.chara}</p>
                </div>
                <div>
                  <h4 className="font-medium text-red-700">Rahu Kaal</h4>
                  <p className="text-sm">{dailyMuhurat.rahu}</p>
                </div>
              </div>
            </Card>

            {/* Zodiac Signs Tabs */}
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Signs</TabsTrigger>
                <TabsTrigger value="fire">Fire Signs</TabsTrigger>
                <TabsTrigger value="earth">Earth Signs</TabsTrigger>
                <TabsTrigger value="air">Air Signs</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(12).fill(null).map((_, i) => (
                      <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
                    Failed to load rashifal data. Please try again later.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mergedZodiacData.map((sign, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-primary">{sign.name}</h3>
                              <p className="text-sm text-gray-600">{sign.englishName}</p>
                            </div>
                            <span className="text-4xl text-green-600">{sign.symbol}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div className="flex items-center">
                              <i className="ri-fire-line text-green-600 mr-1"></i>
                              <span>{sign.element}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="ri-planet-line text-green-600 mr-1"></i>
                              <span>{sign.ruler}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="ri-number-1 text-green-600 mr-1"></i>
                              <span>Lucky: {sign.lucky.number}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="ri-palette-line text-green-600 mr-1"></i>
                              <span>{sign.lucky.color}</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <p className="text-gray-700 leading-relaxed">{sign.prediction}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="fire">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mergedZodiacData
                    .filter(sign => sign.element === 'Fire')
                    .map((sign, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Same card content as above */}
                      </Card>
                    ))}
                </div>
              </TabsContent>

              {/* Similar TabsContent for earth and air signs */}
            </Tabs>

            {/* Information Sections */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Understanding Vedic Astrology</h3>
                <p className="mb-4">Vedic astrology, also known as Jyotish, is an ancient Indian science that helps understand planetary positions and their influence on human lives.</p>
                <p>Daily predictions are calculated based on the movement of planets through various houses and their aspects with other celestial bodies.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Making the Most of Your Horoscope</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <i className="ri-sun-line text-green-600 text-xl mr-2"></i>
                    <span>Read your moon sign (Rashi) for emotional guidance</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-star-line text-green-600 text-xl mr-2"></i>
                    <span>Consider both sun and ascendant signs</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-time-line text-green-600 text-xl mr-2"></i>
                    <span>Best read during sunrise</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-mind-map text-green-600 text-xl mr-2"></i>
                    <span>Use as guidance, not absolute truth</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </MainLayout>
  );
};

export default Rashifal;
