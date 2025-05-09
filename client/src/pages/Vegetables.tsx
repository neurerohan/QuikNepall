
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVegetables } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import FadeIn from '@/components/ui/FadeIn';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Vegetables = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'table' | 'card'>('table');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/vegetables'],
    queryFn: getVegetables,
    staleTime: 3600000
  });

  const filteredData = data?.filter((item: any) => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name_nepali?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formattedData = filteredData.map((item: any) => ({
    name: item.name_nepali ? `${item.name} (${item.name_nepali})` : item.name,
    unit: item.unit,
    minPrice: parseFloat(item.min_price),
    maxPrice: parseFloat(item.max_price),
    avgPrice: parseFloat(item.avg_price),
    priceTrend: calculateTrend(parseFloat(item.min_price), parseFloat(item.max_price))
  }));

  function calculateTrend(min: number, max: number): string {
    const diff = max - min;
    if (diff > 20) return 'up';
    if (diff < 10) return 'down';
    return 'stable';
  }

  const vegetableColumns = [
    { header: 'Item', accessor: 'name' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Min Price', accessor: 'minPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Max Price', accessor: 'maxPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Avg Price', accessor: 'avgPrice', cell: (value: number) => `Rs. ${value}` },
    { 
      header: 'Trend', 
      accessor: 'priceTrend', 
      cell: (value: string) => {
        if (value === 'up') return <i className="ri-arrow-up-line text-red-500"></i>;
        if (value === 'down') return <i className="ri-arrow-down-line text-green-500"></i>;
        return <i className="ri-subtract-line text-gray-500"></i>;
      } 
    },
  ];

  return (
    <MainLayout
      title="कालिमाटी तरकारी रेट टुडे | Kalimati Tarkari Rate Today"
      description="Daily updates on the official kalimati tarkari bazar rate today from Nepal's largest wholesale market in Kalimati, Kathmandu."
    >
      <FadeIn>
        {/* Hero Section */}
        <section className="py-8 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-poppins mb-4 text-center">
              कालिमाटी तरकारी रेट टुडे
            </h1>
            <p className="text-center text-neutral mb-8 max-w-3xl mx-auto">
              Daily updates on the official kalimati tarkari bazar rate today from Nepal's largest wholesale market in Kalimati, Kathmandu. 
              Check today's wholesale and retail तरकारी prices, updated every morning for the best deals.
            </p>

            {/* Market Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <i className="ri-time-line text-2xl text-primary"></i>
                  <h3 className="font-semibold">Market Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Wholesale: 4:00 AM - 9:00 AM</p>
                  <p>Retail: 9:00 AM - 8:00 PM</p>
                  <p className="text-primary-dark mt-2 font-medium">Best Time: Early Morning</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <i className="ri-store-2-line text-2xl text-primary"></i>
                  <h3 className="font-semibold">Market Status</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-green-600">Open (Kalimati)</p>
                  <p>Price Trend: Stable</p>
                  <p className="text-primary-dark mt-2">Location: Kalimati, Kathmandu</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <i className="ri-refresh-line text-2xl text-primary"></i>
                  <h3 className="font-semibold">Last Updated</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>{new Date().toLocaleDateString()}</p>
                  <p>02:14 AM</p>
                  <p className="text-primary-dark mt-2">Updated daily</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price List Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">Today's Vegetable Rates</h2>
                  <p className="text-sm text-gray-500">Daily price updates from Kalimati Market</p>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="w-full md:w-64">
                    <Input
                      type="text"
                      placeholder="Search vegetables..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Tabs defaultValue={view} className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="table" onClick={() => setView('table')}>Table</TabsTrigger>
                      <TabsTrigger value="card" onClick={() => setView('card')}>Cards</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              {error ? (
                <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-6">
                  Failed to load vegetable prices. Please try again later.
                </div>
              ) : view === 'table' ? (
                <DataTable
                  columns={vegetableColumns}
                  data={formattedData}
                  isLoading={isLoading}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formattedData.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-primary-dark">{item.name}</h3>
                        <span className="text-sm bg-primary-light/10 text-primary px-2 py-1 rounded">
                          {item.unit}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Minimum</span>
                          <span className="font-medium text-green-600">Rs. {item.minPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Maximum</span>
                          <span className="font-medium text-red-600">Rs. {item.maxPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Average</span>
                          <span className="font-medium text-primary">Rs. {item.avgPrice}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Price Trend</span>
                            <span className="flex items-center gap-1">
                              {item.priceTrend === 'up' && <i className="ri-arrow-up-line text-red-500"></i>}
                              {item.priceTrend === 'down' && <i className="ri-arrow-down-line text-green-500"></i>}
                              {item.priceTrend === 'stable' && <i className="ri-subtract-line text-gray-500"></i>}
                              <span className="text-sm font-medium">
                                {item.priceTrend === 'up' ? 'Rising' : item.priceTrend === 'down' ? 'Falling' : 'Stable'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Market Information Section */}
              <div className="mt-16 space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-primary mb-4">Why Do Prices Change?</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="flex items-start gap-3">
                      <i className="ri-cloud-line text-xl text-primary mt-1"></i>
                      <div>
                        <h4 className="font-medium">Weather</h4>
                        <p className="text-sm text-gray-600">Affects crop yield & prices</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-plant-line text-xl text-primary mt-1"></i>
                      <div>
                        <h4 className="font-medium">Seasonality</h4>
                        <p className="text-sm text-gray-600">Impacts availability & rates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-gas-station-line text-xl text-primary mt-1"></i>
                      <div>
                        <h4 className="font-medium">Fuel Costs</h4>
                        <p className="text-sm text-gray-600">Affects transportation costs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-exchange-line text-xl text-primary mt-1"></i>
                      <div>
                        <h4 className="font-medium">Supply/Demand</h4>
                        <p className="text-sm text-gray-600">Market dynamics influence prices</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-primary mb-4">Shopping Tips</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <i className="ri-time-line text-primary"></i>
                        Best Time to Visit
                      </h4>
                      <p className="text-sm text-gray-600">Visit early morning between 4-7 AM for wholesale rates and freshest produce</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <i className="ri-money-dollar-circle-line text-primary"></i>
                        Price Negotiation
                      </h4>
                      <p className="text-sm text-gray-600">Compare prices from multiple vendors and negotiate for bulk purchases</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <i className="ri-calendar-line text-primary"></i>
                        Seasonal Buying
                      </h4>
                      <p className="text-sm text-gray-600">Buy seasonal vegetables for better quality and lower prices</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-primary mb-4">About Kalimati Market</h3>
                  <p className="text-gray-600 mb-4">
                    Kalimati Fruits and Vegetable Market is Nepal's largest wholesale market, located in Kalimati, Kathmandu. 
                    It serves as the primary distribution hub for fresh produce in the Kathmandu Valley, setting benchmark prices 
                    for vegetables across the region.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Wholesale Market Hours</h4>
                      <p className="text-sm text-gray-600">4:00 AM - 9:00 AM (Best deals early morning)</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Retail Market Hours</h4>
                      <p className="text-sm text-gray-600">9:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </MainLayout>
  );
};

export default Vegetables;
