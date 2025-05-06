import MainLayout from '@/components/layout/MainLayout';
import DateConverterForm from '@/components/ui/DateConverterForm';
import FadeIn from '@/components/ui/FadeIn';

const DateConverter = () => {
  return (
    <MainLayout
      title="Date Converter"
      description="Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars easily with our date converter tool."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-primary font-poppins mb-4 text-center">Date Converter</h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto">
              Easily convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our simple conversion tool.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-primary p-4">
              <h3 className="text-xl font-semibold text-white">BS/AD Date Converter</h3>
              <p className="text-white/80 text-sm">Easily convert dates between Bikram Sambat and Gregorian calendars</p>
            </div>
            
            <DateConverterForm />
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-primary mb-4">About Nepali Date Conversion</h3>
            <p className="mb-4">The Bikram Sambat (BS) calendar is the official calendar of Nepal. It is approximately 56 years and 8 months ahead of the Gregorian (AD) calendar.</p>
            <p className="mb-4">The Nepali new year begins in mid-April (around the 13th or 14th) of the Gregorian calendar, which corresponds to the first day of the month of Baisakh in the BS calendar.</p>
            <p>Our date converter allows you to easily convert dates between these two calendar systems, helping you with travel planning, document preparation, or understanding Nepali holidays and events.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DateConverter;
