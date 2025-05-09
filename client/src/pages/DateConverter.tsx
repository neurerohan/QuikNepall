
import MainLayout from '@/components/layout/MainLayout';
import DateConverterForm from '@/components/ui/DateConverterForm';
import FadeIn from '@/components/ui/FadeIn';
import Bounce from '@/components/ui/Bounce';

const DateConverter = () => {
  return (
    <MainLayout
      title="Date Converter - BS to AD & AD to BS"
      description="Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our easy-to-use converter tool. Get accurate date conversions instantly."
    >
      <FadeIn>
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-poppins mb-4 text-center animate-fadeIn">
              Nepali Date Converter
            </h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto animate-fadeIn delay-100">
              Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our powerful conversion tool.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Bounce>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-primary to-primary-dark p-6">
                  <h3 className="text-2xl font-semibold text-white">BS/AD Date Converter</h3>
                  <p className="text-white/90 text-sm mt-2">Convert dates between Bikram Sambat and Gregorian calendars instantly</p>
                </div>
                
                <DateConverterForm />
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-primary mb-4">Understanding Nepali Calendar</h3>
                  <p className="mb-4 text-gray-700">The Bikram Sambat (BS) calendar is approximately 56 years and 8 months ahead of the Gregorian calendar and has been Nepal's official calendar since 1903.</p>
                  <p className="text-gray-700">The Nepali new year begins in mid-April, marking the start of the month of Baisakh.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-primary mb-4">Quick Facts</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <i className="ri-calendar-line mr-2 text-primary"></i>
                      <span>12 months in a year</span>
                    </li>
                    <li className="flex items-center">
                      <i className="ri-time-line mr-2 text-primary"></i>
                      <span>29-32 days per month</span>
                    </li>
                    <li className="flex items-center">
                      <i className="ri-sun-line mr-2 text-primary"></i>
                      <span>New year starts in mid-April</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 bg-gradient-to-r from-gray-50 to-white p-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-primary mb-6">Common Use Cases</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <i className="ri-file-list-line text-2xl text-primary mb-2"></i>
                    <h4 className="font-semibold mb-2">Official Documents</h4>
                    <p className="text-sm text-gray-600">Convert dates for legal documents and certificates</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <i className="ri-calendar-event-line text-2xl text-primary mb-2"></i>
                    <h4 className="font-semibold mb-2">Event Planning</h4>
                    <p className="text-sm text-gray-600">Plan events according to both calendars</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <i className="ri-history-line text-2xl text-primary mb-2"></i>
                    <h4 className="font-semibold mb-2">Historical Dates</h4>
                    <p className="text-sm text-gray-600">Convert historical dates between systems</p>
                  </div>
                </div>
              </div>
            </div>
          </Bounce>
        </div>
      </section>
    </MainLayout>
  );
};

export default DateConverter;
