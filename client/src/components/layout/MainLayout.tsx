import { ReactNode } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Helmet } from 'react-helmet';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const MainLayout = ({ children, title = 'QuikNepal', description = 'Your Essential Nepali Information Hub' }: MainLayoutProps) => {
  const fullTitle = title === 'QuikNepal' ? title : `${title} | QuikNepal`;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Montserrat:wght@500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      </Helmet>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
