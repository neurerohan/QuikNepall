import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForex } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import FadeIn from '@/components/ui/FadeIn';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Forex = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [view, setView<'card' | 'list'>('card');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/forex', { from: fromDate, to: toDate, page: currentPage, per_page: perPage }],
    queryFn: () => getForex({ from: fromDate, to: toDate, page: currentPage, per_page: perPage }),
    enabled: false,
    staleTime: 3600000
  });

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const forexColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Currency', accessor: 'currency' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Buying Rate', accessor: 'buyingRate', cell: (value: number) => `Rs. ${value}` },
    { header: 'Selling Rate', accessor: 'sellingRate', cell: (value: number) => `Rs. ${value}` },
    { header: 'Middle Rate', accessor: 'middleRate', cell: (value: number) => `Rs. ${value}` },
  ];

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' }
  ];

  const marketInsights = [
    { title: 'Market Hours', content: 'Nepal Forex market operates Sunday-Friday, 10:00 AM - 3:00 PM NPT' },
    { title: 'Rate Updates', content: 'NRB updates rates twice daily at 10:00 AM and 3:00 PM NPT' },
    { title: 'Weekend Rates', content: 'Weekend rates are set on Friday and remain unchanged until Sunday' }
  ];

  const getCurrencyData = (currencyCode: string) => {
    return data?.rates?.find(rate => rate.currency === currencyCode);
  };

  return (
    <MainLayout
      title="Nepal Foreign Exchange Rates | Live Forex Rates in NPR"
      description="Get the latest foreign exchange rates for Nepali Rupee (NPR). Live and historical forex rates from Nepal Rastra Bank."
    >
      <FadeIn>
        {/* Hero Section */}
        <section className="py-8 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary font-poppins mb-4 text-center">
              Nepal Foreign Exchange Rates
            </h1>
            <p className="text-center text-neutral mb-8 max-w-3xl mx-auto">
              Get real-time foreign exchange rates from Nepal Rastra Bank (NRB). Updated daily for accurate currency conversion.
            </p>
          </div>
        </section>

        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            {/* Market Status Alert */}
            <Alert className="mb-8 bg-green-50 border-green-200">
              <i className="ri-time-line text-green-600 mr-2"></i>
              <AlertTitle>Market Status: Open</AlertTitle>
              <AlertDescription>
                Next rate update in: 2 hours 30 minutes
              </AlertDescription>
            </Alert>

            <div className="flex justify-end mb-4 space-x-2">
              <Button
                variant={view === 'card' ? 'default' : 'outline'}
                onClick={() => setView('card')}
                className="w-10 h-10 p-0"
              >
                <i className="ri-grid-fill"></i>
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                onClick={() => setView('list')}
                className="w-10 h-10 p-0"
              >
                <i className="ri-list-unordered"></i>
              </Button>
            </div>

            {view === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {popularCurrencies.map((currency) => {
                  const rateData = getCurrencyData(currency.code);
                  return (
                    <Card key={currency.code} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{currency.code}</h3>
                            <p className="text-sm text-gray-600">{currency.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Buy:</span>
                          <span className="font-medium">NPR {rateData?.buyingRate?.toFixed(2) || '---'}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">Sell:</span>
                          <span className="font-medium">NPR {rateData?.sellingRate?.toFixed(2) || '---'}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">Middle Rate:</span>
                          <span className="font-medium">NPR {rateData?.middleRate?.toFixed(2) || '---'}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="px-6 py-3 text-left">Currency</th>
                        <th className="px-6 py-3 text-right">Unit</th>
                        <th className="px-6 py-3 text-right">Buying Rate</th>
                        <th className="px-6 py-3 text-right">Selling Rate</th>
                        <th className="px-6 py-3 text-right">Middle Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.rates?.map((rate, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{rate.currency}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">{rate.unit}</td>
                          <td className="px-6 py-4 text-right">NPR {rate.buyingRate.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">NPR {rate.sellingRate.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">NPR {rate.middleRate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Historical Rate Search */}
            <Tabs defaultValue="popular" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="popular">Popular Currencies</TabsTrigger>
                <TabsTrigger value="all">All Currencies</TabsTrigger>
              </TabsList>

              <TabsContent value="popular">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularCurrencies.map((currency) => (
                    <Card
                      key={currency.code}
                      className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${selectedCurrency === currency.code ? 'border-primary' : ''}`}
                      onClick={() => setSelectedCurrency(currency.code)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{currency.code}</h3>
                            <p className="text-sm text-gray-600">{currency.name}</p>
                          </div>
                        </div>
                        {/* Removed trends section from popular currencies card */}
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Buy:</span>
                          <span className="font-medium">NPR {data?.rates?.[0]?.buyingRate || '---'}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">Sell:</span>
                          <span className="font-medium">NPR {data?.rates?.[0]?.sellingRate || '---'}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
                  <div className="bg-primary p-4">
                    <h2 className="text-xl font-semibold text-white">Historical Forex Rates</h2>
                    <p className="text-white/80 text-sm">Search exchange rates by date range</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <Label htmlFor="from-date" className="mb-1 block">From Date</Label>
                        <Input
                          id="from-date"
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="to-date" className="mb-1 block">To Date</Label>
                        <Input
                          id="to-date"
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleSearch}
                          className="bg-primary hover:bg-primary-dark w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Searching...' : 'Search Rates'}
                        </Button>
                      </div>
                    </div>

                    {data ? (
                      <>
                        <DataTable
                          columns={forexColumns}
                          data={data.rates || []}
                          isLoading={isLoading}
                        />

                        {data.totalPages > 1 && (
                          <div className="mt-4">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  />
                                </PaginationItem>

                                {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                                  let pageNum = currentPage - 2 + i;
                                  if (pageNum < 1) pageNum += 5;
                                  if (pageNum > data.totalPages) pageNum -= 5;

                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationLink
                                        onClick={() => handlePageChange(pageNum)}
                                        isActive={currentPage === pageNum}
                                      >
                                        {pageNum}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                })}

                                <PaginationItem>
                                  <PaginationNext
                                    onClick={() => handlePageChange(Math.min(currentPage + 1, data.totalPages))}
                                    className={currentPage === data.totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        )}
                      </>
                    ) : error ? (
                      <div className="bg-red-50 p-4 rounded-lg text-red-800">
                        Failed to load forex data. Please try again later.
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                        Set a date range and click Search to view historical forex rates.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Market Insights Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {marketInsights.map((insight, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">{insight.title}</h3>
                  <p className="text-gray-600">{insight.content}</p>
                </Card>
              ))}
            </div>

            {/* Information Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">About Nepal Forex Rates</h3>
                <p className="mb-4">Foreign exchange rates displayed here are the official rates published by Nepal Rastra Bank (NRB), the central bank of Nepal.</p>
                <p className="mb-4">These rates are applicable for currency exchange and international transactions within Nepal.</p>
                <p>The buying rate is applicable when you sell foreign currency, and the selling rate applies when you buy foreign currency against Nepali Rupees (NPR).</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary mb-4">Understanding Forex Rates</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <i className="ri-exchange-dollar-line text-green-600 text-xl mr-2"></i>
                    <span>Rates are updated daily by Nepal Rastra Bank</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-time-line text-green-600 text-xl mr-2"></i>
                    <span>Published twice daily on working days</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-bank-line text-green-600 text-xl mr-2"></i>
                    <span>Used by all commercial banks in Nepal</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-shield-check-line text-green-600 text-xl mr-2"></i>
                    <span>Official reference for all forex transactions</span>
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

export default Forex;