
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

const Forex = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' }
  ];

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

        {/* Quick Rate Cards */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {popularCurrencies.map((currency) => (
                <Card key={currency.code} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{currency.code}</h3>
                      <p className="text-sm text-gray-600">{currency.name}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Buying:</span>
                      <span className="font-medium">NPR {data?.rates?.[0]?.buyingRate || '---'}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Selling:</span>
                      <span className="font-medium">NPR {data?.rates?.[0]?.sellingRate || '---'}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Search Section */}
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

            {/* Information Section */}
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
