import { Link } from 'wouter';
import FadeIn from './FadeIn';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  linkText: string;
}

const FeatureCard = ({ title, description, icon, link, linkText }: FeatureCardProps) => {
  // Generate a random delay for staggered animations
  const randomDelay = Math.random() * 0.3;
  
  return (
    <FadeIn delay={randomDelay}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg group relative">
        {/* Animated gradient top border */}
        <div className="h-1 bg-gradient-to-r from-[#57c84d] via-[#83d475] to-[#57c84d] bg-[length:200%_100%] animate-gradient"></div>
        
        {/* Card content with hover effects */}
        <div className="p-6 relative">
          {/* Icon with animation */}
          <div className="w-14 h-14 bg-primary-light/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary-light/20 transition-all duration-300 group-hover:scale-110 transform">
            <i className={`ri-${icon}-line text-2xl text-primary group-hover:text-primary-dark group-hover:animate-pulse transition-colors duration-300`}></i>
          </div>
          
          {/* Card title with hover effect */}
          <h3 className="text-xl font-bold mb-3 font-montserrat text-neutral group-hover:text-primary transition-colors duration-300">{title}</h3>
          
          {/* Description with subtle animation */}
          <p className="text-gray-600 mb-5 group-hover:text-neutral transition-colors duration-300">{description}</p>
          
          {/* Button with interactive hover effects */}
          <Link 
            href={link} 
            className="inline-flex items-center text-primary font-medium group-hover:text-primary-dark transition-all duration-300 relative"
          >
            <span className="relative z-10">
              {linkText}
            </span>
            <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
            
            {/* Animated underline effect */}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary-dark group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {/* Background decoration (subtle) */}
          <div className="absolute top-3 right-3 w-20 h-20 rounded-full bg-primary-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </FadeIn>
  );
};

export default FeatureCard;
