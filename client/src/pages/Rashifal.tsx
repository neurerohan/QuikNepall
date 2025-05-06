import { useQuery } from '@tanstack/react-query';
import { getRashifal } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import ZodiacCard from '@/components/ui/ZodiacCard';
import FadeIn from '@/components/ui/FadeIn';

const zodiacSigns = [
  { name: 'Mesh', englishName: 'Aries', symbol: '♈' },
  { name: 'Brish', englishName: 'Taurus', symbol: '♉' },
  { name: 'Mithun', englishName: 'Gemini', symbol: '♊' },
  { name: 'Karkat', englishName: 'Cancer', symbol: '♋' },
  { name: 'Singha', englishName: 'Leo', symbol: '♌' },
  { name: 'Kanya', englishName: 'Virgo', symbol: '♍' },
  { name: 'Tula', englishName: 'Libra', symbol: '♎' },
  { name: 'Brischick', englishName: 'Scorpio', symbol: '♏' },
  { name: 'Dhanu', englishName: 'Sagittarius', symbol: '♐' },
  { name: 'Makar', englishName: 'Capricorn', symbol: '♑' },
  { name: 'Kumbha', englishName: 'Aquarius', symbol: '♒' },
  { name: 'Meen', englishName: 'Pisces', symbol: '♓' }
];

const Rashifal = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/rashifal'],
    queryFn: getRashifal,
    staleTime: 3600000 // 1 hour
  });

  // Merge API data with our zodiac signs array
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
      title="Rashifal - Daily Horoscope"
      description="Read daily horoscope predictions for all zodiac signs in the Nepali tradition."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-primary font-poppins mb-4 text-center">Daily Rashifal</h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto">
              Read today's horoscope predictions for all twelve zodiac signs according to Nepali astrology.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
              <div className="bg-primary p-4">
                <h2 className="text-xl font-semibold text-white">Today's Rashifal</h2>
                <p className="text-white/80 text-sm">For {new Date().toLocaleDateString()}</p>
              </div>
              
              {isLoading ? (
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array(12).fill(null).map((_, i) => (
                      <div key={i} className="border border-gray-100 rounded-lg p-3 text-center bg-gray-50 animate-pulse h-24"></div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="p-6">
                  <div className="bg-red-50 p-4 rounded-lg text-red-800">
                    Failed to load rashifal data. Please try again later.
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mergedZodiacData.map((sign, index) => (
                      <ZodiacCard 
                        key={index} 
                        sign={sign} 
                        isActive={index === 3} // Highlight Karkat (Cancer) as example
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">About Nepali Rashifal</h3>
              <p className="mb-4">Rashifal is the Nepali term for horoscope predictions. These daily forecasts are based on the movement of celestial bodies and their effects on different zodiac signs according to Hindu astrology.</p>
              <p className="mb-4">In Nepali culture, many people consult their daily rashifal to get insights about their day and make important decisions accordingly.</p>
              <p>Click on any zodiac sign above to read the detailed prediction for today.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Rashifal;
