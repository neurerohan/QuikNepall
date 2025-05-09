
import { useQuery } from '@tanstack/react-query';
import { getRashifal } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import FadeIn from '@/components/ui/FadeIn';
import { Card } from '@/components/ui/card';

const zodiacSigns = [
  { name: 'Mesh', englishName: 'Aries', symbol: '♈', element: 'Fire', ruler: 'Mars' },
  { name: 'Brish', englishName: 'Taurus', symbol: '♉', element: 'Earth', ruler: 'Venus' },
  { name: 'Mithun', englishName: 'Gemini', symbol: '♊', element: 'Air', ruler: 'Mercury' },
  { name: 'Karkat', englishName: 'Cancer', symbol: '♋', element: 'Water', ruler: 'Moon' },
  { name: 'Singha', englishName: 'Leo', symbol: '♌', element: 'Fire', ruler: 'Sun' },
  { name: 'Kanya', englishName: 'Virgo', symbol: '♍', element: 'Earth', ruler: 'Mercury' },
  { name: 'Tula', englishName: 'Libra', symbol: '♎', element: 'Air', ruler: 'Venus' },
  { name: 'Brischick', englishName: 'Scorpio', symbol: '♏', element: 'Water', ruler: 'Mars' },
  { name: 'Dhanu', englishName: 'Sagittarius', symbol: '♐', element: 'Fire', ruler: 'Jupiter' },
  { name: 'Makar', englishName: 'Capricorn', symbol: '♑', element: 'Earth', ruler: 'Saturn' },
  { name: 'Kumbha', englishName: 'Aquarius', symbol: '♒', element: 'Air', ruler: 'Saturn' },
  { name: 'Meen', englishName: 'Pisces', symbol: '♓', element: 'Water', ruler: 'Jupiter' }
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
                      
                      <div className="flex gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <i className="ri-fire-line text-green-600 mr-1"></i>
                          <span>{sign.element}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-planet-line text-green-600 mr-1"></i>
                          <span>{sign.ruler}</span>
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

            {/* Information Sections */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">About Vedic Rashifal</h3>
                <p className="mb-4">Rashifal predictions are based on ancient Vedic astrology principles that analyze planetary positions and their influences on different zodiac signs.</p>
                <p>These daily predictions offer guidance for various aspects of life including career, relationships, health, and spiritual growth.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Reading Your Horoscope</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <i className="ri-sun-line text-green-600 text-xl mr-2"></i>
                    <span>Read your sun sign prediction daily</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-moon-line text-green-600 text-xl mr-2"></i>
                    <span>Consider both rising and moon signs</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-time-line text-green-600 text-xl mr-2"></i>
                    <span>Best read in the morning</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-compass-3-line text-green-600 text-xl mr-2"></i>
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
