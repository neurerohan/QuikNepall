
import { useQuery } from '@tanstack/react-query';
import { getMetals } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import MetalPriceCard from '@/components/ui/MetalPriceCard';
import FadeIn from '@/components/ui/FadeIn';
import Bounce from '@/components/ui/Bounce';

const Metals = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/metals'],
    queryFn: getMetals,
    staleTime: 3600000
  });

  return (
    <MainLayout
      title="Gold & Silver Prices - Daily Rates"
      description="Track live gold and silver prices in Nepal. Get daily updated rates for precious metals in the Nepali market."
    >
      <FadeIn>
        <section className="py-12 bg-gradient-to-b from-amber-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-poppins mb-4 text-center animate-fadeIn">
              Precious Metal Prices
            </h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto animate-fadeIn delay-100">
              Stay updated with the latest gold and silver prices in the Nepali market to make informed investment decisions.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Bounce>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-6">
                  <h2 className="text-2xl font-semibold text-white">Today's Metal Prices</h2>
                  <p className="text-white/90 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                {isLoading ? (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-primary mb-4">Market Insights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <i className="ri-exchange-line mr-2 text-amber-600"></i>
                      <span>Prices updated twice daily</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-scales-3-line mr-2 text-amber-600"></i>
                      <span>1 Tola = 11.664 grams</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-store-line mr-2 text-amber-600"></i>
                      <span>Based on Nepal Gold & Silver Dealers Association</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-primary mb-4">Investment Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <i className="ri-timer-line mr-2 text-amber-600"></i>
                      <span>Best time to buy: Early morning rates</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-shield-check-line mr-2 text-amber-600"></i>
                      <span>Verify purity before purchasing</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <i className="ri-bank-line mr-2 text-amber-600"></i>
                      <span>Buy from authorized dealers only</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">About Metal Prices</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="mb-4">Gold and silver prices in Nepal are measured in tola. One tola is equivalent to 11.664 grams.</p>
                  <p className="mb-4">The prices are determined by international market rates, import duties, and local market demand.</p>
                  <p>Fine Gold (Tejabi) refers to pure gold used for investment purposes, while 24K Gold is used for jewelry with minimal alloying.</p>
                </div>
              </div>
            </div>
          </Bounce>
        </div>
      </section>
    </MainLayout>
  );
};

export default Metals;
