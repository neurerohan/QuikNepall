
import MainLayout from '@/components/layout/MainLayout';
import DateConverterForm from '@/components/ui/DateConverterForm';
import FadeIn from '@/components/ui/FadeIn';
import Bounce from '@/components/ui/Bounce';
import { Link } from 'wouter';

// Festival dates data
const festivalDates = [
  {
    name: "Vijaya Dashami 2082",
    bs: "2082-07-01",
    ad: "October 15, 2025",
    icon: "ri-flag-line"
  },
  {
    name: "Tihar 2082",
    bs: "2082-07-15", 
    ad: "October 29, 2025",
    icon: "ri-fire-line"
  },
  {
    name: "Maghe Sankranti 2082",
    bs: "2082-09-01",
    ad: "January 14, 2026",
    icon: "ri-sun-line"
  },
  {
    name: "Holi 2082",
    bs: "2082-11-01",
    ad: "March 17, 2026",
    icon: "ri-palette-line"
  }
];

const features = [
  {
    icon: "ri-rocket-line",
    title: "Instant Conversion",
    description: "Quickly convert Nepali date into English (BS/AD) using our date convertor."
  },
  {
    icon: "ri-calendar-line",
    title: "Wide Date Range",
    description: "Translate Nepali date into English for years 1970-2090 BS."
  },
  {
    icon: "ri-smartphone-line",
    title: "Mobile Friendly",
    description: "Easy date converter English experience on all devices."
  }
];

const faqs = [
  {
    question: "How do I convert a Nepali date to English?",
    answer: "Use our Date Converter English tool: enter the BS year, month, and day. Click convert to instantly translate Nepali date into English (AD). It's a simple date convertor."
  },
  {
    question: "What is Bikram Sambat (BS)?",
    answer: "Bikram Sambat is Nepal's official calendar. This date converter English tool helps you convert BS dates to AD dates."
  },
  {
    question: "How accurate is this tool to convert Nepali date into English?",
    answer: "Our tool uses official data to accurately convert Nepali date into English (BS to AD) within the supported range. It's a reliable date convertor."
  },
  {
    question: "Can I convert English dates to Nepali using this date converter English?",
    answer: "Yes, this date converter English tool works both ways. Use the toggle to switch to AD to BS mode to translate English dates into Nepali."
  }
];

const DateConverter = () => {
  return (
    <MainLayout
      title="Date Converter - BS to AD & AD to BS | QuikNepal"
      description="Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our easy-to-use converter tool. Get accurate date conversions instantly."
    >
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-96 w-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Nepali Date Converter
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Instantly convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars with our reliable date converter.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Main Converter Section */}
      <section className="py-16 bg-white relative z-20 -mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
              <DateConverterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Festival Dates Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Popular Festival Dates
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {festivalDates.map((festival, index) => (
                <Bounce key={index} delay={index * 0.1}>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <i className={`${festival.icon} text-2xl text-primary mr-3`}></i>
                      <h3 className="font-semibold text-gray-800">{festival.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">BS: {festival.bs}</p>
                      <p className="text-sm text-gray-600">AD: {festival.ad}</p>
                    </div>
                  </div>
                </Bounce>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Why Use Our Date Converter?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Bounce key={index} delay={index * 0.1}>
                  <div className="text-center p-6">
                    <div className="inline-block p-4 bg-primary-light/10 rounded-full text-primary mb-4">
                      <i className={`${feature.icon} text-3xl`}></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Bounce>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Bounce key={index} delay={index * 0.1}>
                  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </Bounce>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold mb-6">
              Convert Nepali Date into English Easily!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Use our free date converter tool to translate dates instantly. Accurate conversion for all your needs.
            </p>
            <Bounce>
              <Link href="#converter" className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300">
                Use Date Converter Now
              </Link>
            </Bounce>
          </FadeIn>
        </div>
      </section>
    </MainLayout>
  );
};

export default DateConverter;
