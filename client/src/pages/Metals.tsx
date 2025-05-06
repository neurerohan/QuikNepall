import { useQuery } from '@tanstack/react-query';
import { getMetals } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import MetalPriceCard from '@/components/ui/MetalPriceCard';
import FadeIn from '@/components/ui/FadeIn';

const Metals = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/metals/'],
    staleTime: 3600000 // 1 hour
  });

  return (
    <MainLayout
      title="Metal Prices"
      description="Stay updated with the latest gold and silver prices in the Nepali market."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-primary font-poppins mb-4 text-center">Metal Prices</h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto">
              Current gold and silver prices in the Nepali market to help you make informed purchasing decisions.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
              <div className="bg-primary p-4">
                <h2 className="text-xl font-semibold text-white">Today's Metal Prices</h2>
                <p className="text-white/80 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
              
              {isLoading ? (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-100 animate-pulse h-32 rounded-lg"></div>
                  <div className="bg-gray-100 animate-pulse h-32 rounded-lg"></div>
                </div>
              ) : error ? (
                <div className="p-6">
                  <div className="bg-red-50 p-4 rounded-lg text-red-800">
                    Failed to load metal prices. Please try again later.
                  </div>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data?.gold && (
                    <MetalPriceCard 
                      type="gold"
                      prices={[
                        { label: 'Fine Gold (Tejabi)', value: `Rs. ${data.gold.fineGold} / tola` },
                        { label: '24K Gold', value: `Rs. ${data.gold.standardGold} / tola` }
                      ]}
                    />
                  )}
                  
                  {data?.silver && (
                    <MetalPriceCard 
                      type="silver"
                      prices={[
                        { label: 'Standard Silver', value: `Rs. ${data.silver.standardSilver} / tola` }
                      ]}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">About Metal Prices in Nepal</h3>
              <p className="mb-4">Gold and silver prices in Nepal are measured in tola. One tola is equivalent to 11.66 grams.</p>
              <p className="mb-4">The prices are determined by international market rates, import duties, and local market demand.</p>
              <p className="mb-4">Fine Gold (Tejabi) refers to pure gold that is used for investment purposes, while 24K Gold is used for jewelry with minimal alloying.</p>
              <p>These prices are provided for reference purposes. Actual buying and selling prices may vary slightly at different jewelry shops.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Metals;
