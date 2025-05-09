
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
      title="Gold & Silver Prices Today - Live Metal Rates"
      description="Get live gold and silver prices in Nepal. Updated daily rates for precious metals with market insights and investment tips."
    >
      <FadeIn>
        <section className="py-12 bg-gradient-to-b from-amber-50 via-white to-amber-50/30">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-poppins mb-4 text-center animate-fade-in">
              Today's Gold & Silver Rates
            </h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto animate-fade-in delay-100">
              Track live precious metal prices in Nepal. Make informed investment decisions with our real-time rate updates and market insights.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,215,0,0.1),transparent)] pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <Bounce>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100 mb-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
                <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">Live Metal Rates</h2>
                      <p className="text-white/90 text-sm mt-2">Last updated: {new Date().toLocaleString()}</p>
                    </div>
                    <i className="ri-coins-line text-4xl text-white/90"></i>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-8">
                    <div className="bg-red-50 p-6 rounded-xl text-red-800 flex items-center">
                      <i className="ri-error-warning-line mr-3 text-xl"></i>
                      <p>Unable to fetch metal prices. Please try again later.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <i className="ri-line-chart-line text-2xl text-amber-600 mr-3"></i>
                    <h3 className="text-xl font-semibold text-primary">Market Analysis</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-700 hover:text-amber-700 transition-colors">
                      <i className="ri-exchange-line mr-3 text-amber-600"></i>
                      <span>Rates updated twice daily for accuracy</span>
                    </li>
                    <li className="flex items-center text-gray-700 hover:text-amber-700 transition-colors">
                      <i className="ri-scales-3-line mr-3 text-amber-600"></i>
                      <span>Standard measure: 1 Tola = 11.664 grams</span>
                    </li>
                    <li className="flex items-center text-gray-700 hover:text-amber-700 transition-colors">
                      <i className="ri-store-line mr-3 text-amber-600"></i>
                      <span>Official rates from NEGOSIDA</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <i className="ri-lightbulb-flash-line text-2xl text-amber-600 mr-3"></i>
                    <h3 className="text-xl font-semibold text-primary">Smart Investment Tips</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-700 hover:text-amber-700 transition-colors">
                      <i className="ri-timer-line mr-3 text-amber-600"></i>
                      <span>Best time to buy: Early morning rates</span>
                    </li>
                    <li className="flex items-center text-gray-700 hover:text-amber-700 transition-colors">
                      <i className="ri-shield-check-line mr-3 text-amber-600"></i>
                      <span>Always verify purity certification</span>
                    </li>
                    <li className="flex items-center text-gray-700 hover:text-amber-700 transition-colors">
                      <i className="ri-bank-line mr-3 text-amber-600"></i>
                      <span>Purchase from authorized dealers only</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <i className="ri-information-line text-2xl text-amber-600 mr-3"></i>
                  <h3 className="text-xl font-semibold text-primary">Understanding Metal Rates</h3>
                </div>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-700">Gold and silver prices in Nepal are measured in tola (11.664 grams). The rates are influenced by international market prices, import duties, and local demand-supply dynamics.</p>
                  <p className="text-gray-700">Fine Gold (Tejabi) is pure gold primarily used for investment, while 24K Gold is used in jewelry with minimal alloying. Understanding these differences is crucial for making informed investment decisions.</p>
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
