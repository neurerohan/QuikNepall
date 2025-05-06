import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForex } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import FadeIn from '@/components/ui/FadeIn';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const Forex = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/forex', { from: fromDate, to: toDate, page: currentPage, per_page: perPage }],
    enabled: false, // Don't fetch on component mount
    staleTime: 3600000 // 1 hour
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

  return (
    <MainLayout
      title="Forex Rates"
      description="Check current and historical foreign exchange rates for Nepali Rupee (NPR)."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-primary font-poppins mb-4 text-center">Forex Rates</h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto">
              Check current and historical foreign exchange rates for Nepali Rupee (NPR) against major currencies.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
              <div className="bg-primary p-4">
                <h2 className="text-xl font-semibold text-white">Search Forex Rates</h2>
                <p className="text-white/80 text-sm">Filter by date range to find historical rates</p>
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
                      className="bg-primary hover:bg-primary-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Searching...' : 'Search'}
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
                              // Show pages around current page
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
                    Set a date range and click Search to view forex rates.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">About Forex Rates</h3>
              <p className="mb-4">Foreign exchange rates displayed here are the official rates published by Nepal Rastra Bank, the central bank of Nepal.</p>
              <p className="mb-4">These rates are applicable for currency exchange and international transactions within Nepal.</p>
              <p>The buying rate is applicable when you sell foreign currency, and the selling rate applies when you buy foreign currency against Nepali Rupees (NPR).</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Forex;
